<template>
  <div class="affix elevation-3">
    <div id="main" class="brand" @click="action()">
      <div class="mx-auto content">
        <v-layout justify-space-between>
          <v-flex>
            <v-layout align-center>
              <v-app-bar-nav-icon
                @click="emitSidebar()"
                color="rgba(255, 255, 255, 0.902)"
                class="hidden-md-and-up mr-2"
              ></v-app-bar-nav-icon>
              <router-link :to="'/'" class="py-1" style="font-size:1.5em">
                <span class="white--text">the</span>
                <span class="white--text font-weight-medium">TOP</span>
                <span class="accent--text font-weight-black">TENERS</span>
              </router-link>
            </v-layout>
          </v-flex>
          <v-flex>
            <v-layout style="height:4.5em" align-center justify-space-around>
              <v-flex grow class="hidden-sm-and-down">
                <v-layout justify-center class="">
                  <router-link tag="a" class="nav" to="/">Home</router-link>
                  <router-link tag="a" class="nav" to="/lists"
                    >Lists</router-link
                  >
                  <router-link
                    tag="a"
                    class="nav"
                    style="margin-left:1em"
                    to="/demands"
                    >Demands</router-link
                  >
                  <router-link tag="a" class="nav" to="/create"
                    >Create</router-link
                  >
                  <router-link tag="a" class="nav" to="/demand"
                    >Demand</router-link
                  >
                </v-layout>
              </v-flex>
              <v-flex>
                <v-layout v-if="!authenticated" justify-end class="">
                  <v-icon
                    color="rgba(255, 255, 255, 0.902)"
                    class="mr-2"
                    @click.stop="search = !search"
                    >search</v-icon
                  >
                  <a @click="loginDialog = true" class="">Login</a>
                  <a @click="signupDialog = true" class="">Signup</a>
                </v-layout>
                <v-layout v-else justify-end align-center>
                  <v-icon
                    color="rgba(255, 255, 255, 0.902)"
                    @click.stop="search = !search"
                    size="25"
                    >{{ !search ? "search" : "mdi-close" }}</v-icon
                  >
                  <v-badge overlap class="ml-4" color="accent">
                    <template v-slot:badge>
                      <span v-if="notifications > 0">{{ notifications }}</span>
                    </template>
                    <v-icon
                      @click.stop="notification = !notification"
                      color="rgba(255, 255, 255, 0.902)"
                      size="25"
                      >mdi-bell</v-icon
                    >
                  </v-badge>
                  <v-menu
                    offset-y
                    open-on-hover
                    close-on-content-click
                    close-on-click
                    max-width="250px"
                    v-if="$vuetify.breakpoint.mdAndUp"
                  >
                    <template v-slot:activator="{ on }">
                      <div v-on="on" class="ml-4">
                        <dp :src="user.profile_pic" :size="'2em'"></dp>
                      </div>
                    </template>
                    <v-list dense color="">
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-avatar size="2em" v-if="user.profile_pic">
                            <img :src="user.profile_pic.low" />
                          </v-avatar>
                          <v-avatar size="2em" v-else>
                            <img :src="require('../assets/nophoto.jpg')" />
                          </v-avatar>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title
                            class="font-weight-black subtitle-1 "
                            >{{ user.username }}</v-list-item-title
                          >
                          <v-list-item-subtitle class="">{{
                            user.email
                          }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item
                        :to="profile + 'creations'"
                        class="ml-0"
                        exact-active-class="grey lighten-4 accent--text font-weight-bold"
                      >
                        <v-list-item-icon>
                          <v-icon color size="1.5em">mdi-creation</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title class=""
                          >My Creations</v-list-item-title
                        >
                      </v-list-item>
                      <v-list-item
                        :to="profile"
                        class="ml-0"
                        exact
                        exact-active-class="grey lighten-4 accent--text font-weight-bold"
                      >
                        <v-list-item-icon>
                          <v-icon size="1.2em" color>fa-star</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title class=""
                          >My Favorites</v-list-item-title
                        >
                      </v-list-item>
                      <v-list-item
                        class="ml-0"
                        :to="profile + 'activities'"
                        exact-active-class="grey lighten-4 accent--text font-weight-bold"
                      >
                        <v-list-item-icon>
                          <v-icon color>mdi-timeline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title class=""
                          >My Activities</v-list-item-title
                        >
                      </v-list-item>
                      <v-list-item @click="logout()" class="tile">
                        <v-list-item-icon>
                          <v-icon>mdi-logout</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title class="">Logout</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                  <div v-else class="ml-4">
                    <dp :src="user.profile_pic" :size="'2em'"></dp>
                  </div>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </div>
    </div>
    <v-layout justify-center class="brand px-4">
      <v-layout
        class="cat-display brand"
        style="overflow-x:scroll; max-width: 1200px"
      >
        <v-menu
          v-for="(category, index) in categories"
          :key="index"
          max-height="500px"
          min-width="150px"
          bottom
          offset-y
          open-on-hover
        >
          <template v-slot:activator="{ on }">
            <a
              v-on="on"
              class="text-capitalize cat-link brand--text text--lighten-4"
              >{{ category.name }}</a
            >
          </template>
          <div class="menu-display px-4 py-2">
            <router-link
              :to="'/categories/' + category.name"
              class="ptd"
              style="display:block"
              >all</router-link
            >
            <div v-for="(sub, index) in category.subs" :key="index">
              <router-link
                tag="a"
                :to="'/categories/' + category.name + '/' + sub.name"
                style="display:block"
                >{{ sub.name }}</router-link
              >
            </div>
          </div>
        </v-menu>
      </v-layout>
    </v-layout>
    <v-progress-linear
      v-if="loading"
      height="2"
      color="brand darken-1"
      indeterminate
    ></v-progress-linear>
    <transition name="search-bar">
      <div v-if="search" class="search elevation-3 grey lighten-3">
        <div class="search-field">
          <input
            style="height:3em; padding: 0.2em 3em 0.2em 0.5em; width: 100%"
            type="text"
            v-model="keyword"
            @keyup="fetchResults()"
          />
          <v-icon style="position:absolute; right:0.5em; top:0.5em"
            >search</v-icon
          >
        </div>
        <div class="search-results grey lighten-3">
          <div v-if="demands.length > 0 || lists.length > 0" style="">
            <v-card
              flat
              tile
              v-if="lists.length > 0"
              class="ptd grey lighten-3"
            >
              <div
                class="title-text pl-2 pt-2 grey--text text--darken-2 font-weight-bold"
              >
                Lists
              </div>
              <div class="px-2 my-4">
                <span
                  v-for="(result, index) in lists"
                  :key="index"
                  @click="(search = false), go('/lists/' + result.id)"
                  class="underline pointer text-capitalize"
                >
                  {{ result.data().title }}<br />
                </span>
              </div>
            </v-card>
            <v-card
              flat
              tile
              v-if="demands.length > 0"
              class="ptd grey lighten-3"
            >
              <div
                class="title-text grey--text text--darken-2 pl-2 pt-2 font-weight-bold"
              >
                Demands
              </div>
              <div class="px-2 my-4">
                <span
                  v-for="(result, index) in demands"
                  :key="index"
                  @click="(search = false), go('/demands/' + result.id)"
                  class="underline pointer text-capitalize"
                >
                  {{ result.data().title }}<br />
                </span>
              </div>
            </v-card>
          </div>
          <div v-else-if="keyword.length >= 5 && !searching">
            <v-card tile flat class="ptd white">
              <v-card-text class
                >Sorry. This list does not exist yet. Be the first to create or
                demand it.</v-card-text
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <m-btn text small @click="goSearchedDemand()">Demand</m-btn>
                <m-btn text small @click="goSearchedCreate()">Create</m-btn>
              </v-card-actions>
            </v-card>
          </div>
          <div v-else-if="keyword.length >= 5">
            <v-layout justify-center>
              <v-progress-circular
                class="my-4"
                size="20"
                color="brand"
                :width="3"
                indeterminate
              ></v-progress-circular>
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
        @signup="(loginDialog = false), (signupDialog = true)"
        v-if="loginDialog"
        @close="loginDialog = false"
      ></Login>
    </v-dialog>

    <v-dialog v-if="!authenticated" v-model="signupDialog" max-width="500px">
      <Signup
        v-if="signupDialog"
        @login="(signupDialog = false), (loginDialog = true)"
        @close="signupDialog = false"
      ></Signup>
    </v-dialog>
  </div>
</template>

<script>
import Login from "./Login";
import Signup from "./Signup";
import { setTimeout } from "timers";
import Notifications from "./Notifications";
import "firebase/firestore";
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
      this.search = false;
      this.$router.push({
        path: "/create",
        query: { searched: true, title: this.keyword }
      });
    },

    goList() {
      this.$router.push({ path: "/lists/pTt8MoCSxEyJxEYwEqRQ" });
    },
    goSearchedDemand() {
      this.search = false;
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
    setLogin(val) {
      this.$store.dispatch("set_login", val);
    },
    setSignup(val) {
      this.$store.dispatch("set_signup", val);
    },
    emitSidebar() {
      this.$emit("showSidebar", !this.showSidebar);
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
    login() {
      this.loginDialog = this.login;
    },
    signup() {
      this.signupDialog = this.signup;
    },
    loginDialog() {
      if (this.loginDialog == false) {
        this.setLogin(false);
      }
    },
    signupDialog() {
      if (this.signupDialog == false) {
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
      return "/users/" + this.user.id + "/";
    },
    notifications() {
      return this.$store.getters.notifications;
    },
    login() {
      return this.$store.getters.login;
    },
    signup() {
      return this.$store.getters.signup;
    },
    categories() {
      return this.$store.getters.categories.filter(
        category => category.name !== "miscellaneous"
      );
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
.dim {
  background-color: rgba(0, 0, 0, 0.1);
  /* background: repeating-linear-gradient(
    -45deg,
    #606dbc,
    #606dbc 10px,
    #424242 10px,
    #424242 20px
  ); */
}
.content {
  max-width: 1200px;
  padding: 0 0.5em;
}
@media (min-width: 800px) {
  .content {
    padding: 0 1em;
  }
}
@media (min-width: 1200px) {
  .content {
    padding: 0;
  }
}
.search {
  position: absolute;
  top: 3.5em;
  padding: 0px;
  right: 1em;
  width: calc(100% - 2em);
  /* background-color: rgba(255,255,255,0.95); */
}
.search-field {
  background-color: rgb(243, 243, 243);
}

.search-results {
  width: 100%;
  overflow-y: scroll;
  max-height: calc(70vh);
}
@media (min-width: 500px) {
  .search {
    width: 400px;
  }
}

.notification {
  position: absolute;
  padding: 0px;
  top: 0;
  width: calc(100%);
  background-color: #e3f2fd;
  z-index: 6;
  max-width: 700px;
}

@media (min-width: 600px) {
  .notification {
    width: 70%;
    right: 1em;
    top: 3.5em;
  }
}
@media (min-width: 850px) {
  .notification {
    width: 50%;
  }
}
.menu-display {
  background-color: rgba(255, 255, 255, 0.95);
}
.menu-display a {
  color: rgba(0, 0, 0, 0.87) !important;
  display: inline-block;
}
.menu-display a:hover {
  color: var(--brand) !important;
}
.cat-link {
  margin-right: 1.5em;
  font-family: "Oswald", sans-serif;
}
.cat-link:hover {
  color: var(--brand) !important;
}

.cat-display::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: white;
  display: none;
}

.cat-display::-webkit-scrollbar {
  height: 5px;
  /* background-color: #f5f5f5; */
}

.cat-display:hover::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.5);
}

.cat-display::-webkit-scrollbar-thumb {
  background-color: #388e3c;
  /* background-color: white; */
  /* background-color: rgba(255,255,255,0.7); */
}

.affix {
  position: fixed;
  top: 0;
  z-index: 7;
  width: 100%;
}
@media (min-width: 600px) {
  .affix {
    position: fixed;
  }
}
#main {
  width: calc(100%);
  /* background-color: grey; */
  /* background: linear-gradient(180deg, #1565c0, #1976d2); */
  /* background: var(--brand); */
  /* background: rgba(0,0,0,0); */
}
div > a {
  padding-bottom: 0.2em;
}
a {
  color: white !important;
  /* font-weight: bold; */
  text-decoration: none;
  /* color: rgba(255, 255, 255, 0.902) */
  line-height: 200%;
}
a:hover {
  color: #ffffffe6 !important;
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
.nav {
  /* font-family: "Oswald", sans-serif; */
  font-size: 1.2em;
  /* font-weight: bold; */
}
.nav.router-link-exact-active {
  color: var(--accent) !important;
  font-weight: bolder;
  text-shadow: 0px 0px 8px var(--accent);
}
.block {
  display: block;
}
.icon {
  font-size: 20px;
}
.tile:active > * {
  color: var(--brand) !important;
  font-weight: bold;
}
</style>
