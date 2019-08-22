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
          <div @click="goSetting(), toggleActive('set')" class="nav-item brand" :class="{'darken-2': set, brand: !set}">
            <a>Settings</a>
          </div>
          <div @click="goNotification(), toggleActive('not')" class="nav-item brand" :class="{'darken-2': not, brand: !not}">
            <a>Notifications</a>
          </div>
          <div @click="goFavorites(), toggleActive('fav')" class="nav-item brand" :class="{'darken-2': fav, brand: !fav}">
            <a>Favorites</a>
          </div>
          <!-- <div @click="goActivities(), toggleActive('act')" class="nav-item brand" :class="{'darken-2': act, brand: !act}">
            <a>Activities</a>
          </div> -->
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
  data(){
    return{
      act: false,
      not: false,
      set: false,
      fav: true
    }
  },
  methods: {
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
    goSetting(){
      this.$router.push({path: "/profile/settings"});
    },
    goNotification(){
      this.$router.push({path: "/profile"});
    },
    goFavorites(){
      this.$router.push({path: "/profile/favorites"});
    },
    goActivities(){
      return;
    },
    toggleActive(bar){
      switch(bar){
        case "set": this.set = true;
                    this.act = this.fav = this.not = false;
                    break;
        case "act": this.act = true;
                    this.set = this.fav = this.not = false;
                    break;
        case "not": this.not = true;
                    this.act = this.fav = this.set = false;
                    break;
        case "fav": this.fav = true;
                    this.act = this.set = this.not = false;
                    break;
      }
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    joined() {
      return moment(this.user.created.toDate()).format("MMMM YYYY");
      // return moment(this.user.created.toDate()).calendar();
    }
  },
  mounted: function() {}
};
</script>

<style scoped>
#main{
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
}
.nav-item:hover {
  background-color: #0064BA;
}
.nav-item > a {
  color: var(--primary);
}
</style>
