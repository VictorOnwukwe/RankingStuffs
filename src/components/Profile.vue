<template>
  <div>
    <div class="container">
      <div class="profile-container">
        <div>
          <v-icon class="edit-icon" @click="dialog=!dialog">mdi-pencil</v-icon>
        </div>
        <div class="user-container">
          <div class="pic-container">
            <img :src="user.profile_pic" class="profile-pic" />
            <v-icon @click="selectImage()" class="cam-icon">mdi-camera</v-icon>
            <input
              style="display:none"
              type="file"
              ref="profile"
              accept="image/*"
              @change="onFileSelect"
            />
          </div>
          <div>
            <p>
              <strong>@{{user.username}}</strong>
            </p>
            <p>Just living my best life</p>
            <p v-if="this.user.created">Joined {{joined}}</p>
            <span class="links" style="color:var(--dark-text); cursor:pointer">
              <strong style="color:var(--button)">0</strong> Followers
            </span>&nbsp; &nbsp;
            <span class="links" style="color:var(--dark-text); cursor:pointer">
              <strong style="color:var(--button)">0</strong> Following
            </span>
            <p>Interests</p>
          </div>
        </div>
        <div class="user-details">
          <div class="subhead">
            <h3>My Lists</h3>
            <v-icon class="side-icon">mdi-view-list</v-icon>
          </div>
          <div v-for="list in userLists" :key="list.id">
            <h3>{{list.title}}</h3>
          </div>
          <div class="subhead">
            <h3>My Favorites</h3>
            <v-icon class="side-icon">mdi-view-list</v-icon>
          </div>
          <div class="subhead">
            <h3>My Awards</h3>
            <v-icon class="side-icon">mdi-view-list</v-icon>
          </div>
        </div>
      </div>

      <v-dialog v-model="dialog" max-width="500px">
        <ProfileSetting></ProfileSetting>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import ProfileSetting from "./ProfileSetting";
let moment = require("moment");
export default {
  components: {
    ProfileSetting
  },
  data() {
    return {
      profile_pic: "",
      settings: false,
      dialog: false,
      userLists: []
    };
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

  mounted: function() {
    setTimeout(() => {
      this.$store.dispatch("fetch_user_lists").then(lists => {
        this.userLists = lists;
      });
    }, 3000);
  }
};
</script>

<style scoped>
.container {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  background-color: var(--primary);
  border-radius: 0.5em;
  box-shadow: 0 0 5px darkgray;
}

.profile-pic {
  width: auto;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
}

.pic-container {
  position: relative;
  width: 150px;
  margin: 0 auto;
  margin-bottom: 1.5em;
}

.user-container {
  display: flex;
  position: relative;
  width: 100%;
  flex-direction: column;
}

.cam-icon {
  position: absolute;
  top: 120px;
  right: 15px;
  color: var(--primary);
  background-color: var(--button);
  padding: 5px;
  border-radius: 50%;
  transition: all 0.05s linear;
}
.cam-icon:hover {
  transform: scale(1.1);
}
.cam-icon:active {
  transform: scale(0.9);
}

.profile-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.edit-icon {
  position: absolute;
  right: 1em;
  top: 1em;
  z-index: 2;
  transition: all 0.05s linear;
}
.edit-icon:hover {
  transform: scale(1.1);
}
.edit-icon:active {
  transform: scale(0.9);
}

.user-details {
  flex-grow: 1;
}

.subhead h3 {
  display: block;
  background-color: hsl(208, 77%, 95%);
  padding: 0.2em 0.5em;
}

.subhead {
  position: relative;
  margin: 1em 0;
}

.subhead .side-icon {
  position: absolute;
  right: 3px;
  top: 1px;
  color: var(--dark-text);
}

#settings {
  position: absolute;
  right: 40px;
  animation: bounceIn 0.8s;
  width: 50vw;
  left: calc(25vw - 2em);
  background-color: blue;
}

.backdrop {
  position: absolute;
  background-color: black;
  opacity: 0.5;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: -px;
  z-index: 10;
}

@keyframes bounceIn {
  0% {
    transform: translateY(-500px);
    opacity: 0;
  }
  25% {
    transform: translateY(-250px);
    opacity: 0.2;
  }
  50% {
    transform: translateY(-100px);
    opacity: 0.3;
  }
  60% {
    transform: translateY(30px);
    opacity: 0.7;
  }
  80% {
    transform: translateY(-20px);
    opacity: 0.85;
  }
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}
</style>

