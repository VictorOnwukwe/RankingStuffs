<template>
  <div id="main">
    <v-app id="body">
      <toolbar
        style="z-index: 9"
        @showSidebar="showSidebar = !showSidebar"
        :closeSearch="closeSearch"
        @setOverlay="setOverlay"
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
            :column="$vuetify.breakpoint.xs ? true : false"
            :style="$route.name == 'home' ? 'margin-top: 2em' : null"
            class="view-container"
          >
            <v-flex
              xs12
              :class="{
                sm9: !$route.name.includes('admin')
              }"
            >
              <transition name="fade" mode="out-in">
                <router-view></router-view>
              </transition>
            </v-flex>
            <v-flex
              xs12
              sm3
              class="side-preview"
              v-show="
                (!loading || $vuetify.breakpoint.smAndUp) &&
                  !$route.name.includes('admin')
              "
            >
              <side-display></side-display>
            </v-flex>
          </v-layout>
        </v-layout>
        <Footer v-show="!loading || $vuetify.breakpoint.smAndUp"></Footer>
        <v-btn
          fab
          :small="$vuetify.breakpoint.xs"
          color="accent"
          @click="scrollUp()"
          style="position: fixed;bottom:16px;right:16px;z-index:4"
        >
          <v-icon size="2rem">mdi-chevron-up</v-icon>
        </v-btn>
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
          <div class="accent lighten-1" style="position:relative">
            <v-icon
              style="position:absolute;right:8px;top:8px"
              color="white"
              @click="showSidebar = false"
              >mdi-close</v-icon
            >
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

          <div class="std font-weight-bold ml-4 my-2">Profile</div>

          <v-list dense>
            <v-list-item
              :to="profile + 'creations'"
              exact-active-class="grey lighten-4 accent--text font-weight-bold"
            >
              <v-list-item-icon>
                <v-icon class="nav-icon" size="1.5em">mdi-creation</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="font-weight-bold"
                >My Creations</v-list-item-title
              >
            </v-list-item>
            <v-list-item
              :to="profile + 'favorites'"
              class="ml-0"
              exact-active-class="grey lighten-4 accent--text font-weight-bold"
            >
              <v-list-item-icon>
                <v-icon class="nav-icon" size="1.5em">mdi-star</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="font-weight-bold"
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
                <v-icon class="nav-icon" size="1.5em">mdi-view-list</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="font-weight-bold"
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
              exact-active-class="grey lighten-4 accent--text font-weight-bold"
            >
              <v-list-item-icon>
                <v-icon class="nav-icon" size="1em">mdi-shield-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="font-weight-bold"
                >Admin</v-list-item-title
              >
            </v-list-item>
            <v-list-item
              to="/"
              class="nav-link"
              exact-active-class="grey lighten-4 accent--text font-weight-bold"
            >
              <v-list-item-icon>
                <v-icon class="nav-icon" size="1em">fa-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item>
            <v-list-item
              :to="'/lists'"
              class="ml-0 nav-link"
              exact
              exact-active-class="grey lighten-4 accent--text font-weight-bold"
            >
              <v-list-item-icon>
                <v-icon class="nav-icon" size="1.1em"
                  >$vuetify.icons.list</v-icon
                >
              </v-list-item-icon>
              <v-list-item-title>Lists</v-list-item-title>
            </v-list-item>
            <v-list-item
              :to="'/demands'"
              class="ml-0 nav-link"
              exact
              exact-active-class="grey lighten-4 accent--text font-weight-bold"
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
              exact-active-class="grey lighten-4 accent--text font-weight-bold"
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
              exact-active-class="grey lighten-4 accent--text font-weight-bold"
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
              exact-active-class="grey lighten-4 accent--text font-weight-bold"
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
                <v-icon class="nav-icon">mdi-logout</v-icon>
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
        <m-btn text :color="'white'" @click="hideSnackbar()">OK</m-btn>
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
import { setTimeout } from "timers";
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
    Signup
  },
  data() {
    return {
      closeSearch: false,
      showScroll: true,
      showSidebar: false,
      overlay: false
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
    }
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
    }
  },

  created: function() {
    this.$store.dispatch("initialize").then(() => {});
  }
};
</script>

<style>
:root {
  box-sizing: border-box;
  --primary: #f9f9fa;
  --dark-primary: #000000de;
  --dark-secondary: #0000198a;
  --dark-hint: #00001961;
  --dark-divider: #0000191f;
  --light-primary: #ffffff;
  --light-secondary: #ffffffb3;
  --light-hint: #ffffff80;
  --light-divider: #ffffff1f;
  --accent: rgb(255, 152, 0);
  --divider: #bdbdbd;
  /* --background: #f5f7f5; */
  --background: #ffffff;
  --link: #00a65a;
  --button: #0060ac;
  --brand: #388e3c;
  --sidebar: #515151;

  --border-radius: 0.3em;
  font-size: 0.85em !important;
}

h1,
h2,
h3,
h4,
p,
span,
.li {
  /* color: rgb(50, 72, 105); */
  line-height: calc(1em + 12px);
}

html {
  overflow-y: auto;
}

@media (min-width: 600px) {
  *::-webkit-scrollbar-track {
    /* box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
    /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
    background-color: rgb(235, 231, 231);
    /* display: none; */
    /* position: absolute; */
  }

  *::-webkit-scrollbar {
    width: 8px;
    position: absolute;
    /* background-color: #f5f5f5; */
  }

  *::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    /* background-color: white; */
    /* background-color: rgba(255,255,255,0.7); */
    border-radius: 8px;
  }
  *::-moz-scrollbar-track {
    /* box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
    /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); */
    background-color: white;
    /* display: none; */
    /* position: absolute; */
  }

  *::-moz-scrollbar {
    width: 8px;
    position: absolute;
    /* background-color: #f5f5f5; */
  }

  *::-moz-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    /* background-color: white; */
    /* background-color: rgba(255,255,255,0.7); */
    border-radius: 8px;
  }
}
.sub-note {
  font-size: 0.95em;
}
.spacious {
  line-height: 1.9em;
}
.pre-wrap {
  white-space: pre-wrap;
}
.italic {
  font-family: "Overlock", cursive;
  font-style: italic;
  font-size: 1.2em;
}
.title-text {
  font-size: 1em;
  font-weight: normal;
  color: #616161;
}
.page-title {
  margin: 0.5em 0em;
  padding: 0.2em 0.2em;
  /* background: white; */
  font-size: 2em;
  color: rgba(0, 0, 0, 0.87);
}
.oswald {
  font-family: "Oswald", sans-serif !important;
}

.icon {
  font-size: 2em;
}

.border {
  border: 1px solid var(--brand) !important;
}

@media (min-width: 25em) {
  :root {
    font-size: 0.9em !important;
  }
}
@media (min-width: 37.5em) {
  :root {
    font-size: 0.95em !important;
  }
}
@media (min-width: 56.25em) {
  :root {
    font-size: 1em !important;
  }
}
@media (min-width: 68.75em) {
  :root {
    font-size: 1em !important;
  }
}

*,
::before,
::after {
  box-sizing: inherit;
}
* > * {
  font-family: "Roboto", sans-serif;
  font-family: "Open Sans", sans-serif;
}
.roboto{
  font-family: "Roboto", sans-serif !important;
}
#body {
  background: var(--background);
  height: auto;
  font-family: "Overlock", cursive;
}
.roboto {
  font-family: "Roboto", sans-serif;
  font-size: 0.9em;
}
.tile:hover {
  /* color: var(--accent) !important; */
}
.tile:hover > * {
  /* color: var(--accent) !important; */
  /* font-weight: bold; */
}
.tile:hover > * > * {
  /* color: var(--accent) !important; */
  /* font-weight: bold; */
}
/* .tile:active{
  background-color: #E2FFDA;
  color: var(--brand) !important;
}
.tile:active>*{
  color: var(--brand) !important;
  font-weight: bold
}
.tile:active>*>*{
  color: var(--brand) !important;
  font-weight: bold
} */
.view-container {
  padding: 0 0.5em;
  margin-top: 5.5em;
  margin-bottom: 5em;
  width: 100%;
  max-width: 1200px !important;
}
.mt {
  margin-top: 1em !important;
}
.mb {
  margin-bottom: 0.5em !important;
}
.ml {
  margin-left: 0.5em !important;
}
.mr {
  margin-right: 0.5em !important;
}
.pr {
  padding-right: 0.5em !important;
}
.pl {
  padding-left: 0.5em !important;
}
.pt {
  padding-top: 0.5em !important;
}
.pb {
  padding-bottom: 0.5em !important;
}
@media (min-width: 960px) {
  .view-container {
    margin-top: 7.5em;
  }
}
@media (min-width: 800px) {
  .view-container {
    padding: 0 1em;
  }
  .mt {
    margin-top: 2em !important;
  }
  .mb {
    margin-bottom: 1em !important;
  }
  .ml {
    margin-left: 1em !important;
  }
  .mr {
    margin-right: 1em !important;
  }
  .pr {
    padding-right: 1em !important;
  }
  .pl {
    padding-left: 1em !important;
  }
  .pt {
    padding-top: 1em !important;
  }
  .pb {
    padding-bottom: 1em !important;
  }
}
@media (min-width: 1200px) {
  .view-container {
    padding: 0;
  }
  .mt {
    margin-top: 2em !important;
  }
  .mb {
    margin-bottom: 1em !important;
  }
  .ml {
    margin-left: 1em !important;
  }
  .mr {
    margin-right: 1em !important;
  }
  .pr {
    padding-right: 1em !important;
  }
  .pl {
    padding-left: 1em !important;
  }
  .pt {
    padding-top: 1em !important;
  }
  .pb {
    padding-bottom: 1em !important;
  }
}
#preview {
  width: 100%;
  margin-top: 4.5em;
}

.ptd {
  color: rgba(0, 0, 0, 0.87) !important;
}
.ptn {
  color: rgb(50, 72, 105) !important;
}
.std {
  color: rgba(0, 0, 0, 0.54) !important;
}
.htd {
  color: rgba(0, 0, 0, 0.38) !important;
}
.dd {
  color: rgba(0, 0, 0, 0.12) !important;
}

.ptl {
  color: rgba(255, 255, 255, 1) !important;
}
.stl {
  color: rgba(255, 255, 255, 0.7) !important;
}
.htl {
  color: rgba(255, 255, 255, 0.5) !important;
}
.dl {
  color: rgba(255, 255, 255, 0.12) !important;
}
.primary-dark-bg {
  background-color: rgba(0, 0, 0, 0.87) !important;
}
.secondary-dark-bg {
  background-color: rgba(0, 0, 25, 0.54) !important;
}
.hint-dark-bg {
  background-color: rgba(0, 0, 25, 0.38) !important;
}
.divider-dark-bg {
  background-color: rgba(0, 0, 25, 0.12) !important;
}

.primary-light-bg {
  background-color: rgba(255, 255, 255, 1) !important;
}
.secondary-light-bg {
  background: rgba(255, 255, 255, 0.7) !important;
}
.hint-light-bg {
  background-color: rgba(255, 255, 255, 0.5) !important;
}
.divider-light-bg {
  background-color: rgba(255, 255, 255, 0.12) !important;
}

.br {
  border-radius: 4px;
}
.no-deco {
  text-decoration: none;
}
.brighten:hover {
  filter: brightness(150%);
}
.brighten-1:hover {
  filter: brightness(125%);
}
.top-bar {
  /* background: linear-gradient(180deg, #1E88E5, #2196F3); */
  /* background: rgba(224, 224, 230,.7); */
  /* background: rgb(244, 244, 244); */
  background: #eeeeee;
  /* background: rgb(132, 180, 255); */
  color: #454545;
  font-weight: normal;
}

.form-bg {
  background-color: rgb(238, 238, 238);
}

.golden {
  background: radial-gradient(
    1.5em at 25% 25%,
    rgb(235, 206, 133),
    goldenrod
  ) !important;
}
.golden > span {
  color: rgb(238, 238, 238) !important;
}
.golden-text {
  color: goldenrod !important;
}

.silver {
  background: radial-gradient(
    1.5em at 25% 25%,
    rgb(230, 228, 228),
    silver
  ) !important;
}
.silver-text {
  color: silver !important;
}
.silver > span {
  color: rgb(238, 238, 238) !important;
}
.bronze {
  background: radial-gradient(
    1.5em at 25% 25%,
    rgb(235, 139, 71),
    chocolate
  ) !important;
}
.bronze > span {
  color: rgb(238, 238, 238) !important;
}
.bronze-text {
  color: chocolate !important;
}

.plain {
  /* background: radial-gradient(1.5em at 25% 25%, #707070, #515151) !important; */
  background: rgb(158, 158, 158) !important;
}

.numeric-box {
  /* background-color: hsl(0, 90%, 72%); */
  background: rgba(0, 0, 0, 0.5);
  min-width: 2.7em;
  min-height: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  border-radius: 0.3em;
  padding: 0.2em 0.3em;
}
.numeric-box > span {
  font-size: 1.5em;
  font-weight: bold;
  color: var(--primary);
}

.close:hover {
  color: rgb(187, 54, 54) !important;
}

.action-icon:hover {
  transform: scale(1.15);
}
.action-icon:active {
  transform: scale(0.95);
}

.alert-button {
  color: var(--primary);
  padding: 0.6em 0;
  width: 60%;
  margin-top: 1em;
  border-radius: 0.2em;
  box-shadow: 0px 2px 2px black;
}

.alert-button:hover {
  filter: brightness(110%);
}

.alert-font {
  font-family: "Roboto", sans-serif;
  font-weight: bold;
  font-size: 1em;
}

.side-comment {
  font-family: "Open Sans Condensed", sans-serif;
  font-size: 1.2em;
}

.fa-icon {
  font-size: 1.2em;
}

.links {
  color: var(--link);
  text-decoration: none;
}
.links:hover {
  text-decoration: underline;
}
.underline:hover {
  text-decoration: underline;
}
.pointer {
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.2s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.mt-one {
  margin-top: 1em !important;
}
.mt-half {
  margin-top: 0.5em !important;
}
.mb-one {
  margin-bottom: 1em !important;
}
.mb-half {
  margin-bottom: 0.5em !important;
}
.pl-one {
  padding-left: 1em !important;
}
.pl-half {
  padding-left: 0.5em !important;
}
.pr-one {
  padding-right: 1em !important;
}
.pr-half {
  padding-right: 0.5em !important;
}
.block {
  display: block;
}
</style>
