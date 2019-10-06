<template>
  <div id="main">
      <v-layout>
        <v-card class="elevation-4" tile height="calc(100vh - 3.5em)" width="100%">
          <v-card-title class="top-bar">Notifications</v-card-title>
          <v-card-text class="pa-0">
              <Notification v-for="(notification, index) in notifications" :key="index" :notification="notification"></Notification>
          </v-card-text>
        </v-card>
      </v-layout>
  </div>
</template>

<script>
import Notification from "./Notification";
export default {
  components: {
    Notification
  },
  data(){
    return {
      notifications: []
    }
  },
  methods: {
    async fetchNotifications(){
      this.$store.dispatch("fetch_notifications").then(notifications => {
        this.notifications = notifications;
      })
    }
  },
  created(){
    this.fetchNotifications().then(() => {
      // this.$store.dispatch("update_notification_last_seen");
    })
  }
};
</script>

<style scoped>
</style>