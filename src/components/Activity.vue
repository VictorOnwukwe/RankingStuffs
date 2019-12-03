<template>
<div>
  <v-list-item>
    <v-list-item-content>
      <v-list-item-title v-if="activity.type == 'list'" class="text-wrap">
        {{ isProfile ? "You" : user.username }} created the list of
        <span
          class="link--text font-weight-medium pointer text-capitalize"
          @click="go('/lists/' + activity.list.id)"
          >{{ activity.list.title }}</span
        >
      </v-list-item-title>
      <v-list-item-title v-if="activity.type == 'comment'" class="text-wrap">
        {{ isProfile ? "You" : user.username }} added a comment on
        <span class="font-weight-medium text-capitalize pointer">{{
          activity.item.name
        }}</span>
        on the list of
        <span
          class="font-weight-medium text-capitalize link--text pointer"
          @click="go('/lists/' + activity.list.id)"
          >{{ activity.list.title }}</span
        >
      </v-list-item-title>
      <v-list-item-title v-if="activity.type == 'comment'" class="italic"
        >"{{ activity.comment }}"</v-list-item-title
      >
      <v-list-item-title v-if="activity.type == 'vote'" class="text-wrap">
        {{ isProfile ? "You" : user.username }} voted for
        <span class="font-weight-medium pointer">{{ activity.item.name }}</span>
        on the list of
        <span class="link--text font-weight-medium pointer">{{
          activity.list.title
        }}</span>
      </v-list-item-title>
      <v-list-item-title v-if="activity.type == 'item'" class="text-wrap">
        {{ isProfile ? "You" : user.username }} added
        <span class="font-weight-medium pointer">{{ activity.item.name }}</span>
        to the list of
        <span
          class="link--text font-weight-medium pointer"
          @click="go('/lists/' + activity.list.id)"
          >{{ activity.list.title }}</span
        >
      </v-list-item-title>
      <v-list-item-title v-if="activity.type == 'rate'" class="text-wrap">
        {{ isProfile ? "You" : user.username }} rated
        <span
          class="link--text font-weight-medium pointer text-capitalize"
          @click="go('/lists/' + activity.list.id)"
          >{{ activity.list.title }}</span
        >
        <rating
          :size="'0.8em'"
          :rating="activity.rating"
          :ratersCount="activity.raters_count"
        ></rating>
      </v-list-item-title>
      <v-list-item-title v-if="activity.type == 'demand'" class="text-wrap">
        {{ isProfile ? "You" : user.username }} demanded for
        <span
          class="link--text font-weight-medium pointer text-capitalize"
          @click="go('/lists/' + activity.list.id)"
          >{{ activity.demand.title }}</span
        >
      </v-list-item-title>
      <v-list-item-title
        v-if="activity.type == 'item-update'"
        class="text-wrap"
      >
        {{ isProfile ? "You" : user.username }} contributed to
        <span
          class="font-weight-medium pointer text-capitalize"
          @click="go('/lists/' + activity.list.id)"
          >{{ activity.item.name }}</span
        >
      </v-list-item-title>
      <v-list-item-title v-if="activity.type == 'reply'" class="text-wrap">
        {{ isProfile ? "You" : user.username }} replied to a comment on
        <span class="font-weight-medium text-capitalize">{{ activity.item.name }}</span> on the
        list of
        <span class="font-weight-medium link--text text-capitalize">{{
          activity.list.title
        }}</span>
      </v-list-item-title>
      <v-list-item-title v-if="activity.type == 'reply'" class="italic">
        {{activity.reply.content}}
      </v-list-item-title>
      <v-list-item-subtitle>{{ created }}</v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
  <v-divider class="grey lighten-3"></v-divider>
  </div>
</template>

<script>
let moment = require("moment");
export default {
  props: {
    activity: Object,
    isProfile: Boolean,
    user: Object,
    index: Number
  },
  data() {
    return {};
  },
  methods: {
    go(link) {
      return this.$router.go({ path: link });
    }
  },
  computed: {
    created() {
      return moment(this.activity.created.toDate()).calendar();
    }
  },
  created() {
    
  }
};
</script>
