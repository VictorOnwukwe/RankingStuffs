<template>
  <div id="main">
      <v-layout>
        <v-flex xs12 lg10 offset-lg-1>
          <v-card tile flat>
              <Notification v-for="(notification, index) in notifications" :key="index" :notification="notification"></Notification>
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
        console.log(notifications);
      })
    }
  },
  created(){
    this.fetchNotifications().then(() => {
      this.$store.dispatch("update_notification_last_seen");
    })
  }
};
</script>

<style scoped>
#main {
  width: 100%;
}
</style>