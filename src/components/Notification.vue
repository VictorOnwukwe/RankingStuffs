<template>
  <v-list-item :class="{ 'blue lighten-4': recent }" @click="goNotification()">
    <v-list-item-avatar>
      <dp v-if="notifier" :size="'2.5em'" :src="notifier.profile_pic"></dp>
    </v-list-item-avatar>
    <v-list-item-content>
      <!-- <div style="line-height:1.5 !important;font-size:1.05em" v-html="message"></div> -->
      <div
        v-if="
          notification.type == 'reply' && notification.commenter.id === user.id
        "
      >
        <span v-if="notification.user" class>{{
          notification.user.username
        }}</span>
        replied to your comment on
        <span class="font-weight-medium text-capitalize">{{
          notification.item.name
        }}</span>
        on
        <span class="font-weight-medium link--text text-capitalize">{{
          notification.list.title
        }}</span>
      </div>
      <div
        v-else-if="
          notification.type == 'reply' && notification.commenter.id !== user.id
        "
      >
        <span v-if="notification.user" class>{{
          notification.user.username
        }}</span>
        also replied to
        <span>{{ notification.commenter.username }}</span
        >'s comment on
        <span class="font-weight-medium text-capitalize">{{
          this.notification.item.name
        }}</span>
        on the list of
        <span class="font-weight-medium link--text text-capitalize">{{
          notification.list.title
        }}</span>
      </div>
      <div v-if="notification.type == 'demand-created'">
        A list you were waiting for,
        <span class="text-capitalize link--text font-weight-medium">{{
          notification.list.title
        }}</span>
        has been created by
        <span v-if="notification.user" class="font-weight-medium">{{
          notification.user.username
        }}</span>
      </div>
      <div v-if="notification.type == 'follow'">
        <span class="font-weight-medium">{{ notification.user.username }}</span>
        started following you
      </div>
      <div v-if="notification.type == 'list-approved'">
        Your submitted list
        <span class="link--text font-weight-medium text-capitalize"
          >{{ notification.list.title }}&nbsp;</span
        >
        has been approved
      </div>
      <div v-if="notification.type == 'demand-approved'">
        Your demanded list
        <span class="link--text font-weight-medium text-capitalize"
          >{{ notification.demand.title }}&nbsp;</span
        >
        has been approved
      </div>
    </v-list-item-content>
    <v-list-item-action>
      <v-list-item-action-text>{{ created }}</v-list-item-action-text>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import convertMoment from "../../public/my-modules/convertMoment";
export default {
  props: {
    notification: Object,
    recent: Boolean,
    index: Number
  },
  data() {
    return {
      notifier: false
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
              item: this.notification.item.id
            }
          });
          break;

        case "follow":
          this.$router.push({
            path: "/users/" + this.notification.user.id
          });
          break;

        case "demand-created":
          this.$router.push({
            path: "/lists/" + this.notification.list.id
          });
          break;
        case "list-approved":
          this.$router.push({
            path: "/lists/" + this.notification.list.id
          });
          break;
        case "demand-approved":
          this.$router.push({
            path: "/demands/" + this.notification.demand.id
          });
          break;
      }
    }
  },
  computed: {
    created() {
      return convertMoment.getShortTime(this.notification.created);
    },
    user() {
      return this.$store.getters.getUser;
    }
  },
  created() {
    if (this.notification.user) {
      this.$store
        .dispatch("fetch_user", this.notification.user.id)
        .then(result => {
          this.notifier = result;
        });
    }
  }
};
</script>

<style scoped></style>
