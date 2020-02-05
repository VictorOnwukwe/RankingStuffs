<template>
  <div class="affix elevation-3">
    <div style="width:100%" class="white" @click="action()">
      <div class="mx-auto content">
        <v-layout justify-space-between align-center>
          <v-flex>
            <v-layout align-center>
              <v-app-bar-nav-icon
                @click="emitSidebar()"
                color=""
                class="hidden-md-and-up mr-2"
              ></v-app-bar-nav-icon>
              <router-link :to="'/'" class="py-1" style="font-size:1.5em">
                <!-- <span class="white--text">the</span> -->
                <div style="font-size:1em">
            <div>
            <span class="accent--text font-weight-black">Ranking</span>
            </div>
            <div class="mt-n3">
            <span class="grey--text font-weight-black">STUFFS</span>
            <!-- <span class="accent--text font-weight-black">...</span> -->
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
                <v-layout v-if="!authenticated" justify-end class="">
                  <v-icon
                    color="brand"
                    class="mr-4"
                    @click.stop="search = !search"
                    >{{ !search ? "search" : "mdi-close" }}</v-icon
                  >
                  <a @click="$store.dispatch('set_login', true)" class=""
                    >Login</a
                  >
                  <a @click="$store.dispatch('set_signup', true)" class=""
                    >Signup</a
                  >
                </v-layout>
                <v-layout v-else justify-end align-center>
                  <v-icon
                    color=""
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
                      color=""
                      size="25"
                      >mdi-bell-outline</v-icon
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
                      <div v-on="on" class="ml-4">
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
        </v-layout>
      </div>
    </div>
    <v-layout v-if="$vuetify.breakpoint.mdAndUp" justify-center class="grey lighten-4 px-4">
      <v-layout
        class="cat-display"
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
              style="white-space:nowrap"
              v-on="on"
              class="text-capitalize cat-link grey--text text--darken-2"
            >
              {{ category.name }}
            </a>
          </template>
          <div class="menu-display px-4 py-2">
            <router-link
              :to="'/categories/' + category.name"
              class="category block"
              >{{ category.name }}</router-link
            >
            <div v-for="(sub, index) in category.subs" :key="index">
              <router-link
                tag="a"
                :to="subLink(category.name, sub.name)"
                class="font-weight-medium sub-category block"
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
      color="accent"
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
        <div class="search-results white">
          <div v-if="demands.length > 0 || lists.length > 0" style="">
            <div v-if="lists.length > 0" class="ptd">
              <div
                class="title-text pl-2 pt-2 grey--text text--darken-2 font-weight-bold"
              >
                Lists
              </div>
              <div class="px-2 mb-4">
                <span
                  v-for="(result, index) in lists"
                  :key="index"
                  @click="(search = false), go('/lists/' + result.id)"
                  class="underline pointer text-capitalize"
                >
                  {{ result.data().title }}<br />
                </span>
              </div>
            </div>
            <div v-if="demands.length > 0" class="ptd">
              <div
                class="title-text grey--text text--darken-2 pl-2 pt-2 font-weight-bold"
              >
                Demands
              </div>
              <div class="px-2 mb-4">
                <span
                  v-for="(result, index) in demands"
                  :key="index"
                  @click="(search = false), go('/demands/' + result.id)"
                  class="underline pointer text-capitalize"
                >
                  {{ result.data().title }}<br />
                </span>
              </div>
            </div>
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
  </div>
</template>

<script>
import { setTimeout } from "timers";
import Notifications from "./Notifications";
import "firebase/firestore";
let _ = require("lodash");
export default {
  components: {
    Notifications
  },
  props: {
    closeSearch: Boolean
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
      this.$store
        .dispatch("logout")
        .then(() => {})
        .catch(_ => {});
    },
    fetchResults: _.throttle(async function() {
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
    }, 1000),
    setLogin(val) {
      this.$store.dispatch("set_login", val);
    },
    setSignup(val) {
      this.$store.dispatch("set_signup", val);
    },
    emitSidebar() {
      this.$emit("showSidebar", !this.showSidebar);
    },
    encryptCategory(name) {
      return name.replace(/\//g, "zzsl");
    },
    decryptCategory(name) {
      return name.replace(/%sl/g, "/");
    },
    subLink(cat, sub) {
      return "/categories/" + cat + "/" + this.encryptCategory(sub);
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
    },
    isAdmin() {
      if (!this.authenticated) {
        return false;
      }
      return this.user.id == "c6F7pgDchSfyY931qz1kUUWDKOR2";
    }
  }
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

.cat-display::-webkit-scrollbar-track {
  /* box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
  background-color: white;
  display: none;
}

.cat-display::-webkit-scrollbar {
  height: 5px;
}

.cat-display:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
}

.cat-display::-webkit-scrollbar-thumb {
  background-color: #F5F5F5;
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
.nav{
  color: rgba(0, 0, 0, 0.87) !important;
  text-decoration: none;
  font-family: 'Oswald', sans-serif;
  font-weight: bold;
}
a:hover {
  /* color: #ffffffe6 !important; */
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
  color: var(--accent) !important;
  font-weight: bolder;
}
.block {
  display: block;
}
.tile:active > * {
  color: var(--brand) !important;
  font-weight: bold;
}
</style>
