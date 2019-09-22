<template>
  <div id="main">
      <v-layout>
        <div style="max-height:400px; overflow-y:scroll">
          <v-card v-for="(notification, index) in notifications" :key="index" tile flat>
              <Notification :notification="notification"></Notification>
              <v-divider class="grey "></v-divider>
          </v-card>
        </div>
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
#main {
  width: 100%;
  max-height: 350px;
}
</style>