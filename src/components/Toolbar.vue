<template>
  <div class="affix">
    <div id="main">
      <v-layout>
        <v-flex shrink>
          <v-layout align-center>
            <a class="hidden-md-and-up" href>Menu</a>
            <a @click="goList()" class="brand pa-1 white--text">Trending Top 10</a>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-layout style="height:3.125em" align-center>
            <v-flex class="hidden-xs-only">
              <v-layout justify-center>
                <a @click="goPopular()">Popular</a>
                <a @click="goLatest()">Latest</a>
                <a @click="goDemanded()">On-Demand</a>
              </v-layout>
            </v-flex>
            <v-flex class="hidden-sm-and-down">
              <v-layout justify-center>
                <a @click="goCreate()">Create</a>
                <a @click="goDemand()">Demand</a>
              </v-layout>
            </v-flex>
            <v-flex>
              <v-layout v-if="!authenticated" justify-end class="mr-2">
                <v-icon @click="search = !search">search</v-icon>
                <a @click="login_dialog=true">Login</a>
                <a @click="signup_dialog=true">Signup</a>
              </v-layout>
              <v-layout v-else justify-end>
                <v-icon color="primary" @click="search = !search">search</v-icon>
                <v-avatar class="mx-4" @click="goProfile()" size="25">
                  <img :src="user.profile_pic" />
                </v-avatar>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
    </div>
    <div v-if="loading" class="loader-bar loading"></div>
    <div v-else class="loader-bar"></div>
    <transition name="search-bar">
      <div v-show="search" class="search" style>
        <input
          style="height:3em; padding: 0.2em 0.4em; width: 100%"
          class="white"
          type="text"
        />
        <v-icon style="position:absolute; right:0.5em; top:7px">search</v-icon>
      </div>
    </transition>

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
      signup_dialog: false,
      search: false
    };
  },

  methods: {
    goPopular() {
      this.$router.push({ path: "/popular-lists" });
    },

    goLatest() {
      this.$router.push({ path: "/latest-lists" });
    },

    goDemanded() {
      this.$router.push({ path: "/demanded" });
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

    goDemand() {
      this.$router.push({ path: "/demand" });
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
    },
    loading(){
      console.log("here: ", this.$store.getters.getLoading);
      return this.$store.getters.getLoading;
    }
  }
};
</script>

<style scoped>
.loader-bar{
  height: 4px;
  width: 100%;
  background-color: #64B5F6;
}
.search {
  position: absolute;
  top: 3.125em;
  padding: 0px;
  right: 0;
  width: 100%;
  border: 3px solid grey;
}
@media (min-width: 600px) {
  .search{
    width: 50%;
  }
}
.affix {
  position: fixed;
  top: 0;
  z-index: 10;
  width: 100%;
}
#main {
  width: calc(100%);
  /* background-color: grey; */
  background: linear-gradient(180deg, #1565C0, #1976D2);
}
div > a {
  padding-bottom: 0.2em;
}
a {
  color: hsl(206, 60%, 96%) !important;
  font-weight: bold;
}

.center {
  align-self: center;
}

div.flex {
  display: flex;
}

a {
  text-decoration: none;
}

div a + a {
  margin-left: 1em;
}

.search-bar-enter-active{
  animation: slide 0.1s ease-in;
  transform-origin: top;
}
.search-bar-leave-active{
  animation: slide 0.1s ease-in reverse;
  transform-origin: top;
}

@keyframes slide {
  0%{
    transform: scaleY(0)
  }
  100%{
    transform: scaleY(1);
  }
}
.loading{
  /* background-image: linear-gradient(90deg, var(--brand) 30%, #75CCFF 50%, var(--brand) 70%); */
  background-image: linear-gradient(90deg, var(--brand) 30%, #95E8FF 50%, var(--brand) 70%);
  background-size: 400%;
  animation: loading 1s ease-in-out infinite;
}
@keyframes loading {
  0%{
    background-position: 100% 50%;
  }
  100%{
    background-position: 0 50%;
  }
}
</style>