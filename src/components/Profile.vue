<template>
  <div>
    <div id="profile-container">
      <div id="user-details">
        <v-avatar size="150px">
          <img :src="user.profile_pic" />
        </v-avatar>
      </div>
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
    </div>
  </div>
</template>

<script>
import { setTimeout } from "timers";
import Toolbar from "./Toolbar";
export default {
  components: {
    Toolbar
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
    }
  },
  mounted: function() {}
};
</script>

<style scoped>
#profile-container {
  background-image: linear-gradient(90deg, rgb(5, 26, 53), rgb(8, 47, 99));
  width: 100vw;
  min-height: 100vh;
  margin-left: -0.5em;
  margin-top: -0.5em;
}
#user-details {
  text-align: center;
}
#interact-container {
  margin-top: 2em;
}
#interact-nav {
  display: flex;
  background-color: hsl(60, 97%, 40%);
}
#interact-nav > * {
  flex-grow: 1;
}
.nav-item {
  display: flex;
  justify-content: center;
  padding: 1em;
}
.nav-item > a {
  color: rgb(5, 26, 53);
}
</style>
