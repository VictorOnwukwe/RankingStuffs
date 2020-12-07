<template>
  <div id="main">
    <v-app id="body">
      <toolbar
        style="z-index: 9"
        @showSidebar="showSidebar = !showSidebar"
        :closeSearch="closeSearch"
        @setOverlay="setOverlay"
        ref="toolbar"
      ></toolbar>

      <div
        v-if="overlay"
        @click="setClose()"
        style="position:fixed;width:100vw;height:100vh;background:rgba(0,0,0,0.35);z-index:7"
      ></div>

      <div>
        <preview v-if="$route.name == 'home'" id="preview"></preview>
        <v-layout justify-center>
          <v-layout
            :column="$vuetify.breakpoint.smAndDown ? true : false"
            :style="{ 'margin-top': $route.name == 'home' ? '2em' : null }"
            class="view-container"
          >
            <v-flex
              xs12
              :class="{
                sm8: !$route.name.includes('admin'),
                md9: !$route.name.includes('admin'),
              }"
            >
              <transition name="fade" mode="out-in">
                <router-view></router-view>
              </transition>
            </v-flex>
            <v-flex
              xs12
              sm8
              md3
              class="side-preview"
              v-show="
                (!loading || $vuetify.breakpoint.mdAndUp) &&
                  !$route.name.includes('admin') &&
                  !$route.name.includes('verify_email')
              "
              :class="
                ($route.name == 'category' || $route.name == 'subcategory') &&
                $vuetify.breakpoint.mdAndUp
                  ? 'category-top'
                  : ''
              "
            >
              <side-display
                :style="
                  $vuetify.breakpoint.mdAndUp
                    ? 'position: sticky; top: 120px; overflow-y:scroll; height: calc(100vh - 160px)'
                    : ''
                "
                :class="{
                  mt: $vuetify.breakpoint.mdAndUp,
                  'mt-12': $vuetify.breakpoint.smAndDown,
                }"
              ></side-display>
            </v-flex>
          </v-layout>
        </v-layout>
        <Footer v-show="!loading || $vuetify.breakpoint.smAndUp"></Footer>
        <transition name="scale-up">
          <v-btn
            v-if="showScroll"
            :small="$vuetify.breakpoint.xsOnly"
            fab
            class="scroller accent"
            @click="scrollUp()"
          >
            <v-icon size="2rem">mdi-chevron-up</v-icon>
          </v-btn>
        </transition>
      </div>
      <v-navigation-drawer
        class="hidden-md-and-up"
        height="100%"
        style="z-index:10"
        fixed
        v-model="showSidebar"
        width="280px"
      >
        <div v-if="authenticated">
          <div class="accent lighten-2">
            <v-avatar class="ml-5 mt-7"
              ><dp :src="user.profile_pic" :size="'3.8em'"></dp
            ></v-avatar>
            <v-list-item class="mt-2">
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">{{
                  user.username
                }}</v-list-item-title>
                <v-list-item-subtitle class="ptd">{{
                  user.email
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </div>

          <v-list dense>
            <v-list-item
              :to="profile + 'creations'"
              exact-active-class="grey lighten-4 accent--text font-weight-bold"
            >
              <v-list-item-icon>
                <v-icon
                  class="nav-icon"
                  size="1.5em"
                  style="transform: scale(1.3)"
                  >$vuetify.icons.creation</v-icon
                >
              </v-list-item-icon>
              <v-list-item-title class="font-weight-medium"
                >My Creations</v-list-item-title
              >
            </v-list-item>
            <v-list-item
              :to="profile + 'favorites'"
              class="ml-0"
              exact-active-class="grey lighten-4 accent--text font-weight-bold"
            >
              <v-list-item-icon>
                <v-icon class="nav-icon" size="1.2em"
                  >$vuetify.icons.star</v-icon
                >
              </v-list-item-icon>
              <v-list-item-title class="font-weight-medium"
                >My Favorites</v-list-item-title
              >
            </v-list-item>
            <v-list-item
              :to="profile"
              class="ml-0"
              exact
              exact-active-class="grey lighten-4 accent--text font-weight-bold"
            >
              <v-list-item-icon>
                <v-icon class="nav-icon" size="1.2em"
                  >$vuetify.icons.timeline</v-icon
                >
              </v-list-item-icon>
              <v-list-item-title class="font-weight-medium"
                >My Activities</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </div>
        <v-layout v-else justify-center class="my-4">
          <div>
            <m-btn
              rounded
              class="mr-1"
              @click="$store.dispatch('set_signup', true)"
              >Sign up</m-btn
            >
            <m-btn
              outlined
              rounded
              class="ml-1"
              @click="$store.dispatch('set_login', true)"
              >Login</m-btn
            >
          </div>
        </v-layout>
        <v-divider></v-divider>
        <div style="font-size:20px">
          <v-list class="pt-1 pb-0">
            <v-list-item
              v-if="isAdmin"
              :to="'/admin'"
              class="ml-0 nav-link py-0"
              exact-active-class="grey lighten-4 accent--text"
            >
              <v-list-item-icon>
                <v-icon class="nav-icon" size="1.1em"
                  >$vuetify.icons.admin</v-icon
                >
              </v-list-item-icon>
              <v-list-item-title>Admin</v-list-item-title>
            </v-list-item>
            <v-list-item
              to="/"
              class="nav-link"
              exact-active-class="grey lighten-4 accent--text"
            >
              <v-list-item-icon>
                <v-icon class="nav-icon" size="1.05em"
                  >$vuetify.icons.home</v-icon
                >
              </v-list-item-icon>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item>
            <v-list-item
              :to="'/lists'"
              class="ml-0 nav-link"
              exact
              exact-active-class="grey lighten-4 accent--text"
            >
              <v-list-item-icon>
                <v-icon class="nav-icon" size="1.1em"
                  >$vuetify.icons.list-approved</v-icon
                >
              </v-list-item-icon>
              <v-list-item-title>Lists</v-list-item-title>
            </v-list-item>
            <v-list-item
              :to="'/demands'"
              class="ml-0 nav-link"
              exact
              exact-active-class="grey lighten-4 accent--text"
            >
              <v-list-item-icon>
                <v-icon class="nav-icon" size="1.1em"
                  >$vuetify.icons.queue</v-icon
                >
              </v-list-item-icon>
              <v-list-item-title>Demands</v-list-item-title>
            </v-list-item>
            <v-list-item
              :to="'/create'"
              class="ml-0 nav-link py-0"
              exact-active-class="grey lighten-4 accent--text"
            >
              <v-list-item-icon>
                <v-icon class="nav-icon" size="1.1em"
                  >$vuetify.icons.create</v-icon
                >
              </v-list-item-icon>
              <v-list-item-title>Create List</v-list-item-title>
            </v-list-item>
            <v-list-item
              :to="'/demand'"
              class="ml-0 nav-link py-0"
              exact-active-class="grey lighten-4 accent--text"
            >
              <v-list-item-icon>
                <v-icon class="nav-icon" size="1.1em"
                  >$vuetify.icons.demand</v-icon
                >
              </v-list-item-icon>
              <v-list-item-title>Demand List</v-list-item-title>
            </v-list-item>
            <v-list-item
              :to="'/categories'"
              class="ml-0 nav-link py-0"
              exact-active-class="grey lighten-4 accent--text"
              exact
            >
              <v-list-item-icon>
                <v-icon class="nav-icon" size="1em"
                  >$vuetify.icons.category</v-icon
                >
              </v-list-item-icon>
              <v-list-item-title>Categories</v-list-item-title>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list>
            <v-list-item
              v-if="authenticated"
              @click="$store.dispatch('logout')"
            >
              <v-list-item-icon>
                <v-icon class="nav-icon">$vuetify.icons.logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                Logout
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
      </v-navigation-drawer>
      <v-snackbar v-model="snackbar.show" :color="snackbar.type"
        >{{ snackbar.message }}
        <v-spacer></v-spacer>
        <v-icon :color="'white'" @click="hideSnackbar()">mdi-close</v-icon>
      </v-snackbar>
      <v-dialog
        v-if="!authenticated"
        persistent
        v-model="loginDialog"
        max-width="500px"
      >
        <Login v-if="loginDialog"></Login>
      </v-dialog>

      <v-dialog
        v-if="!authenticated"
        persistent
        v-model="signupDialog"
        max-width="500px"
      >
        <Signup v-if="signupDialog"></Signup>
      </v-dialog>
    </v-app>
  </div>
</template>

<script>
import Toolbar from "./components/Toolbar";
import Footer from "./components/Footer";
import HomePreview from "./components/HomePreview";
import SideDisplay from "./components/SideDisplay";
import Login from "./components/Login";
import Signup from "./components/Signup";

export default {
  name: "App",
  components: {
    Toolbar,
    Footer,
    preview: HomePreview,
    SideDisplay,
    Login,
    Signup,
  },
  data() {
    return {
      closeSearch: false,
      showScroll: false,
      showSidebar: false,
      overlay: false,
    };
  },

  methods: {
    setClose() {
      this.closeSearch = true;
      setTimeout(() => {
        this.closeSearch = false;
      }, 500);
    },
    scrollUp() {
      window.scrollTo(0, 0);
    },
    hideSnackbar() {
      this.$store.dispatch("set_snackbar", { show: false });
    },
    setOverlay(val) {
      this.overlay = val;
    },
    hideUpscroll() {
      var y = window.scrollY;
      if (y >= 500) {
        this.showScroll = true;
      } else {
        this.showScroll = false;
      }
    },
  },

  computed: {
    loading() {
      return this.$store.getters.getLoading;
    },
    authenticated() {
      return this.$store.getters.authenticated;
    },
    profile() {
      return "/users/" + this.user.id + "/";
    },

    user() {
      if (!this.authenticated) {
        return null;
      }
      return this.$store.getters.getUser;
    },
    snackbar() {
      return this.$store.getters.snackbar;
    },
    loginDialog() {
      return this.$store.getters.login;
    },
    signupDialog() {
      return this.$store.getters.signup;
    },
    isAdmin() {
      if (!this.authenticated) {
        return false;
      }
      return this.user.id == "c6F7pgDchSfyY931qz1kUUWDKOR2";
    },
  },

  watch: {
    showSidebar() {
      this.$refs.toolbar.setSidebar(this.showSidebar);
    },
  },

  created: function() {
    this.$store.dispatch("initialize").then(() => {});
    window.addEventListener("scroll", this.hideUpscroll);
  },
};
</script>

<style>
@import url("./my-modules/css/global.css");
</style>
