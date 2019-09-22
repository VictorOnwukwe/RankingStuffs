<template>
  <div id="main">
    <v-app id="body">
      <!-- <User></User> -->
      <toolbar :closeSearch="closeSearch"></toolbar>
      <div @click="setClose()" id="view-container">
        <Sidebar v-if="['home', 'list-display'].indexOf($route.name) < 0"></Sidebar>
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
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { setTimeout } from 'timers';

export default {
  name: "App",
  components: {
    User,
    Home,
    Toolbar,
    Sidebar,
    Footer
  },
  data() {
    return {
      closeSearch: false
    };
  },

  methods: {
    setClose(){
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
  --brand: #176EC9;
  --sidebar: #515151;

  --border-radius: 0.3em;
  font-size: 0.9em !important;
}

h1,
h2,
h3,
p{
  color: var(--dark-primary);
}

span{
  color: var(--dark-secondary)
}

html {
  scroll-behavior: smooth;
}

.page-title{
  margin: 0.5em 0em;
  padding:0.2em 0.5em;
  background: white;
  font-size:2em;
  color: var(--brand);
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
@media (min-width: 68.75em){
  :root{
    font-size: 1.05em !important;
  }
}

*,
::before,
::after {
  box-sizing: inherit;
}

#body {
  /* background: radial-gradient(#f1f5f8 80%, white); */
  background:white;
  height: auto;
  font-family: "Roboto", sans-serif;
}
#view-container{
  padding: 0 0.25em;
  display: flex;
  margin-top: 3.125em;
}

@media (min-width:50em) {
  #view-container{
    padding: 0 0.5em;
  }
}

.primary-text-dark{
  color: rgba(0,0,0,.87) !important;
}
.secondary-text-dark{
  color: rgba(0, 0, 25, 0.54) !important;
}
.hint-text-dark{
  color: rgba(0,0,25,.38) !important;
}
.divider-dark{
  color: rgba(0,0,25,.12) !important;
}

.primary-text-light{
  color: rgba(255,255,255,1) !important;
}
.secondary-text-light{
  color: rgba(255,255,255,.7) !important;
}
.hint-text-light{
  color: rgba(255,255,255,.5) !important;
}
.divider-light{
  color: rgba(255,255,255,.12) !important;
}
.primary-dark-bg{
  background-color: rgba(0,0,0,.87) !important;
}
.secondary-dark-bg{
  background-color: rgba(0, 0, 25, 0.54) !important;
}
.hint-dark-bg{
  background-color: rgba(0,0,25,.38) !important;
}
.divider-dark-bg{
  background-color: rgba(0,0,25,.12) !important;
}

.primary-light-bg{
  background-color: rgba(255,255,255,1) !important;
}
.secondary-light-bg{
  background: rgba(255,255,255,.7) !important;
}
.hint-light-bg{
  background-color: rgba(255,255,255,.5) !important;
}
.divider-light-bg{
  background-color: rgba(255,255,255,.12) !important;
}

.br{
  border-radius: 0.3em;
}

.top-bar{
  /* background: linear-gradient(180deg, #1E88E5, #2196F3); */
  /* background: rgba(224, 224, 230,.7); */
  background: #F4F4F4;
  color: rgba(0,0,0,.87);
  font-weight: bold
}

.golden{
  background: radial-gradient(1.5em at 25% 25%, rgb(235, 206, 133), goldenrod) !important;

}
.golden>span{
  color: rgb(238, 238, 238) !important;
  color: rgb(46, 46, 46) !important;
}

.silver{
  background: radial-gradient(1.5em at 25% 25%, rgb(230, 228, 228), silver) !important;
}
.silver>span{
  color: rgb(192, 92, 20) !important;
  color: rgb(46, 46, 46) !important;
}
.bronze{
  background: radial-gradient(1.5em at 25% 25%, rgb(235, 139, 71), chocolate) !important;
}
.bronze>span{
  color: rgb(46, 46, 46) !important;
}

.plain{
  background: radial-gradient(1.5em at 25% 25%, #707070, #515151) !important;
}

.numeric-box{
  /* background-color: hsl(0, 90%, 72%); */
  background: linear-gradient(180deg, #1565c0, #1976d2);
  min-width: 2.5em;
  min-height: 2.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  border-radius: 0.3em;
  padding:0.2em 0.3em;
}
.numeric-box>span{
  font-size: 1.5em;
  font-weight: bold;
  color: var(--primary);
}
.circle{
  border-radius: 50%;
}

#router-view{
  flex-grow: 1;
}

.action-icon:hover{
  transform: scale(1.15);
}
.action-icon:active{
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

.links {
  color: var(--link);
  text-decoration: none;
}
.links:hover {
  text-decoration: underline;
}
.minus-one{
  margin-top: -1em;
}
.minus-one-five{
  margin-top: -1.5em;
}
.minus-two{
  margin-top: -2em;
}
.minus-two-five{
  margin-top: -2.5em;
}
.minus-three{
  margin-top: -3em;
}

.like-button {
  transition: all 0.05s linear;
}

.like-button:hover {
  transform: scale(1.1);
}

.like-button:active {
  transform: scale(0.9);
}

.reply-button {
  transition: all 0.05s linear;
}
.reply-button:hover {
  transform: scale(1.1);
}

.reply-button:active {
  transform: scale(0.9);
}
.underline:hover{
  text-decoration: underline;
}
.pointer{
    cursor: pointer;
}
</style>

