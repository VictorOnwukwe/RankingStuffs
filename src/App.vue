<template>
  <v-app id="body">
    <toolbar></toolbar>
    <router-view></router-view>
  </v-app>
</template>

<script>
import Home from "./components/Home";
import Toolbar from "./components/Toolbar";

export default {
  name: "App",
  components: {
    Home,
    Toolbar
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
  --primary: #eae5e5;
  --primary-dark: #0288D1;
  --primary-light: #F5F5F5;
  --text: #ffffff;
  --text-secondary: #757575;
  --text-primary: #212121;
  --accent: #1d74a0;
  --divider: #bdbdbd;
  --background-color: #f4f4f4
}

*,
::before,
::after {
  box-sizing: inherit;
}

#body{
  background-color: var(--background-color);
}
</style>

