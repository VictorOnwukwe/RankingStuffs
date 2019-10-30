<template>
  <div>
    <v-card v-if="fetched">
      <div style="width:100%; position:relative">
        <v-img :src="user.profile_pic.high" width="100%" aspect-ratio="1.5"></v-img>
        <div v-if="!isProfile" style="position:absolute; bottom:-0.7em;right:1em" class="mt-2">
          <v-btn
            v-if="!following"
            @click="follow()"
            :loading="processing"
            small
            color="accent"
            rounded
            dark
          >Follow</v-btn>

          <v-hover v-else v-slot:default="{ hover }">
            <v-btn
              @click="unfollow()"
              small
              depressed
              :loading="processing"
              dark
              rounded
              color="accent"
            >{{hover ? 'unfollow' : 'Following'}}</v-btn>
          </v-hover>
        </div>
      </div>
      <v-card-title>
        <v-layout column>
          <h2 v-if="user.name" class="title font-weight-black">{{user.name}}</h2>
          <div
            :class="user.name ? 'subtitle-1 secondary-text-dark mt-n2 font-weight-bold' : 'title font-weight-black primary-text-dark'"
          >@{{user.username}}</div>
        </v-layout>
      </v-card-title>
      <v-card-text>
        <v-layout class="mt-n2">
          <div v-if="user.DOB">
            <span class="secondary-text-dark font-weight-medium">{{DOB}}</span>
          </div>
          <div v-if="user.sex">
            <span class="secondary-text-dark font-weight-medium">{{user.DOB ? ",&nbsp;" : ""}}{{user.sex}}</span>
          </div>
          <div v-if="user.country || user.city || user.state">
            <span v-if="user.sex || user.DOB" class="secondary-text-dark font-weight-medium">,&nbsp;</span>
            <span
              class="secondary-text-dark font-weight-medium"
              v-if="user.city"
            >{{user.city}}{{user.state || user.country ? ",&nbsp;" : ""}}</span>
            <span
              class="secondary-text-dark font-weight-medium"
              v-if="user.state"
            >{{user.state}}{{user.country ? ",&nbsp;" : ""}}</span>
            <span
              class="secondary-text-dark font-weight-medium"
              v-if="user.country"
            >{{user.country.name}}</span>
          </div>
        </v-layout>
        <p class="subtitle-2 secondary-text-dark">Joined {{userCreated}}</p>
        <v-layout class="black--text mt-n4" wrap>
          <div class="mr-3">
            <span
              class="subtitle-1 primary-text-dark font-weight-bold"
            >{{user.followers ? user.followers : 0}}</span>
            <a
              class="subtitle-1 secondary-text-dark font-weight-medium"
            >&nbsp;{{user.followers == 1 ? 'Follower' : 'Followers'}}</a>
          </div>
          <div>
            <span
              class="subtitle-1 primary-text-dark font-weight-bold"
            >{{user.following ? user.following : 0}}</span>
            <a class="subtitle-1 secondary-text-dark font-weight-medium">&nbsp;Following</a>
          </div>
        </v-layout>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small color="brand" text @click="closeUserDialog()">Close</v-btn>
        <v-btn small color="brand" outlined @click="goUser()">Profile</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <v-layout justify-center>
        <v-progress-circular class="my-8" color="brand" indeterminate></v-progress-circular>
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
    follow() {
      this.processing = true;
      this.$store.dispatch("follow_user", this.user).then(() => {
        this.following = true;
        this.processing = false;
        this.user.followers ? this.user.followers++ : this.user.followers = 1
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
      if(!this.$store.getters.authenticated){
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
</style>