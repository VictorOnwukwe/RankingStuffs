<template>
  <div class="affix elevation-3">
    <div id="main" @click="search = false">
      <div style="max-width:1200px; padding:0 0.5em" class="mx-auto">
        <v-layout>
          <v-flex shrink>
            <v-layout align-center>
              <v-app-bar-nav-icon
                v-if="['home'].indexOf($route.name) < 0"
                @click="showSidebar = !showSidebar"
                class="white--text hidden-sm-and-up"
              ></v-app-bar-nav-icon>
              <a @click="goList()" class="brand pa-1 white--text">Top 10</a>
            </v-layout>
          </v-flex>
          <v-flex>
            <v-layout style="height:3.5em" align-center>
              <v-flex class="hidden-xs-only">
                <v-layout justify-center>
                  <router-link tag="a" class="nav" to="/popular-lists">Popular</router-link>
                  <router-link tag="a" class="nav" to="/latest-lists">Latest</router-link>
                  <router-link tag="a" class="nav" to="/demanded">On-Demand</router-link>
                </v-layout>
              </v-flex>
              <v-flex class="hidden-sm-and-down">
                <v-layout justify-center>
                  <router-link tag="a" class="nav" to="/create">Create</router-link>
                  <router-link tag="a" class="nav" to="/demand">Demand</router-link>
                </v-layout>
              </v-flex>
              <v-flex>
                <v-layout v-if="!authenticated" justify-end class="mr-2">
                  <v-icon color="#ffffffe6" class="mr-2" @click.stop="search = !search">search</v-icon>
                  <a @click="loginDialog=true">Login</a>
                  <a @click="signupDialog=true">Signup</a>
                </v-layout>
                <v-layout v-else justify-end>
                  <v-icon color="#ffffffe6" @click.stop="search = !search" size="25">search</v-icon>
                  <v-icon
                    @click="notification=!notification"
                    class="ml-4"
                    color="white"
                    size="25"
                  >mdi-bell</v-icon>
                  <v-menu offset-y open-on-hover>
                    <template v-slot:activator="{ on }">
                      <div v-on="on">
                        <v-avatar class="ml-4" size="30">
                          <img :src="user.profile_pic" />
                        </v-avatar>
                        <v-icon color="white">mdi-menu-down</v-icon>
                      </div>
                    </template>
                    <v-list color="grey lighten-4">
                      <v-list-item @click="go(profile)">
                        <v-list-item-icon>
                          <v-avatar size="1.7em">
                            <v-img :src="user.profile_pic"></v-img>
                          </v-avatar>
                        </v-list-item-icon>
                        <v-list-item-title>
                          Profile
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="logout()">
                        <v-list-item-icon>
                          <v-icon>mdi-logout</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                          Logout
                        </v-list-item-title>
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
              <v-card-text
                class
              >Sorry. This list does not exist yet. Be the first to create or demand it.</v-card-text>
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
      <Login
        @close="loginDialog = false"
        @signup="loginDialog = false, signupDialog = true"
        v-if="loginDialog"
      ></Login>
    </v-dialog>

    <v-dialog v-if="!authenticated" v-model="signupDialog" max-width="500px">
      <Signup
        @close="signupDialog = false"
        v-if="signupDialog"
        @login="signupDialog = false, loginDialog = true"
      ></Signup>
    </v-dialog>

    <v-navigation-drawer
      :expand-on-hover="$vuetify.breakpoint.md || $vuetify.breakpoint.sm ? true : false"
      :permanent="!$vuetify.breakpoint.xs ? true : false"
      height="calc(100vh - 3.5em)"
      style="margin-top:3.5em"
      fixed
      dark
      :temporary="$vuetify.breakpoint.xs ? true : false"
      v-model="showSidebar"
    >
      <template v-if="authenticated" v-slot:prepend>
        <v-list>
          <v-list-item @click="go(profile)">
            <v-list-item-avatar>
              <v-img :src="user.profile_pic"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="title">{{user.username}}</v-list-item-title>
              <v-list-item-subtitle class>{{user.email}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list nav dense>
          <v-list-item @click="go(profile + 'creations')">
            <v-list-item-icon>
              <v-icon color="#EEEEEE" size="1.2em">fa-list-alt</v-icon>
            </v-list-item-icon>
            <v-list-item-title>My Creations</v-list-item-title>
          </v-list-item>
          <v-list-item @click="go(profile + '')">
            <v-list-item-icon>
              <v-icon size="1.2em" color="#EEEEEE">fa-star</v-icon>
            </v-list-item-icon>
            <v-list-item-title>My Favorites</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon color="#EEEEEE">mdi-creation</v-icon>
            </v-list-item-icon>
            <v-list-item-title>My Timeline</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>
      </template>

      <v-list dense nav>
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
          </v-list-item> -->
          <v-list-item @click="go('popular-lists')">
            <v-list-item-title>Popular</v-list-item-title>
          </v-list-item>
          <v-list-item @click="go('/latest-lists')">
            <v-list-item-title>Latest</v-list-item-title>
          </v-list-item>
          <!-- <v-list-item @click>
            <v-list-item-title>Trending</v-list-item-title>
          </v-list-item> -->
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
export default {
  components: {
    Login,
    Signup,
    Notifications,
    Sidebar
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
      showSidebar: false
    };
  },

  methods: {

    action() {
      setTimeout(() => {
        this.search = false;
        this.results = [];
        this.keyword = "";
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

    logout() {
      this.signupDialog = false;
      this.loginDialog = false;
      this.$store.dispatch("logout").then(() => {
        this.$router.go();
      });
    },
    fetchResults() {
      if (this.keyword.length < 5) {
        return;
      }
      this.results = this.$store.getters.getDemands.filter(demand => {
        return demand.title
          .toLowerCase()
          .includes(this.keyword.toLowerCase().trim());
      });
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
    }
  },

  watch: {
    closeSearch() {
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
    },
    profile() {
      return "/" + this.user.id + "/profile/";
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
  top: 3.5em;
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
  top: 3.5em;
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
  /* background: linear-gradient(180deg, #1565c0, #1976d2); */
  background: #1867c0;
  /* background: #E9E9ED; */
}
div > a {
  padding-bottom: 0.2em;
}
a {
  color: #ffffffe6 !important;
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
.nav.router-link-exact-active {
  /* color: pink !important; */
  /* box-shadow: 0 0 0 1px white; */
  outline: 1px solid rgba(255, 255, 255, 0.9);
  padding: 0 0.4em;
}
.icon {
  font-size: 20px;
}
</style>