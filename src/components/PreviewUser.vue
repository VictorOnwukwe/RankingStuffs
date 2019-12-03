<template>
  <div>
    <v-card tile v-if="fetched" style="position:relative">
      <v-layout class="close" style="">
        <v-spacer></v-spacer>
        <div class="close-button" style="">
          <v-icon class="close-btn" @click="closeUserDialog()"
            >mdi-close</v-icon
          >
        </div>
      </v-layout>
      <div style="width:100%; position:relative;margin-top:-26px">
        <div></div>
        <v-img
          v-if="user.profile_pic"
          :src="user.profile_pic.high"
          width="100%"
          aspect-ratio="1.5"
        ></v-img>
        <v-img
          v-else
          :src="require('../assets/nophoto.jpg')"
          width="100%"
          aspect-ratio="1.5"
        ></v-img>
      </div>
      <v-card-title>
        <v-layout column>
          <h2 v-if="user.name" class="title font-weight-black">
            {{ user.name }}
          </h2>
          <div
            :class="
              user.name
                ? 'subtitle-1 std mt-n2 font-weight-bold'
                : 'title font-weight-black ptd'
            "
          >
            @{{ user.username }}
          </div>
        </v-layout>
      </v-card-title>
      <v-card-text>
        <p class="ptd subtitle-2">{{ user.bio }}</p>
        <v-layout class="mt-n2">
          <div v-if="user.DOB">
            <span class="std font-weight-medium">{{ DOB }}</span>
          </div>
          <div v-if="user.sex">
            <span class="std font-weight-medium"
              >{{ user.DOB ? ",&nbsp;" : "" }}{{ user.sex }}</span
            >
          </div>
          <div v-if="user.country || user.city || user.state">
            <span v-if="user.sex || user.DOB" class="std font-weight-medium"
              >,&nbsp;</span
            >
            <span class="std font-weight-medium" v-if="user.city"
              >{{ user.city
              }}{{ user.state || user.country ? ",&nbsp;" : "" }}</span
            >
            <span class="std font-weight-medium" v-if="user.state"
              >{{ user.state }}{{ user.country ? ",&nbsp;" : "" }}</span
            >
            <span class="std font-weight-medium" v-if="user.country">{{
              user.country.name
            }}</span>
          </div>
        </v-layout>
        <p class="subtitle-2 std">Joined {{ userCreated }}</p>
        <v-layout class="black--text mt-n4" wrap>
          <div class="mr-3">
            <span class="subtitle-1 ptd font-weight-bold">{{
              user.followers ? user.followers : 0
            }}</span>
            <a class="subtitle-1 std font-weight-medium"
              >&nbsp;{{ user.followers == 1 ? "Follower" : "Followers" }}</a
            >
          </div>
          <div>
            <span class="subtitle-1 ptd font-weight-bold">{{
              user.following ? user.following : 0
            }}</span>
            <a class="subtitle-1 std font-weight-medium">&nbsp;Following</a>
          </div>
        </v-layout>
        <!-- <p v-for="n in 20">n</p> -->
      </v-card-text>
      <!-- <v-divider></v-divider> -->
      <v-card-actions class="">
        <!-- <v-spacer></v-spacer>
        <v-btn small color="brand" text>Close</v-btn>
        <v-btn small color="brand" outlined @click="goUser()">Profile</v-btn> -->
        <v-layout justify-space-around class="accent darken-1 foot">
          <router-link :to="'/' + this.user.id + '/profile'" class="no-deco">
            <v-flex shrink class="py-1 foot-item" style="padding:0 3em">
              <v-layout column align-center justify-end
                ><v-icon color="white" size="1.5em">mdi-home</v-icon>
                <span class="subtitle-2 white--text">Profile</span>
              </v-layout>
            </v-flex>
          </router-link>
          <v-flex
            @click="toggleFollowing()"
            shrink
            class="py-1 foot-item pointer"
            style="padding:0 3em"
            v-if="!isProfile"
          >
            <v-layout column align-center>
                <v-icon class="" v-if="!processing" style="margin-top:0.15em" size="1.3em" color="white">fa-plus</v-icon>
                <span v-if="!processing" class="subtitle-2 white--text">{{
                  following ? "Following" : "Follow"
                }}</span>
              <div v-else>
                <m-progress></m-progress>
              </div>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <v-layout justify-center>
        <v-progress-circular
          class="my-8"
          color="brand"
          indeterminate
        ></v-progress-circular>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
let moment = require("moment");
export default {
  props: {
    id: String
  },
  data() {
    return {
      following: null,
      isProfile: false,
      fetched: false,
      user: null,
      processing: false
    };
  },
  methods: {
    closeUserDialog() {
      this.$emit("close");
    },
    goUser() {
      let link = "/" + this.user.id + "/profile";
      this.$router.push({ path: link });
    },
    toggleFollowing() {
      this.following ? this.unfollow() : this.follow();
    },
    follow() {
      this.processing = true;
      this.$store.dispatch("follow_user", this.user).then(() => {
        this.following = true;
        this.processing = false;
        this.user.followers ? this.user.followers++ : (this.user.followers = 1);
      });
    },
    unfollow() {
      this.processing = true;
      this.$store.dispatch("unfollow_user", this.user.id).then(() => {
        this.following = false;
        this.processing = false;
        this.user.followers--;
      });
    },
    async checkFollowing() {
      await this.$store
        .dispatch("check_following", this.user.id)
        .then(result => {
          this.following = result;
        });
    },
    async matchUser() {
      if (!this.$store.getters.authenticated) {
        return;
      }
      if (this.user.id === this.$store.getters.getUser.id) {
        this.isProfile = true;
      } else {
        await this.checkFollowing();
      }
    },
    async fetchUser() {
      await this.$store.dispatch("fetch_complete_user", this.id).then(user => {
        this.user = user;
      });
    }
  },
  computed: {
    userCreated() {
      return moment(this.user.created.toDate()).calendar();
    },
    isUser() {
      return this.$store.getters.getUser.id === this.user.id;
    },
    DOB() {
      let years = moment(this.user.DOB).fromNow();
      return years.slice(0, years.indexOf(" "));
    }
  },
  mounted: async function() {
    await this.fetchUser();
    this.matchUser().then(() => {
      this.fetched = true;
    });
  }
};
</script>

<style scoped>
.foot {
  /* border-top-right-radius: 16px;
  border-top-left-radius: 16px; */
  border-radius: 16px;
  /* position: sticky;
  bottom: 0; */
}
.close {
  position: sticky;
  top: 0;
  background-color: rgba(0, 0, 0, 0);
  right: 0;
  transform: translateY(0%);
  z-index: 4;
}
.close-button {
  background-color: rgba(0, 0, 0, 0.7);
  width: 26px;
  height: 26px;
  z-index: 4;
  display: flex;
  justify-content: center;
}
.close-btn {
  color: white;
}
.close-btn:hover {
  color: rgb(212, 12, 12);
}
.foot-item:hover {
  background-color: #55a955 !important;
}
</style>
