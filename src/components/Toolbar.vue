<template>
  <div>
    <div id="brand-header" class="brand">
      <h1 @click="goHome()" class="primary--text">Naija Top Ten</h1>
      <div id="search" class="primary">
        <input type="text" placeholder="Search..." />
        <v-icon>mdi-magnify</v-icon>
      </div>
    </div>
    <!-- <v-toolbar color="primary">
      <v-toolbar-items>
        <div class="center">
          <a href="#" class="link--text">Newest</a>
          <a href="#" class="link--text">Suggest List</a>
        </div>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <div class="flex center">
          <a @click="goLogin()" class="dark_text--text">Login</a>
          <a @click="goSignup()" class="dark_text--text">Sign up</a>
        </div>
      </v-toolbar-items>
    </v-toolbar>-->

    <div id="navbar-container">
      <div id="navbar">
        <div>
          <a @click="goPopular()" class="link--text">Popular</a>
          <a @click="goLatest()" class="link--text">Latest</a>
        </div>

        <div>
          <a @click="goCreate()" class="link--text">Create List</a>
          <a @click="goList()" class="link--text">Test List</a>
        </div>

        <div style="display:flex">
          <div v-if="!authenticated">
            <a @click="login_dialog=!login_dialog" class="dark_text--text">Login</a>
            <a @click="signup_dialog=!signup_dialog" class="dark_text--text">Sign up</a>
          </div>
          <div class="user-details" v-if="authenticated">
            <v-avatar size="24" @click="goUserProfile()">
              <img :src="user.profile_pic" />
            </v-avatar>
            <!-- <a @click="goUserProfile()" class="links" style="color:dark_text">{{user.username}}</a> -->
          </div>
          <div v-if="authenticated">
            <a @click="logout()" class="dark_text--text">Logout</a>
          </div>
        </div>
      </div>
      <v-dialog v-if="!authenticated" v-model="login_dialog" max-width="500px">
        <Login></Login>
      </v-dialog>

      <v-dialog v-if="!authenticated" v-model="signup_dialog" max-width="500px">
        <Signup></Signup>
      </v-dialog>
      
    </div>
  </div>
</template>

<script>
import Login from "./Login";
import Signup from "./Signup";
export default {
  components: {
    Login,
    Signup
  },
  data() {
    return {
      navDrawer: null,
      login_dialog: false,
      signup_dialog: false
    };
  },

  methods: {
    goLogin() {
      this.$router.push({ path: "/login" });
    },

    goPopular() {
      this.$router.push({ path: "/popular-lists" });
    },

    goLatest() {
      this.$router.push({ path: "/latest-lists" });
    },

    goSignup() {
      this.$router.push({ path: "/signup" });
    },

    goHome() {
      this.$router.push({ path: "/" });
    },

    goUserProfile() {
      this.$router.push({ path: "/profile" });
    },

    goCreate() {
      this.$router.push({ path: "/create" });
    },
    goList() {
      this.$router.push({ path: "/lists/jknM6pu73V7xtxP7pguV" });
    },
    logout() {
      this.$store.dispatch("logout");
    }
  },

  computed: {
    authenticated() {
      return this.$store.getters.getAuthenticated;
    },

    user() {
      return this.$store.getters.getUser;
    }
  }
};
</script>

<style scoped>
#brand-header {
  padding: 0.6em;
  position: relative;
}

#brand-header > h1 {
  text-shadow: 2px 2px 2px black;
  cursor: pointer;
}

#search {
  display: flex;
  max-width: 800px;
  margin: 0 auto;
  border-radius: var(--border-radius);
}
#search > input {
  color: var(--dark-text);
  padding: 0.5em;
  flex-grow: 1;
}

.center {
  align-self: center;
}

div.flex {
  display: flex;
}

#navbar-container {
  padding: 0.9em 1.2em;
  box-shadow: 0px 3px 5px darkgrey;
  background-color: var(--primary);
}
#navbar {
  display: flex;
  max-width: 1080px;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
}

a {
  text-decoration: none;
}

div a + a {
  margin-left: 1em;
}

.user-details * + * {
  margin-left: 0.5em;
}
</style>