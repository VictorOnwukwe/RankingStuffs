<template>
  <div id="main">
    <v-app id="body">
      <toolbar :closeSearch="closeSearch"></toolbar>
      <div @click="setClose()" id="view-container">
        <router-view id="router-view"></router-view>
      </div>
      <!-- <Footer></Footer> -->
    </v-app>
  </div>
</template>

<script>
import Home from "./components/Home";
import User from "./components/User";
import Toolbar from "./components/Toolbar";
import Footer from "./components/Footer";
import { setTimeout } from "timers";

export default {
  name: "App",
  components: {
    User,
    Home,
    Toolbar,
    Footer
  },
  data() {
    return {
      closeSearch: false
    };
  },

  methods: {
    setClose() {
      this.closeSearch = true;
      setTimeout(() => {
        this.closeSearch = false;
      }, 500);
    }
  },

  mounted: function() {
    this.$store.dispatch("clear_state");
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
  --accent: #f1295b;
  --divider: #bdbdbd;
  --background-color: #f4f4f4;
  --link: #0060ac;
  --button: #0060ac;
  --brand: #1867c0;
  --sidebar: #515151;

  --border-radius: 0.3em;
  font-size: 0.9em !important;
}

h1,
h2,
h3,
h4,
p {
  color: var(--dark-primary);
  line-height: 1.5;
}

span {
  color: var(--dark-secondary);
}

html {
  scroll-behavior: smooth;
  overflow-y: auto;
}

*::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #f5f5f5;
  border-radius: 10px;
}

*::-webkit-scrollbar {
  width: 6px;
  background-color: #f5f5f5;
}

*::-webkit-scrollbar-thumb {
  background-color: rgb(179, 178, 178);
  border-radius: 10px;
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
    font-size: 1.05em !important;
  }
}

*,
::before,
::after {
  box-sizing: inherit;
}
* > * {
  font-family: "Roboto", sans-serif;
}
#body {
  /* background: radial-gradient(#f1f5f8 80%, white); */
  background: #fafafa;
  height: auto;
  font-family: "Roboto", sans-serif;
}
#view-container {
  padding: 0 0.25em;
  display: flex;
  margin-top: 3.5em;
}

@media (min-width: 50em) {
  #view-container {
    padding: 0 0.5em;
  }
}

.primary-text-dark {
  color: rgba(0, 0, 0, 0.87) !important;
}
.secondary-text-dark {
  color: rgba(0, 0, 25, 0.54) !important;
}
.hint-text-dark {
  color: rgba(0, 0, 25, 0.38) !important;
}
.divider-dark {
  color: rgba(0, 0, 25, 0.12) !important;
}

.primary-text-light {
  color: rgba(255, 255, 255, 1) !important;
}
.secondary-text-light {
  color: rgba(255, 255, 255, 0.7) !important;
}
.hint-text-light {
  color: rgba(255, 255, 255, 0.5) !important;
}
.divider-light {
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
  border-radius: 0.3em;
}

.top-bar {
  /* background: linear-gradient(180deg, #1E88E5, #2196F3); */
  /* background: rgba(224, 224, 230,.7); */
  background: #eeeeee;
  color: #454545;
  font-weight: normal;
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
  color: rgb(46, 46, 46) !important;
}

.silver {
  background: radial-gradient(
    1.5em at 25% 25%,
    rgb(230, 228, 228),
    silver
  ) !important;
}
.silver > span {
  color: rgb(192, 92, 20) !important;
  color: rgb(46, 46, 46) !important;
}
.bronze {
  background: radial-gradient(
    1.5em at 25% 25%,
    rgb(235, 139, 71),
    chocolate
  ) !important;
}
.bronze > span {
  color: rgb(46, 46, 46) !important;
}

.plain {
  background: radial-gradient(1.5em at 25% 25%, #707070, #515151) !important;
}

.numeric-box {
  /* background-color: hsl(0, 90%, 72%); */
  background: linear-gradient(180deg, #1565c0, #1976d2);
  min-width: 2.3em;
  min-height: 2em;
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
  color: red;
}

#router-view {
  flex-grow: 1;
}
@media (min-width: 600px) {
  #router-view {
    margin-left: 80px;
  }
}
@media (min-width: 1264px) {
  #router-view {
    margin-left: 256px;
  }
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
</style>

