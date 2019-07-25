<template>
  <div id="main">
  <v-app id="body">
    <toolbar></toolbar>
    <div id="router-view">
      <router-view></router-view>
    </div>
  </v-app>
  </div>
</template>

<script>
import Home from "./components/Home";
import Toolbar from "./components/Toolbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

export default {
  name: "App",
  components: {
    Home,
    Toolbar,
    Sidebar,
    Footer
  },
  data() {
    return {
      //
    };
  }
};
</script>

<style>
:root {
  box-sizing: border-box;
  --primary: #F9F9FA;
  --text-secondary: #757575;
  --dark-text: #21242f;
  --accent: #a70932;
  --divider: #bdbdbd;
  --background-color: #f4f4f4;
  --link: #0060ac;
  --button: #0060ac;

  --border-radius: 0.3em;
  font-size: 0.75em !important;
}

@media (min-width: 30em) {
  :root {
    font-size: 1em !important;
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

#router-view {
  padding: 1em 2em;
}
</style>

