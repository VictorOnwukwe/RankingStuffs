<template>
  <v-app>
    <v-toolbar>
      <toolbar></toolbar>
    </v-toolbar>

    <v-content>
      <home></home>
    </v-content>
  </v-app>
</template>

<script>
import Home from './components/Home';
import Toolbar from './components/Toolbar';

export default {
  name: 'App',
  components: {
    Home,
    Toolbar
  },
  data () {
    return {
      //
    }
  }
}
</script>
