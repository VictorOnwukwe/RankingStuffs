<template>
  <router-link class="no-deco" :to="link">
    <v-list-item link :class="{ recent: recent }" @click="$emit('close')">
      <v-list-item-avatar tile>
        <dp
          v-if="notification.user"
          :size="$vuetify.breakpoint.xs ? '2.4em' : '2.6em'"
          :radius="'50%'"
          :src="notifier.profile_pic"
        ></dp>
        <m-img
          v-else-if="notification.displayImage"
          :width="$vuetify.breakpoint.xs ? '2.5em' : '2.6em'"
          :src="notification.displayImage"
          class="ml-n1"
        ></m-img>
        <v-icon
          v-else-if="notification.type.includes('disapproved')"
          :size="notification.type.includes('item') ? '1.6em' : '1.7em'"
          color="grey darken-1"
          >{{
            notification.type == "list-disapproved"
              ? "$vuetify.icons.list-disapproved"
              : notification.type.includes("item") &&
                notification.type.includes("disapprove")
              ? "$vuetify.icons.item-disapproved"
              : notification.type == "demand-disapproved"
              ? "$vuetify.icons.demand-disapproved"
              : "$vuetify.icons.disapproved"
          }}
        </v-icon>
        <v-icon
          v-else-if="notification.type.includes('approved')"
          color="grey darken-1"
          :size="notification.type.includes('item') ? '1.6em' : '1.7em'"
          >{{
            notification.type == "list-approved"
              ? "$vuetify.icons.list-approved"
              : notification.type == "item-approved"
              ? "$vuetify.icons.item-approved"
              : notification.type == "demand-approved"
              ? "$vuetify.icons.demand"
              : notification.type == "item-info-approved"
              ? "$vuetify.icons.item-info-approved"
              : notification.type == "item-image-approved"
              ? "$vuetify.icons.item-image-approved"
              : "$vuetify.icons.approved"
          }}</v-icon
        >
      </v-list-item-avatar>
      <v-list-item-content>
        <!-- <div style="line-height:1.5 !important;font-size:1.05em" v-html="message"></div> -->
        <div
          v-if="
            notification.type == 'reply' &&
              notification.commenter.id === user.id
          "
        >
          <span v-if="notification.user" class="link--text">{{
            notification.user.username
          }}</span>
          replied to your comment on
          <span class="text-capitalize font-weight-medium">{{
            notification.item.name
          }}</span>
          on the list of&nbsp;
          <span class="link--text text-capitalize">{{
            notification.list.title
          }}</span>
        </div>
        <div
          v-else-if="
            notification.type == 'reply' &&
              notification.commenter.id !== user.id
          "
        >
          <span v-if="notification.user" class>{{
            notification.user.username
          }}</span>
          also replied to
          <span>{{ notification.commenter.username }}</span
          >'s comment on
          <span class=" text-capitalize font-weight-medium">{{
            this.notification.item.name
          }}</span>
          on the list of
          <span class="link--text text-capitalize">{{
            notification.list.title
          }}</span>
        </div>
        <div v-if="notification.type == 'demand-created'">
          A list you were waiting for,
          <span class="text-capitalize link--text">{{
            notification.list.title
          }}</span>
          has been created by
          <span v-if="notification.user" class="">{{
            notification.user.username
          }}</span>
        </div>
        <div v-if="notification.type == 'follow'">
          <span class=" link--text">{{ notification.user.username }}</span>
          started following you
        </div>
        <div v-if="notification.type == 'list-approved'">
          Your submitted list
          <span class="link--text text-capitalize"
            >{{ notification.list.title }}&nbsp;</span
          >
          has been approved
        </div>
        <div v-if="notification.type == 'list-disapproved'">
          Your submitted list
          <span class="link--text text-capitalize"
            >{{ notification.list.title }}&nbsp;</span
          >
          was not approved <span v-html="notification.reason"></span>
        </div>
        <div v-if="notification.type == 'demand-approved'">
          Your demanded list
          <span class="link--text text-capitalize"
            >{{ notification.demand.title }}&nbsp;</span
          >
          has been approved
        </div>
        <div v-if="notification.type == 'demand-disapproved'">
          Your demanded list
          <span class="link--text text-capitalize"
            >{{ notification.demand.title }}&nbsp;</span
          >
          was not approved {{ notification.reason }}
        </div>
        <div v-if="notification.type == 'item-approved'">
          Your submitted item
          <span class="font-weight-medium ptd">{{
            notification.item.name
          }}</span>
          on the list of
          <span class="link--text text-capitalize"
            >{{ notification.list.title }}&nbsp;</span
          >
          has been approved
        </div>
        <div v-if="notification.type == 'item-disapproved'">
          Your submitted item
          <span class="ptd font-weight-medium">{{
            notification.item.name
          }}</span>
          on the list of
          <span class="link--text text-capitalize"
            >{{ notification.list.title }}&nbsp;</span
          >
          was not approved {{ notification.reason }}
        </div>
        <div v-if="notification.type == 'item-info-approved'">
          Your info contribution to
          <span class="font-weight-medium ptd">{{
            notification.item.name
          }}</span>
          has been approved. Thanks for your contribution
        </div>
        <div v-if="notification.type == 'item-info-disapproved'">
          Your info contribution to
          <span class="font-weight-medium ptd">{{
            notification.item.name
          }}</span>
          was not approved {{ notification.reason }}
        </div>
        <div v-if="notification.type == 'item-image-approved'">
          Your image contribution to
          <span class="font-weight-medium ptd">{{
            notification.item.name
          }}</span>
          has been approved. Thanks for your contribution
        </div>
        <div v-if="notification.type == 'item-image-disapproved'">
          Your image contribution to
          <span class="font-weight-medium ptd">{{
            notification.item.name
          }}</span>
          was not approved {{ notification.reason }}
        </div>
      </v-list-item-content>
      <v-list-item-action>
        <v-list-item-action-text>{{ created }}</v-list-item-action-text>
      </v-list-item-action>
    </v-list-item>
  </router-link>
</template>

<script>
import convertMoment from "../my-modules/js/convertMoment";
export default {
  props: {
    notification: Object,
    recent: Boolean,
    index: Number,
  },
  data() {
    return {
      notifier: { profile_pic: { low: "" } },
      link: "",
    };
  },
  methods: {
    setLink() {
      switch (this.notification.type) {
        case "reply":
          this.link = {
            path: "/lists/" + this.notification.list.id,
            query: {
              notification: true,
              item: this.notification.item.id,
            },
          };
          break;

        case "follow":
          this.link = {
            path: "/users/" + this.notification.user.id,
          };
          break;

        case "demand-created":
          this.link = {
            path: "/lists/" + this.notification.list.id,
          };
          break;
        case "list-approved":
          this.link = {
            path: "/lists/" + this.notification.list.id,
          };
          break;
        case "demand-approved":
          this.link = {
            path: "/demands/" + this.notification.demand.id,
          };
          break;
        case "item-approved":
          this.link = {
            path: "/lists/" + this.notification.list.id,
          };
      }
    },
  },
  computed: {
    created() {
      return convertMoment.getShortTime(this.notification.created);
    },
    user() {
      return this.$store.getters.getUser;
    },
  },
  created() {
    if (this.notification.user) {
      this.$store
        .dispatch("fetch_user", this.notification.user.id)
        .then((result) => {
          this.notifier = result;
          this.setLink();
        });
    } else {
      this.setLink();
    }
  },
};
</script>

<style scoped>
.recent {
  background-color: rgb(212, 247, 212);
}
* > * {
  line-height: 1.6em !important;
}
</style>
