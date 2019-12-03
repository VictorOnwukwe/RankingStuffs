<template>
  <div id="main">
    <v-layout>
      <v-card
        class="elevation-4"
        tile
        :height="$vuetify.breakpoint.xs ? '100vh' : 'calc(100vh - 3.5em)'"
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
            <m-progress></m-progress>
          </v-layout>
          <v-list v-else-if="notifications && notifications.length > 0">
            <div v-for="(notification, index) in notifications" :key="index">
              <Notification
                :notification="{ id: notification.id, ...notification.data() }"
                :recent="index + 1 <= notifLength"
                @close="close()"
                :index="index"
              ></Notification>
                <v-divider class="grey lighten-3 mr-2" style="margin-left:70px" v-if="index < notifications.length - 1" :key="index"></v-divider>
            </div>
          </v-list>
          <p v-else class="subtitle-1 mt-4 std text-center">
            No Notifications...
          </p>
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
          if (this.$store.state.notifications !== 0) {
            this.$store.dispatch("reset_notifications");
          }
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

<style scoped></style>
