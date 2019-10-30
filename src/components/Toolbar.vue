<template>
  <div class="affix elevation-3">
    <div id="main" @click="action()">
      <div style="max-width:1300px;" :style="maxSize ? 'padding: 0' : 'padding:0 0.5em'" class="mx-auto">
        <v-layout>
          <v-flex shrink>
            <v-layout align-center>
              <v-app-bar-nav-icon
                @click="showSidebar = !showSidebar"
                color="rgba(255, 255, 255, 0.902)"
                class="hidden-sm-and-up mr-2"
              ></v-app-bar-nav-icon>
              <a @click="go('/')" class="py-1" style="font-size:1.5em">
                <span class="white--text font-weight-black">top</span>
                <span class="accent--text font-weight-black">TEN</span>
              </a>
            </v-layout>
          </v-flex>
          <v-flex>
            <v-layout style="height:4.5em" align-center justify-space-around>
              <v-flex grow class="hidden-xs-only">
                <v-layout justify-center>
                  <router-link tag="a" style="margin-right:1em" class="nav" to="/">Home</router-link>
                  <v-menu offset-y open-on-hover close-on-content-click min-width="150px">
                    <template v-slot:activator="{ on }">
                      <div v-on="on">
                        <a>Lists</a>
                        <v-icon color="rgba(255, 255, 255, 0.902)">mdi-menu-down</v-icon>
                      </div>
                    </template>
                    <v-list dense color="grey lighten-4">
                      <v-list-item @click="go('/latest-lists')">
                        <v-list-item-content>Latest</v-list-item-content>
                      </v-list-item>
                      <v-list-item @click="go('/popular-lists')">
                        <v-list-item-content>Popular</v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <router-link tag="a" class="nav" style="margin-left:1em" to="/demanded">On-Demand</router-link>
                  <router-link tag="a" class="nav" to="/create">Create</router-link>
                  <router-link tag="a" class="nav" to="/demand">Demand</router-link>
                </v-layout>
              </v-flex>
              <v-flex :shrink="$vuetify.breakpoint.xs ? false : true">
                <v-layout v-if="!authenticated" justify-end class="mr-2">
                  <v-icon
                    color="rgba(255, 255, 255, 0.902)"
                    class="mr-2"
                    @click.stop="search = !search"
                  >search</v-icon>
                  <a @click="loginDialog=true">Login</a>
                  <a @click="signupDialog=true">Signup</a>
                </v-layout>
                <v-layout v-else justify-end>
                  <v-icon
                    color="rgba(255, 255, 255, 0.902)"
                    @click.stop="search = !search"
                    size="25"
                  >search</v-icon>
                  <v-badge overlap class="ml-4" color="accent">
                    <template v-slot:badge>
                      <span v-if="notifications > 0">{{ notifications }}</span>
                    </template>
                    <v-icon
                      @click.stop="notification=!notification"
                      color="rgba(255, 255, 255, 0.902)"
                      size="25"
                    >mdi-bell</v-icon>
                  </v-badge>
                  <v-menu offset-y open-on-hover close-on-content-click max-width="250px">
                    <template v-slot:activator="{ on }">
                      <div v-on="on">
                        <v-layout>
                          <dp :src="user.profile_pic.low" class="ml-4" :size="'30'"></dp>
                        </v-layout>
                      </div>
                    </template>
                    <v-list dense color="grey lighten-4">
                      <v-list-item @click="go(profile)">
                        <v-list-item-avatar>
                          <dp :src="user.profile_pic.low"></dp>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title class="font-weight-black subtitle-1">{{user.username}}</v-list-item-title>
                          <v-list-item-subtitle class>{{user.email}}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item @click="go(profile + 'creations')">
                        <v-list-item-icon>
                          <v-icon color size="1.2em">mdi-creation</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>My Creations</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="go(profile + '')">
                        <v-list-item-icon>
                          <v-icon size="1.2em" color>fa-star</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>My Favorites</v-list-item-title>
                      </v-list-item>
                      <!-- <v-list-item link>
                        <v-list-item-icon>
                          <v-icon color>mdi-creation</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>My Timeline</v-list-item-title>
                      </v-list-item>-->
                      <v-list-item @click="logout()">
                        <v-list-item-icon>
                          <v-icon>mdi-logout</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>Logout</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </div>
    </div>
    <v-progress-linear v-if="loading" height="2" color="brand darken-1" indeterminate></v-progress-linear>
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
          <div
            v-if="demands.length > 0 || lists.length > 0"
            style="border: 4px solid #bbdefb; border-top:0px"
          >
            <v-card flat tile v-if="lists.length > 0" class="primary-text-dark">
              <v-card-title class="title">Lists</v-card-title>
              <v-list>
                <v-list-item
                  @click="search = false, go('/lists/' + result.id)"
                  v-for="(result, index) in lists"
                  :key="index"
                >
                  <v-list-item-content class="brand--text">{{result.title}}</v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
            <v-card flat tile v-if="demands.length > 0" class="primary-text-dark">
              <v-card-title class="title">Demands</v-card-title>
              <v-list>
                <preview-demanded
                  v-for="(result, index) in demands"
                  :key="index"
                  :searched="true"
                  :isProfile="false"
                  :demand="result"
                ></preview-demanded>
              </v-list>
            </v-card>
          </div>
          <div
            v-else-if="keyword.length >= 5 && !searching"
            style="border: 4px solid #bbdefb; border-top: 0px"
          >
            <v-card tile flat class="primary-text-dark">
              <v-card-text
                class
              >Sorry. This list does not exist yet. Be the first to create or demand it.</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn outlined small color="brand" @click="goSearchedDemand()">Demand</v-btn>
                <v-btn small dark class="brand white--text" @click="goSearchedCreate()">Create</v-btn>
              </v-card-actions>
            </v-card>
          </div>
          <div v-else-if="keyword.length >= 5" style="border: 4px solid #bbdefb; border-top: 0px">
            <v-layout justify-center>
              <v-progress-circular class="my-4" size="24" color="brand" indeterminate></v-progress-circular>
            </v-layout>
          </div>
        </div>
      </div>
    </transition>

    <transition name="notification-bar">
      <div v-if="notification" class="notification">
        <Notifications @close="notification = false"></Notifications>
      </div>
    </transition>

    <v-dialog v-if="!authenticated" v-model="loginDialog" max-width="500px">
      <Login
        @signup="loginDialog = false, signupDialog = true"
        v-if="loginDialog"
        @close="loginDialog = false"
      ></Login>
    </v-dialog>

    <v-dialog v-if="!authenticated" v-model="signupDialog" max-width="500px">
      <Signup
        v-if="signupDialog"
        @login="signupDialog = false, loginDialog = true"
        @close="signupDialog = false"
      ></Signup>
    </v-dialog>

    <v-navigation-drawer
      class="hidden-sm-and-up"
      height="calc(100vh - 4.5em)"
      style="margin-top:4.5em"
      fixed
      dark
      :temporary="$vuetify.breakpoint.xs ? true : false"
      v-model="showSidebar"
    >
      <v-list nav>
        <v-list-item @click="go('/')">
          <v-list-item-icon>
            <v-icon size="1.2em" color="#EEEEEE">fa-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-list-group no-action>
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon size="1.2em" color="#EEEEEE">fa-list-alt</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Lists</v-list-item-title>
          </template>

          <!-- <v-list-item @click>
            <v-list-item-title>All Lists</v-list-item-title>
          </v-list-item>-->
          <v-list-item @click="go('/popular-lists')">
            <v-list-item-title>Popular</v-list-item-title>
          </v-list-item>
          <v-list-item @click="go('/latest-lists')">
            <v-list-item-title>Latest</v-list-item-title>
          </v-list-item>
          <!-- <v-list-item @click>
            <v-list-item-title>Trending</v-list-item-title>
          </v-list-item>-->
        </v-list-group>

        <v-list-item @click="go('/demanded')">
          <v-list-item-icon>
            <v-icon size="1.2em" color="#EEEEEE">fa-users</v-icon>
          </v-list-item-icon>
          <v-list-item-title>On Demand</v-list-item-title>
        </v-list-item>

        <v-list-item @click="go('/create')">
          <v-list-item-icon>
            <v-icon size="1.2em" color="#EEEEEE">fa-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Create List</v-list-item-title>
        </v-list-item>
        <v-list-item @click="go('demand')">
          <v-list-item-icon>
            <v-icon size="1.2em" color="#EEEEEE">fa-hand-holding</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Demand List</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import Login from "./Login";
import Signup from "./Signup";
import { setTimeout } from "timers";
import Notifications from "./Notifications";
import Sidebar from "./Sidebar";
import UserDemanded from "./UserDemanded";
import firebase, { firestore } from "firebase/app";
import "firebase/firestore";
export default {
  components: {
    Login,
    Signup,
    Notifications,
    Sidebar,
    "preview-demanded": UserDemanded
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
      notification: false,
      showSidebar: false,
      demands: [],
      lists: [],
      searching: false
    };
  },

  methods: {
    action() {
      setTimeout(() => {
        this.search = false;
        this.lists = this.demands = [];
        this.keyword = "";
        this.notification = false;
      }, 200);
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
    goSearchedDemand() {
      this.$router.push({
        path: "/demand",
        query: {
          searched: true,
          title: this.keyword
        }
      });
    },

    go(link) {
      this.$router.push({ path: link });
    },

    logout() {
      this.signupDialog = false;
      this.loginDialog = false;
      this.$store.dispatch("logout").then(() => {
        // this.$router.go();
      });
    },
    async fetchResults() {
      if (this.keyword.length < 5) {
        if (this.keyword.length == 0) {
          this.lists = this.demands = [];
        }
        return;
      }
      this.searching = true;
      this.lists = await this.$store.dispatch(
        "search_lists",
        this.keyword.toLowerCase()
      );
      this.demands = await this.$store.dispatch(
        "search_demands",
        this.keyword.toLowerCase()
      );
      this.searching = false;
    },
    fetchCategories() {
      this.$store.dispatch("fetch_categories").then(result => {
        this.categories = result;
      });
    },
    goFavorites() {
      this.$router.push({ path: this.profile });
    },
    goCreations() {
      this.$router.push({ path: this.profile + "timeline" });
    },
    go(val) {
      this.$router.push({ path: val });
    },
    setLogin(val){
      this.$store.dispatch("set_login", val)
    },
    setSignup(val){
      this.$store.dispatch("set_signup", val)
    }
  },

  watch: {
    closeSearch() {
      this.closeSearch ? this.action() : null;
    },
    search() {
      if (!this.search) {
        this.action();
      }
    },
    login(){
      this.loginDialog = this.login;
    },
    signup(){
      this.signupDialog = this.signup;
    },
    loginDialog(){
      if(this.loginDialog == false){
        this.setLogin(false);
      }
    },
    signupDialog(){
      if(this.signupDialog == false){
        this.setSignup(false);
      }
    }
  },

  computed: {
    authenticated() {
      return this.$store.getters.authenticated;
    },

    user() {
      return this.$store.getters.getUser;
    },
    loading() {
      return this.$store.getters.getLoading;
    },
    profile() {
      return "/" + this.user.id + "/profile/";
    },
    notifications() {
      return this.$store.getters.notifications;
    },
    login(){
      return this.$store.getters.login;
    },
    signup(){
      return this.$store.getters.signup;
    },
    maxSize(){
      return window.innerWidth >= 1300;
    }
  }
};
</script>

<style scoped>
.loader-bar {
  height: 4px;
  width: 100%;
  background-color: white;
  border-bottom: 1px solid #e2e8f7;
}
.search {
  position: absolute;
  top: 4.5em;
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

.notification {
  position: absolute;
  top: 4.5em;
  padding: 0px;
  right: 0;
  width: 100%;
  background-color: #e3f2fd;
  z-index: 10;
  max-width: 700px;
}

@media (min-width: 600px) and (max-width: 850px) {
  .notification {
    width: 70%;
  }
}
@media (min-width: 850px) {
  .notification {
    width: 50%;
  }
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
  /* background: linear-gradient(180deg, #1565c0, #1976d2); */
  background: var(--brand);
  /* background: rgba(0,0,0,0); */
}
div > a {
  padding-bottom: 0.2em;
}
a {
  color: #ffffffe6 !important;
  /* font-weight: bold; */
  text-decoration: none;
  /* color: rgba(255, 255, 255, 0.902) */
  line-height: 200%;
}

.center {
  align-self: center;
}

div.flex {
  display: flex;
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
.nav.router-link-exact-active {
  border-bottom: 4px solid var(--accent);
}
.icon {
  font-size: 20px;
}
</style>