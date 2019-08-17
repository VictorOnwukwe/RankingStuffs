<template>
  <div id="main">
    <v-app id="body">
      <User></User>
      <toolbar></toolbar>
      <div id="view-container">
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
      sidebar: null
    };
  },

  computed: {
    showSidebar(){
      return this.$store.getters.getSidebar;
    }
  },

  mounted: function() {
    
  }
};
</script>

<style>
:root {
  box-sizing: border-box;
  --primary: #f9f9fa;
  --text-secondary: #757575;
  --dark-text: #21242f;
  --accent: #082f63;
  --divider: #bdbdbd;
  --background-color: #f4f4f4;
  --link: #0060ac;
  --button: #0060ac;
  --brand: #c8c803;

  --border-radius: 0.3em;
  font-size: 0.75em !important;
}

h1,
h2,
h3,
p,
span {
  color: var(--dark-text);
}

html {
  scroll-behavior: smooth;
}

@media (min-width: 30em) {
  :root {
    font-size: 0.9em !important;
  }
}

*,
::before,
::after {
  box-sizing: inherit;
}

#body {
  background-color: var(--background-color);
  height: auto;
}
#view-container{
  padding: 1em;
}

@media (min-width: 30em) {
  #view-container {
    padding: 1em 1em;
    display: flex;
  }
}

#router-view{
  flex-grow: 1;
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

#sidebar{
  display: none;
  margin-left: 0.5em;
  margin-right: 0.5em;
}

@media (min-width: 42.5em){
  #sidebar{
    display: block;
  }
}
</style>

