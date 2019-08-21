<template>
  <div>
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
          <div class="nav-item">
            <a>Settings</a>
          </div>
          <div class="nav-item">
            <a>Notifications</a>
          </div>
          <div class="nav-item">
            <a>My Lists</a>
          </div>
          <div class="nav-item">
            <a>My Lists</a>
          </div>
        </div>
      </div>
      <v-card>
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
  background-color: var(--brand);
}
.nav-item:hover {
  filter: brightness(85%);
  color: white;
}
.nav-item > a {
  color: var(--primary);
}
</style>
