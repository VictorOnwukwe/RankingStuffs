<template>
  <div class="affix elevation-3">
    <div id="main">
      <div style="max-width:1200px" class="mx-auto">
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
                <a @click="goPopular()" class="accent--text text--lighten-1">Popular</a>
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
                <a @click="loginDialog=true">Login</a>
                <a @click="signupDialog=true">Signup</a>
              </v-layout>
              <v-layout v-else justify-end>
                <v-icon color="white" @click.prevent="search = !search" size="25">search</v-icon>
                <v-icon @click="notification=!notification" class="ml-4" color="white" size="25">mdi-bell</v-icon>
                <v-avatar class="ml-4 mr-8" @click="goProfile()" size="30">
                  <img :src="user.profile_pic" />
                </v-avatar>
                <a @click="logout()" class="">Logout</a>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
      </div>
    </div>
    <div v-if="loading" class="loader-bar loading"></div>
    <!-- <div v-else class="loader-bar"></div> -->
    <transition name="search-bar">
      <div v-if="search" class="search" style>
        <div class="search-field">
          <input
            style="height:3em; padding: 0.2em 3em 0.2em 0.5em; width: 100%"
            type="text"
            v-model="keyword"
            @keyup="fetchResults()"
          />
          <v-icon style="position:absolute; right:0.5em; top:1rem">search</v-icon>
        </div>
        <div class="search-results">
          <div v-if="results.length > 0" style="border: 4px solid #bbdefb">
            <v-card
              v-for="(result, index) in results"
              :key="index"
              flat
              tile
              class="primary-text-dark"
            >
              <v-card-text class="title">{{result.title}}</v-card-text>
              <v-divider></v-divider>
            </v-card>
          </div>
          <div v-if="results.length === 0 && keyword.length >= 5" style="border: 4px solid #bbdefb">
            <v-card tile flat class="primary-text-dark">
              <v-card-text class="">Sorry. This list does not exist yet. Be the first to create or demand it.</v-card-text>
              <v-card-actions>
                <v-btn class="brand white--text" @click="goSearchedCreate()">Create</v-btn>
                <v-btn class="sidebar white--text" @click="goSearchedDemand()">Demand</v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </div>
      </div>
    </transition>

    <transition name="notification-bar">
      <div v-if="notification" @click="notification = false" class="notification">
        <Notifications></Notifications>
      </div>
    </transition>

    <v-dialog v-if="!authenticated" v-model="loginDialog" max-width="500px">
      <Login @close="loginDialog = false" v-if="loginDialog"></Login>
    </v-dialog>

    <v-dialog v-if="!authenticated" v-model="signupDialog" max-width="500px">
      <Signup @close="signupDialog = false" v-if="signupDialog"></Signup>
    </v-dialog>
  </div>
</template>

<script>
import Login from "./Login";
import Signup from "./Signup";
import { setTimeout } from "timers";
import Notifications from "./Notifications";
export default {
  components: {
    Login,
    Signup,
    Notifications
  },
  props: {
    closeSearch: Boolean
  },
  data() {
    return {
      navDrawer: null,
      loginDialog: false,
      signupDialog: false,
      search: false,
      results: [],
      keyword: "",
      notification: false
    };
  },

  methods: {
    goPopular() {
      this.$router.push({ path: "/popular-lists" });
    },

    goLatest() {
      this.$router.push({ path: "/latest-lists" });
    },

    action() {
      setTimeout(() => {
        this.search = false;
        this.results = [];
        this.keyword = "";
      }, 200);
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

    goCreate(){
      this.$router.push({path: "/create"});
    },
    goSearchedCreate() {
      this.$router.push({
        path: "/create",
        query: { demanded: true, id: "jdsfbsijbfjd", title: this.keyword }
      });
    },

    goList() {
      this.$router.push({ path: "/lists/pTt8MoCSxEyJxEYwEqRQ" });
    },

    goDemand(){
      this.$router.push({path: "/demand"});
    },
    goSearchedDemand() {
      this.$router.push({
        path: "/demand",
        query: {
          searched: true,
          title: this.keyword
        }
      });
    },

    logout() {
      this.signupDialog = false;
      this.loginDialog = false;
      this.$store.dispatch("logout").then(() => {
        this.$router.push({path: "/"});
      });
    },
    fetchResults() {
      if (this.keyword.length < 5) {
        return;
      }
      this.results = this.$store.getters.getDemands.filter(demand => {
        return demand.title.toLowerCase().includes(this.keyword.toLowerCase().trim());
      });
    }
  },

  watch: {
    'closeSearch'(){
      this.closeSearch ? this.action() : null;
    }
  },

  computed: {
    authenticated() {
      return this.$store.getters.getAuthenticated;
    },

    user() {
      return this.$store.getters.getUser;
    },
    loading() {
      return this.$store.getters.getLoading;
    }
  }
};
</script>

<style scoped>
.loader-bar {
  height: 4px;
  width: 100%;
  background-color: white;
  border-bottom: 1px solid #E2E8F7;
}
.search {
  position: absolute;
  top: 3.175em;
  padding: 0px;
  right: 0;
  width: 100%;
  background-color: #e3f2fd;
}
.search-field {
  border: 4px solid #bbdefb;
}

.search-result {
  width: 100%;
  background: lightgrey;
  padding: 0.5em 0.5em;
  border-bottom: 1px solid gray;
}
@media (min-width: 600px) {
  .search {
    width: 50%;
  }
}

.notification{
  position: absolute;
  top: 3.175em;
  padding: 0px;
  right: 0;
  width: 50%;
  background-color: #e3f2fd;
}
.affix {
  position: fixed;
  top: 0;
  z-index: 10;
  width: 100%;
  /* box-shadow: 0px 2px 4px rgba(0,0,0,0.5); */
}
#main {
  width: calc(100%);
  /* background-color: grey; */
  background: linear-gradient(180deg, #1565c0, #1976d2);
  /* background: #E9E9ED; */
}
div > a {
  padding-bottom: 0.2em;
}
a {
  color: rgba(255,255,255,0.9) !important;
  /* font-weight: bold; */
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

.search-bar-enter-active {
  animation: slide 0.1s ease-in;
  transform-origin: top;
}
.search-bar-leave-active {
  animation: slide 0.1s ease-in reverse;
  transform-origin: top;
}

.notification-bar-enter-active {
  animation: slide 0.1s ease-in;
  transform-origin: top;
}
.notification-bar-leave-active {
  animation: slide 0.1s ease-in reverse;
  transform-origin: top;
}

@keyframes slide {
  0% {
    transform: scaleY(0);
  }
  100% {
    transform: scaleY(1);
  }
}
.loading {
  /* background-image: linear-gradient(90deg, var(--brand) 30%, #75CCFF 50%, var(--brand) 70%); */
  background-image: linear-gradient(
    90deg,
    white 30%,
    var(--sidebar) 50%,
    white
  );
  background-size: 300%;
  animation: loading 1s ease-in-out infinite;
}
@keyframes loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>