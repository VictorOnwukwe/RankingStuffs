<template>
  <div id="main">
    <div id="container">
      <div v-if="authenticated">
        <Timeline></Timeline>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "./Sidebar";
import Timeline from "./Timeline";
export default {
  components: {
    Sidebar,
    Timeline
  },
  data() {
    return {};
  },

  methods: {},

  computed: {
    authenticated(){
      return this.$store.getters.getAuthenticated;
    }
  }
};
</script>

<style scoped>
#main {
}
#container {
}
#home-container {
  flex-grow: 1;
}
</style>

