<template>
  <div id="main">
      <v-layout>
        <v-flex xs12 lg10 offset-lg-1>
          <v-card tile flat>
              <Notification></Notification>
              <Notification></Notification>
              <Notification></Notification>
              <Notification></Notification>
          </v-card>
        </v-flex>
      </v-layout>
  </div>
</template>

<script>
import Notification from "./Notification";
export default {
  components: {
    Notification
  }
};
</script>

<style scoped>
#main {
  width: 100%;
}
</style>