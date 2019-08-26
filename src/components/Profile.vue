<template>
  <div id="main">
    <div id="profile-container">
      <v-card tile flat height="100%">
        <v-card-text>
          <v-row class>
            <div class="mx-3">
              <v-avatar tile size="150px">
                <img :src="user.profile_pic" />
              </v-avatar>
            </div>
            <div>
              <p class="title">@{{user.username}}</p>
              <div class="mt-n4">Joined</div>
              <div class="mt-2 black--text" style="display:flex">
                <div class>
                  120
                  <a class="brand--text font-weight-bold text--darken-2" style>Followers</a>
                </div>
                <div class="ml-2">
                  243
                  <a class="brand--text font-weight-bold text--darken-2">Following</a>
                </div>
              </div>
            </div>
          </v-row>
        </v-card-text>
      </v-card>
      <div id="interact-container">
        <div id="interact-nav">
          <div
            v-if="isProfile"
            @click="setActive('settings')"
            class="nav-item brand"
            :class="{'darken-2': (active === 'settings'), brand: (active !== 'settings')}"
          >
            <v-icon color="primary" class="mr-1">mdi-settings</v-icon>
            <a>Settings</a>
          </div>
          <div
            v-if="isProfile"
            @click="setActive('notifications')"
            class="nav-item brand"
            :class="{'darken-2': (active === 'notifications'), brand: (active !== 'notifications')}"
          >
            <v-icon color="primary" class="mr-1">mdi-bell</v-icon>
            <a>Notifications</a>
          </div>
          <div
            @click="setActive('favorites')"
            class="nav-item brand"
            :class="{'darken-2': (active === 'favorites'), brand: (active !== 'favorites')}"
          >
            <v-icon color="primary" class="mr-1">favorite</v-icon>
            <a v-if="isProfile">My Favorites</a>
            <a v-else>Favorites</a>
          </div>
          <!-- <div @click="goActivities(), toggleActive('act')" class="nav-item brand" :class="{'darken-2': act, brand: !act}">
            <a>Activities</a>
          </div>-->
        </div>
      </div>
      <v-card tile>
        <v-card-text>
          <v-layout justify-center>
            <router-view></router-view>
          </v-layout>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import Sidebar from "./Sidebar";
let moment = require("moment");
export default {
  components: {
    Sidebar
  },
  data() {
    return {
      user: {},
      isProfile: false,
      active: ""
    };
  },
  methods: {
    async fetchUser(id) {
      await this.$store.dispatch("fetch_user", id).then(user => {
        this.user = user;
      });
    },
    matchProfile() {
      if (this.userID === this.$store.getters.getUser.id) {
        this.isProfile = true;
      }
      if (!this.isProfile) {
        this.goFavorites();
        this.setActive("favorites");
      } else {
        this.goNotification();
        this.setActive("notifications");
      }
    },
    setActive(val) {
      console.log("active");
      this.active = val;
      this.$router.push({path: this.homeLink + val});
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
    goNotification() {
      this.$router.push({ path: this.homeLink + "/notifications" });
    },
    goFavorites() {
      this.$router.push({ path: this.homeLink + "/favorites" });
      console.log("To favorites");
    },
    goActivities() {
      return;
    }
  },
  computed: {
    userID() {
      return this.$route.params.id;
    },
    joined() {
      return moment(this.user.created.toDate()).format("MMMM YYYY");
      // return moment(this.user.created.toDate()).calendar();
    },
    homeLink() {
      return "/" + this.user.id + "/profile/";
    }
  },
  watch: {
    'userID'(){
        console.log("true");
        this.fetchUser(this.$route.params.id).then(() => {
          this.matchProfile();
        })
    }
  },
  mounted: function() {
    this.fetchUser(this.userID).then(() => {
      this.matchProfile();
    });
  }
};
</script>

<style scoped>
#main {
  scroll-behavior: smooth;
}
#container {
  display: flex;
}
#profile-container {
  /* background-image: linear-gradient(90deg, rgb(5, 26, 53), rgb(8, 47, 99)); */
  margin: 0 auto;
  flex-grow: 1;
}
#user-details {
  display: flex;
}
#interact-container {
}
#interact-nav {
  display: flex;
  background-color: var(--brand);
}
#interact-nav > * {
  flex-grow: 1;
}
.nav-item {
  display: flex;
  justify-content: center;
  padding: 1em;
  color: var(--primary);
  cursor: pointer;
}
.nav-item:hover {
  filter: brightness(95%);
}
</style>
