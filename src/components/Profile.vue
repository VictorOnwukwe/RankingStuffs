<template>
  <div>
    <v-layout>
      <v-flex xs12 v-if="fetched" class="mt">
        <v-card v-if="user !== {}" tile flat color>
          <v-layout
            v-if="isProfile"
            column
            class
            style="position:absolute; top:1em;right:1em;"
          >
            <v-icon size="0.8em" color="grey" @click="showSetting = true"
              >fa-pencil-alt</v-icon
            >
            <span
              @click="showSetting = true"
              class="pointer"
              style="font-size:0.7em"
              >Edit Profile</span
            >
          </v-layout>

          <v-card-text class="pa-0">
            <v-layout :column="$vuetify.breakpoint.smAndDown ? true : false">
              <v-flex class="mt-4" shrink>
                <v-layout
                  class="ml-4 mr-6 mb-6"
                  column
                  :align-center="$vuetify.breakpoint.xs ? true : false"
                >
                  <v-hover v-slot:default="{ hover }">
                    <v-avatar
                      :size="$vuetify.breakpoint.xs ? '150px' : '200px'"
                      @click="showDP = true"
                      tile
                    >
                      <img
                        v-if="user.profile_pic"
                        :src="user.profile_pic.low"
                        class="br"
                      />
                      <img class="br" v-else :src="require('../assets/nophoto.jpg')" />
                      <v-fade-transition>
                        <v-overlay
                          v-if="(hover || uploadMenu) && isProfile"
                          absolute
                          color="#000000b3"
                        >
                          <div
                            v-if="isProfile"
                            class="upload-bg pointer"
                            @click.stop="openEdit()"
                          >
                            <v-icon color="accent">mdi-camera</v-icon>
                          </div>
                        </v-overlay>
                      </v-fade-transition>
                    </v-avatar>
                  </v-hover>
                </v-layout>
              </v-flex>
              <v-layout
                class="mt-4 px-2"
                :justify-center="$vuetify.breakpoint.xs ? true : false"
              >
                <div>
                  <h2 v-if="user.name" class="font-weight-black ptd">
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

                  <p
                    class="ptd font-weight-medium text-justify mt-2"
                    v-if="user.bio"
                  >
                    {{ user.bio }}
                  </p>
                  <v-layout wrap class="mt-n2">
                    <div
                      class="mt-2"
                      v-if="user.country || user.city || user.state"
                    >
                      <v-layout class="mr-4">
                        <v-icon color="grey" class="mr-2 fa-icon" size="1.3em"
                          >fa-map-marker-alt</v-icon
                        >
                        <span class="std font-weight-medium" v-if="user.city"
                          >{{ user.city
                          }}{{
                            user.state || user.country ? ",&nbsp;" : ""
                          }}</span
                        >
                        <span class="std font-weight-medium" v-if="user.state"
                          >{{ user.state
                          }}{{ user.country ? ",&nbsp;" : "" }}</span
                        >
                        <span
                          class="std font-weight-medium"
                          v-if="user.country"
                          >{{ user.country.name }}</span
                        >
                      </v-layout>
                    </div>
                    <div class="mt-2" v-if="user.DOB">
                      <v-layout>
                        <v-icon color="grey" class="mr-2" size="1.3em"
                          >fa-birthday-cake</v-icon
                        >
                        <span class="std font-weight-medium"
                          >Born {{ DOB }}</span
                        >
                      </v-layout>
                    </div>
                  </v-layout>
                  <v-layout class="mt-2">
                    <div>
                      <v-icon style="margin-left:-0.1em" color="grey"
                        >mdi-calendar-month</v-icon
                      >
                      <span class="std font-weight-medium"
                        >&nbsp;Joined {{ joined }}</span
                      >
                    </div>
                  </v-layout>
                  <v-layout class="mt-2 black--text" wrap>
                    <div class="mr-3">
                      <span class="subtitle-1 ptd font-weight-bold">{{
                        user.followers ? user.followers : 0
                      }}</span>
                      <a class="std font-weight-medium"
                        >&nbsp;{{
                          user.followers == 1 ? "Follower" : "Followers"
                        }}</a
                      >
                    </div>
                    <div>
                      <span class="subtitle-1 ptd font-weight-bold">{{
                        user.following ? user.following : 0
                      }}</span>
                      <a class="std font-weight-medium">&nbsp;Following</a>
                    </div>
                  </v-layout>
                  <div v-if="!isProfile" class="mt-2">
                    <m-btn
                      v-if="!following"
                      @click="follow()"
                      :loading="processing"
                      small
                      outlined
                      >Follow</m-btn
                    >

                    <v-hover v-else v-slot:default="{ hover }">
                      <m-btn
                        @click="unfollow()"
                        small
                        depressed
                        :loading="processing"
                        dark
                        >{{ hover ? "unfollow" : "Following" }}</m-btn
                      >
                    </v-hover>
                  </div>
                  <!-- <v-card v-if="user.bio" flat tile class="mt-4">
                    <v-card-title class="pa-0" style="font-size:1em; font-weight:bold;">About</v-card-title>
                    <v-card-text class="px-0">
                      <div style="white-space:pre-wrap; max-width:40em">
                        <p class="subtitle-2 ptd text-justify font-weight-medium">{{user.bio}}</p>
                      </div>
                    </v-card-text>
                  </v-card> -->
                </div>
              </v-layout>
            </v-layout>
            <v-layout
              justify-space-around
              style="border-bottom:1px solid var(--dark-divider)"
              class="mt-8"
            >
              <div class="nav-item">
                <router-link
                  :to="homeLink + 'creations'"
                  class="nav-link subtitle-1 font-weight-medium"
                  >Creations</router-link
                >
              </div>
              <div class="nav-item">
                <router-link
                  tag="a"
                  :to="homeLink"
                  class="nav-link subtitle-1 font-weight-medium"
                  >Favorites</router-link
                >
              </div>
              <div class="nav-item">
                <router-link
                  tag="a"
                  :to="homeLink + 'activities'"
                  class="nav-link subtitle-1 font-weight-medium"
                  >Activities</router-link
                >
              </div>
              <!-- <div @click="goActivities(), toggleActive('act')" class="nav-item brand" :class="{'darken-2': act, brand: !act}">
            <a>Activities</a>
              </div>-->
            </v-layout>

            <transition :name="transitionName" mode="out-in">
              <router-view :user="user" :isProfile="isProfile"></router-view>
            </transition>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-dialog
        :fullscreen="$vuetify.breakpoint.xsOnly ? true : false"
        v-model="showSetting"
        max-width="600px"
        persistent
      >
        <Settings
          @updated="reload"
          v-if="showSetting"
          @close="showSetting = false"
        ></Settings>
      </v-dialog>
      <v-dialog v-model="showDP" max-width="450px">
        <v-card>
          <v-layout class="close" style="">
            <v-spacer></v-spacer>
            <div class="close-button" style="">
              <v-icon size="1.6em" class="close-btn" @click="showDP = false"
                >mdi-close</v-icon
              >
            </div>
          </v-layout>
          <div style="position:relative;margin-top:-2em">
            <div
              v-if="isProfile"
              class="upload-bg upload pointer"
              @click="openEdit()"
            >
              <v-icon color="accent">mdi-camera</v-icon>
            </div>
            <v-img
              v-if="user.profile_pic"
              width="100%"
              :src="user.profile_pic.high"
              :lazy-src="user.profile_pic.low"
            ></v-img>
            <v-img v-else :src="require('../assets/nophoto.jpg')"> </v-img>
          </div>
          <v-card-text v-if="user.profile_pic">
            <div class="subtitle-2 std mt-4">
              Uploaded: <span>{{ dpCreated }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
      <upload-image
        class="hidden"
        ref="upload"
        @close="uploadMenu = false"
        :uploading="uploadingImage"
        @upload="uploadProfile"
      ></upload-image>
    </v-layout>
  </div>
</template>

<script>
import Settings from "./ProfileSetting";
import CountryFlag from "vue-country-flag";
import UploadImage from "./UploadImage";
let moment = require("moment");
export default {
  components: {
    "upload-image": UploadImage,
    Settings,
    CountryFlag
  },
  data() {
    return {
      user: {},
      isProfile: false,
      following: null,
      showSetting: false,
      fetched: false,
      processing: false,
      transitionName: "slide-left",
      uploadMenu: false,
      uploadingImage: undefined,
      showDP: false
    };
  },
  methods: {
    uploadProfile(data) {
      this.uploadingImage = true;
      this.$store.dispatch("update_profile_pic", data.image).then(() => {
        this.uploadingImage = false;
      });
    },
    async fetchUser(id) {
      await this.$store.dispatch("fetch_complete_user", id).then(user => {
        this.user = user;
      });
    },
    follow() {
      this.processing = true;
      this.$store
        .dispatch("follow_user", this.user)
        .then(() => {
          this.following = true;
          this.user.followers++;
          this.processing = false;
        })
        .catch(error => {
          this.processing = false;
        });
    },
    unfollow() {
      this.$store
        .dispatch("unfollow_user", this.user.id)
        .then(() => {
          this.following = false;
          this.user.followers--;
          this.processing = false;
        })
        .catch(error => {
          this.processing = false;
        });
    },
    async matchProfile() {
      if (!this.$store.getters.authenticated) {
        return;
      }
      if (this.userID === this.$store.getters.getUser.id) {
        this.isProfile = true;
      } else {
        await this.checkFollowing();
      }
      return;
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
      this.$router.push({ path: this.homeLink + "/creations" });
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
    },
    reload() {
      this.$router.go();
    },
    openEdit() {
      this.showDP = false;
      this.$refs.upload.open();
    }
  },
  computed: {
    userID() {
      return this.$route.params.id;
    },
    joined() {
      return moment(this.user.created.toDate()).format("MMMM YYYY");
    },
    dpCreated() {
      return moment(this.user.profile_pic.created.toDate()).format(
        "MMMM Do YYYY, h:mm a"
      );
    },
    DOB() {
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
        this.matchProfile().then(() => {
          this.fetched = true;
        });
      });
    }
  },
  mounted: function() {
    this.$store.dispatch("set_loading", true);
    this.fetchUser(this.userID).then(() => {
      this.matchProfile().then(() => {
        this.fetched = true;
        this.$store.dispatch("set_loading", false);
      });
    });
    this.$router.beforeEach((to, from, next) => {
      if (from.name === "user-creations") this.transitionName = "slide-left";
      else if (from.name === "activities") this.transitionName = "slide-right";
      else {
        if (to.name === "user-creations") this.transitionName = "slide-right";
        else this.transitionName = "slide-left";
      }

      next();
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
}
#user-details {
  display: flex;
}
.nav-link {
  color: rgba(0, 0, 0, 0.87);
  text-decoration: none;
}
.nav-link.router-link-exact-active {
  color: var(--brand);
}
div .nav-link.router-link-exact-active {
  border-bottom: 5px solid var(--brand);
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.5s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(2em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-2em, 0);
}
.test {
  color: #000000b3;
  color: rgba(0, 0, 0, 0.4);
}
.upload {
  position: absolute;
  z-index: 4;
  right: 16px;
  bottom: 16px;
}
.upload-bg {
  background-color: rgba(0, 0, 0, 0.5);
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}
.hidden {
  display: none;
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
  background-color: rgba(0, 0, 0, 0.5);
  width: 2em;
  height: 2em;
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
</style>
