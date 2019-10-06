<template>
<v-hover v-slot:default="{ hover }">
  <v-card @click="goNotification()" tile flat width="100%" :color="hover ? '#f5f5f5' : null" class="pa-2">
    <v-card-text>
      <v-layout>
        <v-flex>
          <div class="primary-text-dark" v-html="message"></div>
        </v-flex>
        <v-flex shrink>
          <v-layout style="width:30px" class="primary-text-dark" justify-end>{{created}}</v-layout>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
  </v-hover>
</template>

<script>
const moment = require("moment");
import convertMoment from "../../public/my-modules/convertMoment";
export default {
  props: {
    notification: Object
  },
  data() {
    return {};
  },
  methods: {
    goNotification() {
      switch (this.notification.type) {
        case "reply":
          this.$router.push({
            path: "/lists/" + this.notification.list.id,
            query: {
              notification: true,
              item_id: this.notification.item.id
            }
          });
          break;

        case "follow":
          this.$router.push({
            path: "/" + this.notification.user.id + "/profile"
          });
          break;

        case "demand-created":
          this.$router.push({
            path: "/lists/" + this.notification.list.id
          });
          break;
      }
    }
  },
  computed: {
    created() {
      return convertMoment.getShortTime(this.notification.created);
    },
    message() {
      switch (this.notification.type) {
        case "reply":
          if (this.notification.commenter.id === this.user.id) {
            return (
              `${this.notification.user.username}`.bold() +
              " replied to your comment on " +
              this._.startCase(`${this.notification.item.name}`).bold() +
              " on " +
              this._.startCase(`${this.notification.list.title}`).bold()
            );
          } else {
            return (
              `${this.notification.user.username}`.bold() +
              " also replied to " +
              `${this.notification.commenter.username}`.bold() +
              "'s comment on " +
              this._.startCase(`${this.notification.item.name}`).bold() +
              " on " +
              this._.startCase(`${this.notification.list.title}`).bold()
            );
          }
          break;
        case "demand-created":
          return (
            "A list you were waiting for, " +
            this._.startCase(`${this.notification.list.title}`).bold() +
            " has been created by " +
            this._.startCase(`${this.notification.user.username}`).bold()
          );
          break;

        case "follow":
          return (
            this._.startCase(`${this.notification.user.username}`).bold() + " started following you"
          )
      }
    },
    user() {
      return this.$store.getters.getUser;
    }
  },
  created() {}
};
</script>

<style scoped>
</style>