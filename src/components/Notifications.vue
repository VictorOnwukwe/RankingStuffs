<template>
  <div id="main">
    <v-layout>
      <v-card
        class="elevation-4"
        tile
        height="calc(100vh - 3.5em)"
        style="overflow-y:scroll"
        width="100%"
      >
        <v-card-title
          class="top-bar"
          style="position:sticky;z-index:2;top:0;background:#F4F4F4;border-bottom:1px solid grey; font-size:1em"
        >
          Notifications
          <v-spacer></v-spacer>
          <v-icon class="close" ref="close" @click="close()">mdi-close</v-icon>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-layout v-if="loading" class="my-4" justify-center>
            <v-progress-circular indeterminate color="brand"></v-progress-circular>
          </v-layout>
          <v-list v-else-if="notifications && notifications.length > 0">
            <Notification
              v-for="(notification, index) in notifications"
              :key="index"
              :notification="notification"
              :recent="(index + 1) <= notifLength"
              @close="close()"
            ></Notification>
          </v-list>
          <p v-else class="subtitle-1 mt-4 secondary-text-dark text-center">No Notifications...</p>
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
  data() {
    return {
      notifications: [],
      loading: false,
      notifLength: 0
    };
  },
  methods: {
    async fetchNotifications() {
      this.notifLength = this.$store.getters.notifications;
      this.loading = true;
      this.$store
        .dispatch("fetch_notifications")
        .then(notifications => {
          this.notifications = notifications;
          this.loading = false;
          this.$store.dispatch("reset_notifications");
        })
        .catch(error => {
          this.loading = false;
          console.log("No network");
        });
    },
    close() {
      this.$emit("close");
    }
  },
  created() {
    this.fetchNotifications().then(() => {
      // this.$store.dispatch("update_notification_last_seen");
    });
  }
};
</script>

<style scoped>
</style>