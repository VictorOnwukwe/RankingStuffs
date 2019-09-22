<template>
  <div id="main">
    <div v-if="fetched" id="profile-container">
      <v-card v-if="user!== {}" tile flat height="100%">
        <v-icon
          v-if="isProfile"
          color="accent"
          style="position:absolute; top:1em;right:1em"
          @click="showSetting = true"
        >mdi-pencil</v-icon>
        <v-card-text>
          <v-layout :column="$vuetify.breakpoint.xs ? true : false">
            <v-flex shrink>
            <v-layout class="ml-3 mr-6 mb-6" column :align-center="$vuetify.breakpoint.xs ? true : false">
              <v-avatar size="150px" class="mb-3">
                <img :src="user.profile_pic" />
              </v-avatar>

              <div v-if="!isProfile" class="mt-4">
                <v-btn
                  v-if="!following"
                  @click="follow()"
                  small
                  rounded
                  outlined
                  color="brand"
                >Follow</v-btn>
                
                <v-hover v-else v-slot:default="{ hover }">
                  <v-btn @click="unfollow()" small rounded dark :color="hover ? 'accent' : 'brand'">{{hover ? 'unfollow' : 'Following'}}</v-btn>
                </v-hover>
              </div>
            </v-layout>
            </v-flex>
            <v-layout :justify-center="$vuetify.breakpoint.xs ? true : false">
              <div>
              <h2 v-if="user.name" class="title font-weight-black" style="line-height:1.1em">{{user.name}}</h2>
              <p :class="user.name ? 'subtitle-1 secondary-text-dark mt-n1 font-weight-bold' : 'title font-weight-black'">@{{user.username}}</p>
              <div v-if="user.bio" style="white-space:pre-wrap; max-width:30em">
                <p
                  class="subtitle-2 primary-text-dark text-justify text-break font-weight-medium"
                >{{user.bio}}</p>
              </div>
              <v-layout justify-start align-center wrap>
                <v-flex v-if="this.user.created">
                  <v-icon color="grey">mdi-calendar-month</v-icon>
                  <span class="secondary-text-dark font-weight-medium">&nbsp;Joined {{joined}}</span>
                </v-flex>
                <v-flex v-if="user.country">
                <v-layout class="ml-2">
                  <v-icon color="grey" class="mr-2">mdi-map-marker-outline</v-icon>
                  <country-flag :country="user.country.code"/>
                </v-layout>
                </v-flex>
                <v-flex v-if="user.DOB">
                <v-layout>
                  <v-icon>mdi-balloon</v-icon>
                  <span class="secondary-text-dark font-weight-medium">Born {{DOB}}</span>
                </v-layout>
                </v-flex>
              </v-layout>
              <v-layout class="mt-2 black--text">
                <div>
                  <span class="subtitle-1 primary-text-dark font-weight-black">{{user.followers}}</span>
                  <a class="subtitle-1 secondary-text-dark font-weight-medium">&nbsp;{{user.followers == 1 ? 'Follower' : 'Followers'}}</a>
                </div>
                <div class="ml-3">
                  <span class="subtitle-1 primary-text-dark font-weight-black">{{user.following}}</span>
                  <a class="subtitle-1 secondary-text-dark font-weight-medium">&nbsp;Following</a>
                </div>
              </v-layout>
              </div>
            </v-layout>
          </v-layout>
        </v-card-text>
      </v-card>
      <v-layout
        justify-space-around
        style="border-bottom:1px solid var(--dark-divider)"
        class="mt-4"
      >
        <div
          v-if="isProfile"
          @click="setActive('notifications')"
          class="nav-item"
          :class="active === 'notifications' ? 'border' : null"
        >
          <a
            class="primary-text-dark subtitle-1 font-weight-medium"
            :class="active=== 'notifications' ? 'brand--text' : null"
          >Creations</a>
        </div>
        <div @click="setActive('')" class="nav-item" :class="active === '' ? 'border' : null">
          <a
            class="primary-text-dark subtitle-1 font-weight-medium"
            :class="active=== '' ? 'brand--text' : null"
          >Favorites</a>
        </div>
        <div
          @click="setActive('timeline')"
          class="nav-item"
          :class="active === 'timeline' ? 'border' : null"
        >
          <a
            class="primary-text-dark subtitle-1 font-weight-medium"
            :class="active=== 'timeline' ? 'brand--text' : null"
          >Timeline</a>
        </div>
        <!-- <div @click="goActivities(), toggleActive('act')" class="nav-item brand" :class="{'darken-2': act, brand: !act}">
            <a>Activities</a>
        </div>-->
      </v-layout>
      <v-card tile flat>
        <v-card-text>
          <v-layout justify-center>
            <router-view :user="userID" :isProfile="isProfile"></router-view>
          </v-layout>
        </v-card-text>
      </v-card>
    </div>
    <div v-else>Loading...</div>
    <v-dialog v-model="showSetting" max-width="600px" persistent>
      <Settings v-if="showSetting" @closeMe="showSetting = false"></Settings>
    </v-dialog>
  </div>
</template>

<script>
import Settings from "./ProfileSetting";
import CountryFlag from "vue-country-flag";
let moment = require("moment");
export default {
  components: {
    Settings,
    CountryFlag
  },
  data() {
    return {
      user: {},
      isProfile: false,
      active: "",
      following: null,
      showSetting: false,
      fetched: false
    };
  },
  methods: {
    async fetchUser(id) {
      await this.$store.dispatch("fetch_user", id).then(user => {
        this.user = user;
      });
    },
    follow() {
      this.$store.dispatch("follow_user", this.user).then(() => {
        this.following = true;
      });
    },
    unfollow() {
      this.$store.dispatch("unfollow_user", this.user.id).then(() => {
        this.following = false;
      });
    },
    async matchProfile() {
      if (this.userID === this.$store.getters.getUser.id) {
        this.isProfile = true;
      } else {
        await this.checkFollowing();
      }
      return;
    },
    setActive(val) {
      this.active = val;
      this.$router.push({
        path: this.homeLink + val
      });
    },
    selectImage() {
      this.$refs.profile.click();
    },
    onFileSelect(event) {
      const files = event.target.files;
      let fileName = files[0].name;
      if (fileName.lastIndexOf(".") <= 0) {
        return alert("Invalid File Selected...");
      }

      let imageUrl;
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        imageUrl = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.profile_pic = files[0];
    },
    showSettings() {
      let elem = document.querySelector("#settings");
      elem.classList.add("animated", "rubberBand");
    },
    hideSidebar() {
      this.$store.commit("setSidebar", false);
    },
    goSetting() {
      this.$router.push({ path: this.homeLink + "/settings" });
    },
    goCreation() {
      this.$router.push({ path: this.homeLink + "/notifications" });
    },
    goFavorites() {
      this.$router.push({
        path: this.homeLink + "/favorites"
      });
    },
    goTimeline() {},
    goActivities() {
      return;
    },
    async checkFollowing() {
      await this.$store
        .dispatch("check_following", this.userID)
        .then(result => {
          this.following = result;
        });
    }
  },
  computed: {
    userID() {
      return this.$route.params.id;
    },
    joined() {
      return moment(this.user.created.toDate()).format("MMMM YYYY");
    },
    DOB(){
      return moment(this.user.DOB).format("MMMM D, YYYY");
    },
    homeLink() {
      return "/" + this.user.id + "/profile/";
    },
    isUser() {
      return this.$store.getters.getUser.id === this.user.id;
    }
  },
  watch: {
    userID() {
      this.fetched = false;
      this.isProfile = false;
      this.following = false;
      this.fetchUser(this.$route.params.id).then(async () => {
        this.matchProfile()
          .then(() => {
            let path = window.location.href;
            let to = path.slice(path.lastIndexOf("/") + 1);
            console.log(to);
            to = "profile"
              ? this.setActive("")
              : this.setActive(path.slice(path.lastIndexOf("/") + 1));
          })
          .then(() => {
            this.fetched = true;
          });
      });
    }
  },
  mounted: function() {
    this.fetchUser(this.userID).then(() => {
      this.matchProfile()
        .then(() => {
          let path = window.location.href;
          let to = path.slice(path.lastIndexOf("/") + 1);
          console.log(to);
          to = "profile" ? this.setActive("") : this.setActive(to);
        })
        .then(() => {
          this.fetched = true;
        });
    });
  }
};
</script>

<style scoped>
#container {
  display: flex;
}
#profile-container {
  /* background-image: linear-gradient(90deg, rgb(5, 26, 53), rgb(8, 47, 99)); */
  margin: 0 auto;
  max-width: 950px;
}
#user-details {
  display: flex;
}
.border {
  border-bottom: 5px solid var(--brand);
}
</style>
