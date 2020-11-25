<template>
  <div>
    <div class="affix elevation-3">
      <v-progress-linear
        v-if="loading"
        height="3"
        color="accent"
        striped
        indeterminate
        style="position:absolute;top:0"
      ></v-progress-linear>
      <div style="width:100%" class="brand" @click="action()">
        <div class="mx-auto content">
          <v-layout justify-space-between align-center>
            <v-flex>
              <v-layout align-center>
                <router-link :to="'/'" class="py-1" style="font-size:1.5em">
                  <!-- <span class="white--text">the</span> -->
                  <div style="display:flex; align-items:center">
                    <img src="../assets/logo-trans-high.png" class="logo"/>
                    <div class="" style="font-size:0.6em">
                      <div>
                        <span class="accent--text font-weight-black"
                          >Ranking</span
                        >
                      </div>
                      <div class="mt-n3">
                        <span class="white--text font-weight-black"
                          >STUFFS</span
                        >
                        <!-- <span class="accent--text font-weight-black">...</span> -->
                      </div>
                    </div>
                  </div>
                  <!-- <v-img width="100px" aspect-ratio="1" :src="require('../assets/logo.jpg')"></v-img> -->
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
                      >Create List</router-link
                    >
                    <router-link tag="a" class="nav" to="/demand"
                      >Demand List</router-link
                    >
                    <router-link v-if="isAdmin" tag="a" class="nav" to="/admin"
                      >Admin</router-link
                    >
                  </v-layout>
                </v-flex>
                <v-flex>
                  <v-layout v-if="!authenticated" justify-end align-center>
                    <v-icon
                      color="rgba(255, 255, 255, 0.902)"
                      class="mr-4"
                      @click.stop="
                        notification ? (notification = false) : null,
                          (search = !search),
                          (keyword = '')
                      "
                      >{{
                        !search ? "$vuetify.icons.search" : "mdi-close"
                      }}</v-icon
                    >
                    <a
                      @click="$store.dispatch('set_login', true)"
                      class="white--text"
                      >Login</a
                    >
                    <a
                      @click="$store.dispatch('set_signup', true)"
                      class="white--text"
                      >Signup</a
                    >
                  </v-layout>
                  <v-layout v-else justify-end align-center>
                    <v-icon
                      color="rgba(255, 255, 255, 0.902)"
                      @click.stop="
                        notification ? (notification = false) : null,
                          (search = !search),
                          (keyword = '')
                      "
                      size="25"
                      >{{
                        !search ? "$vuetify.icons.search" : "mdi-close"
                      }}</v-icon
                    >
                    <v-badge overlap class="ml-4" color="accent">
                      <template v-slot:badge>
                        <span v-if="notifications > 0">{{
                          notifications
                        }}</span>
                      </template>
                      <v-icon
                        @click.stop="
                          search ? (search = false) : null,
                            (notification = !notification)
                        "
                        color="rgba(255, 255, 255, 0.902)"
                        size="26"
                        >$vuetify.icons.bell</v-icon
                      >
                    </v-badge>
                    <v-menu
                      offset-y
                      open-on-click
                      close-on-content-click
                      close-on-click
                      max-width="250px"
                      v-if="$vuetify.breakpoint.mdAndUp"
                    >
                      <template v-slot:activator="{ on }">
                        <div v-on="on" class="ml-4 dp pointer">
                          <dp :src="user.profile_pic"></dp>
                        </div>
                      </template>
                      <v-list dense color="">
                        <v-list-item>
                          <v-list-item-avatar>
                            <dp :src="user.profile_pic"></dp>
                          </v-list-item-avatar>
                          <v-list-item-content>
                            <v-list-item-title
                              class="font-weight-black subtitle-1 "
                              >{{ user.username }}</v-list-item-title
                            >
                            <v-list-item-subtitle>{{
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
                          :to="profile + 'favorites'"
                          class="ml-0"
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
                          :to="profile"
                          exact-active-class="grey lighten-4 accent--text font-weight-bold"
                          exact
                        >
                          <v-list-item-icon>
                            <v-icon color>mdi-view-list</v-icon>
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
                <v-icon
                  @click="emitSidebar()"
                  color="rgba(255, 255, 255, 0.902)"
                  class="hidden-md-and-up ml-4 mr-1"
                  >{{showSidebar ? "mdi-close" : "$vuetify.icons.menu"}}</v-icon
                >
          </v-layout>
        </div>
      </div>
      <v-layout
        v-if="$vuetify.breakpoint.mdAndUp"
        justify-center
        class="brand px-4"
      >
        <v-layout
          class="cat-display brand"
          style="overflow-x:scroll; max-width: 1200px"
        >
          <v-menu
            v-for="(category, index) in categories"
            :key="index"
            max-height="500px"
            max-width="250px"
            min-width="200px"
            bottom
            offset-y
            open-on-hover
          >
            <template v-slot:activator="{ on }">
              <a
                style="white-space:nowrap;font-size:15px"
                v-on="on"
                class="cat-link brand--text text--lighten-4 font-weight-medium"
              >
                {{ category.name }}
              </a>
            </template>
            <div class="menu-display px-4 py-2">
              <router-link
                :to="'/categories/' + category.name"
                class="category block ptd font-weight-medium mb-2"
                >{{ category.name }}</router-link
              >
              <div v-for="(sub, index) in category.subs" :key="index">
                <router-link
                  tag="a"
                  style="line-height:200%"
                  :to="subLink(category.name, sub.name)"
                  class="sub-category block std"
                  >{{ sub.name }}</router-link
                >
              </div>
            </div>
          </v-menu>
        </v-layout>
      </v-layout>
      <transition name="search-bar">
        <div v-if="search" class="search">
          <div class="search-field elevation-3">
            <input
              style="height:3em; padding: 0.2em 0.5em 0.2em 2.5em; width: 100%"
              type="text"
              v-model="keyword"
            />
            <v-icon style="position:absolute; left:0.3em; top:0.5em"
              >$vuetify.icons.search</v-icon
            >
          </div>
          <search-results
            class="mt-3 elevation-3"
            :keyword="keyword"
            @closeSearch="search = false"
            @clearKeyword="keyword = ''"
          ></search-results>
        </div>
      </transition>

      <transition name="notification-bar">
        <div v-if="notification" class="notification">
          <Notifications
            @close="(notification = false), setOverlay()"
          ></Notifications>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { setTimeout } from "timers";
import Notifications from "./Notifications";
import SearchResults from "./ListAndDemandSearch";
import "firebase/firestore";
let _ = require("lodash");
export default {
  components: {
    Notifications,
    SearchResults,
  },
  props: {
    closeSearch: Boolean,
  },
  data() {
    return {
      navDrawer: null,
      search: false,
      results: [],
      keyword: "",
      notification: false,
      showSidebar: false,
      demands: [],
      lists: [],
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

    goList() {
      this.$router.push({ path: "/lists/pTt8MoCSxEyJxEYwEqRQ" });
    },

    go(link) {
      this.$router.push({ path: link });
    },

    logout() {
      this.signupDialog = false;
      this.loginDialog = false;
      this.$store
        .dispatch("logout")
        .then(() => {})
        .catch((_) => {});
    },
    setLogin(val) {
      this.$store.dispatch("set_login", val);
    },
    setSignup(val) {
      this.$store.dispatch("set_signup", val);
    },
    emitSidebar() {
      this.showSidebar = !this.showSidebar;
      this.$emit("showSidebar", this.showSidebar);
    },
    setSidebar(sidebar){
      this.showSidebar = sidebar;
    },
    encryptCategory(name) {
      return name.replace(/\//g, "zzsl");
    },
    decryptCategory(name) {
      return name.replace(/%sl/g, "/");
    },
    subLink(cat, sub) {
      return "/categories/" + cat + "/" + this.encryptCategory(sub);
    },
    setOverlay() {
      this.$emit("setOverlay", this.search || this.notification);
    },
  },

  watch: {
    closeSearch() {
      this.closeSearch ? this.action() : null;
    },
    search() {
      this.setOverlay();
    },
    notification() {
      this.setOverlay();
    },
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
        (category) => category.name !== "miscellaneous"
      );
    },
    isAdmin() {
      if (!this.authenticated) {
        return false;
      }
      return this.user.id == "c6F7pgDchSfyY931qz1kUUWDKOR2";
    },
  },
};
</script>

<style scoped>
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
  top: 0em;
  width: calc(100%);
  background-color: #e3f2fd;
  z-index: 6;
  max-width: 700px;
}

@media (min-width: 500px) {
  .notification {
    width: 80%;
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
.sub-category {
  color: rgba(0, 0, 0, 0.87) !important;
  display: inline-block;
}
.sub-category:hover {
  color: var(--brand) !important;
}
.category {
  color: rgba(0, 0, 0, 0.54) !important;
  display: inline-block;
}
.category:hover {
  color: var(--brand) !important;
}
.cat-link {
  margin-right: 1.5em;
  font-family: "Oswald", sans-serif;
}
.cat-display::scrollbar-track {
  background-color: white;
}

.cat-display::-webkit-scrollbar-track {
  /* box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
  background-color: white;
  display: none;
}

.cat-display::-webkit-scrollbar {
  margin-top: 1px;
  height: 5px;
}

.cat-display:hover::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.5);
}

.cat-display::-webkit-scrollbar-thumb {
  background-color: #388e3c;
}

.affix {
  position: fixed;
  top: 0;
  /* z-index: 7; */
  width: 100%;
}
@media (min-width: 600px) {
  .affix {
    position: fixed;
  }
}
a {
  text-decoration: none;
}
.nav {
  color: white !important;
  text-decoration: none;
  /* font-family: "Oswald", sans-serif; */
  /* font-weight: bold; */
}
.nav:hover {
  color: #ffffffe6 !important;
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
.nav {
  /* font-family: "Oswald", sans-serif; */
  font-size: 1.2em;
  /* font-weight: bold; */
}
.nav.router-link-exact-active {
  background-image: linear-gradient(var(--accent), var(--accent));
  background-repeat: no-repeat;
  background-size: 100% 2px;
  background-position: 100% 100%;
}
.block {
  display: block;
}
.tile:active > * {
  color: var(--brand) !important;
  font-weight: bold;
}
.dp {
  border-radius: 5px;
}
.dp:hover {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.8);
}
.logo{
  margin-right: 0.2em;
  background: transparent;
  width: 2.5em;
}
</style>
