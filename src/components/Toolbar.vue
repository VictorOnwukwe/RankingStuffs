<template>
  <div class="affix">
    <div id="main">
      <v-layout>
        <v-flex shrink>
          <v-layout>
            <a class="hidden-md-and-up" href>Menu</a>
            <p>Trending Top 10</p>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout style="height:50px" align-center>
            <v-flex>
              <v-layout justify-center>
                <a @click="goPopular()">Popular</a>
                <a @click="goLatest()">Latest</a>
                <a>On Demand</a>
              </v-layout>
            </v-flex>
            <v-flex class="hidden-sm-and-down">
              <v-layout justify-center>
                <a @click="goCreate()">Create List</a>
                <a @click="goList()">Test List</a>
              </v-layout>
            </v-flex>
            <v-flex>
              <v-layout v-if="!authenticated" justify-end class="mr-2">
                <a @click="login_dialog=true" @>Login</a>
                <a @click="signup_dialog=true">Signup</a>
              </v-layout>
              <v-layout v-else justify-end>
                <v-avatar @click="goProfile()" size="25">
                  <img :src="user.profile_pic" />
                </v-avatar>
                <a class="mx-3" @click="logout()">Logout</a>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </div>

    <v-dialog v-if="!authenticated" v-model="login_dialog" max-width="500px">
      <Login></Login>
    </v-dialog>

    <v-dialog v-if="!authenticated" v-model="signup_dialog" max-width="500px">
      <Signup></Signup>
    </v-dialog>
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
    goPopular() {
      this.$router.push({ path: "/popular-lists" });
    },

    goLatest() {
      this.$router.push({ path: "/latest-lists" });
    },

    goHome() {
      this.$router.push({ path: "/" });
    },

    goProfile() {
      let link = "/" + this.user.id + "/profile";
      this.$router.push({ path: link });
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
.affix {
  position: sticky;
  top: 0;
  z-index: 3;
}
#main {
  width: calc(100%);
  background-color: grey;
}
div > a {
  padding-bottom: 0.2em;
}
div > a:hover {
  border-bottom: 5px solid var(--brand);
}
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
  /* box-shadow: 0px 3px 5px darkgrey; */
  /* background-image: linear-gradient(90deg, rgb(5, 26, 53), rgb(8, 47, 99)); */
  background-color: grey;
  height: 50px;
  border-bottom: 5px solid var(--brand);
}
#navbar {
  display: flex;
  max-width: 1080px;
  margin: 0 auto;
  align-items: center;
  justify-content: space-around;
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