<template>
    <v-list-item :class="recent ? 'blue lighten-4' : null" color="brand" v-if="notifier" @click="goNotification()">
      <v-list-item-avatar>
        <v-img v-if="notifier.profile_pic" :src="notifier.profile_pic.low"></v-img>
      </v-list-item-avatar>
      <v-list-item-content>
        <div style="line-height:1.5 !important;font-size:1.05em" v-html="message"></div>
      </v-list-item-content>
      <v-list-item-action>
        <v-list-item-action-text>{{created}}</v-list-item-action-text>
      </v-list-item-action>
    </v-list-item>
</template>

<script>
const moment = require("moment");
import convertMoment from "../../public/my-modules/convertMoment";
export default {
  props: {
    notification: Object,
    recent: Boolean
  },
  data() {
    return {
      notifier: null,
    };
  },
  methods: {
    goNotification() {
      this.$emit("close");
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
            this._.startCase(`${this.notification.user.username}`).bold() +
            " started following you"
          );
      }
    },
    user() {
      return this.$store.getters.getUser;
    }
  },
  mounted() {
    this.$store
      .dispatch("fetch_user", this.notification.user.id)
      .then(result => {
        this.notifier = result;
      });
  }
};
</script>

<style scoped>
</style>