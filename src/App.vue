<template>
  <div id="main">
    <v-app id="body">
      <toolbar :closeSearch="closeSearch"></toolbar>

      <div @click="setClose()">
        <preview v-if="$route.name == 'home'" id="preview"></preview>
        <v-layout justify-center>
          <v-layout
            :column="$vuetify.breakpoint.xs ? true : false"
            :style="$route.name == 'home' ? 'margin-top: 2em' : null"
            class="view-container"
          >
            <v-flex xs12 :class="{'sm9': !$route.name.includes('admin')}">
              <transition name="fade" mode="out-in">
                <router-view></router-view>
              </transition>
            </v-flex>
            <v-flex
              xs12
              sm3
              class="side-preview"
              v-if="
                (!loading || $vuetify.breakpoint.smAndUp) &&
                  !$route.name.includes('admin')
              "
            >
              <side-display></side-display>
            </v-flex>
          </v-layout>
        </v-layout>
        <Footer v-show="!loading || $vuetify.breakpoint.smAndUp"></Footer>
        <v-btn v-if="offset < 0" fab color="accent" @click="scrollUp()" style="position: fixed;bottom:16px;right:16px">
          <v-icon size="2rem">mdi-chevron-up</v-icon>
        </v-btn>
      </div>
    </v-app>
  </div>
</template>

<script>
import Home from "./components/Home";
import User from "./components/User";
import Toolbar from "./components/Toolbar";
import Footer from "./components/Footer";
import { setTimeout } from "timers";
import HomePreview from "./components/HomePreview";
import SideDisplay from "./components/SideDisplay";

export default {
  name: "App",
  components: {
    User,
    Home,
    Toolbar,
    Footer,
    preview: HomePreview,
    SideDisplay
  },
  data() {
    return {
      closeSearch: false,
      showScroll: true,
      offset: 0
    };
  },

  methods: {
    setClose() {
      this.closeSearch = true;
      setTimeout(() => {
        this.closeSearch = false;
      }, 500);
    },
    scrollUp(){
      console.log(this.offset);
      window.scrollTo(0,0);
    }
  },

  computed: {
    loading() {
      return this.$store.getters.getLoading;
    },
    // offset(){
    //   return document.querySelector("body").getBoundingClientRect().top * -1;
    // }
  },

  created: function() {
    this.$store.dispatch("initialize").then(() => {
      this.$store.dispatch("fetchCategories");
      // this.$store.dispatch("clear_state");
      this.$store.dispatch("watch_notifications");
    });

    window.addEventListener("scroll", function(event){
      this.offset = document.querySelector("body").getBoundingClientRect().top;
      // console.log(this.offset);
      // if(document.querySelector("body").getBoundingClientRect().top < -600){
      //   console.log("here");
      //   this.showScroll = true;
      // }else{
      //   console.log("else");
      //   this.showScroll = false;
      // }
    })
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
  --accent: #FF9800;
  --divider: #bdbdbd;
  /* --background: #f5f7f5; */
  --background: #ffffff;
  --link: #000000de;
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
  scroll-behavior: smooth;
  overflow-y: auto;
}

*::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: white;
  display: none;
  position: absolute;
}

*::-webkit-scrollbar {
  width: 5px;
  position: absolute;
  /* background-color: #f5f5f5; */
}

*::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.5);
  /* background-color: white; */
  /* background-color: rgba(255,255,255,0.7); */
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
  font-family: Georgia, "Times New Roman", Times, serif;
  font-family: "Overlock", cursive;
  font-family: "Roboto", sans-serif;
  /* transition: all 0.15s ease-in; */
}
#body {
  /* background: radial-gradient(#f1f5f8 80%, white); */
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
  margin-top: 7.5em;
  margin-bottom: 1em;
  width: 100%;
  max-width: 1200px !important;
}
.mt {
  margin-top: 0.5em !important;
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
@media (min-width: 600px) {
  .view-container {
    margin-top: 7.5em;
  }
}
@media (min-width: 800px) {
  .view-container {
    padding: 0 1em;
  }
  .mt {
    margin-top: 1em !important;
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
    margin-top: 1em !important;
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

.silver {
  background: radial-gradient(
    1.5em at 25% 25%,
    rgb(230, 228, 228),
    silver
  ) !important;
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

.plain {
  /* background: radial-gradient(1.5em at 25% 25%, #707070, #515151) !important; */
  background: rgb(158, 158, 158) !important;
}

.numeric-box {
  /* background-color: hsl(0, 90%, 72%); */
  background: rgba(0,0,0,0.5);
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
.circle {
  border-radius: 50%;
}

.close:hover {
  color: rgb(187, 54, 54);
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
  transition-duration: 0.3s;
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
.block{
  display: block;
}
</style>
