<template>
  <div>
    <v-list-item v-if="activity.type == 'list'" class="pl-0 pr-0">
      <v-list-item-avatar tile>
        <v-icon size="2rem" color="accent">$vuetify.icons.createOutline</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          Creation of List:
          <router-link
            class="link--text font-weight-medium pointer text-capitalize no-deco"
            :to="'/lists/' + activity.list.id"
            >{{ activity.list.title }}</router-link
          >
        </v-list-item-title>
        <v-list-item-subtitle>{{ created }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="activity.type == 'comment'" class="pl-0 pr-0">
      <v-list-item-avatar tile>
        <v-icon color="accent" size="2rem"
          >$vuetify.icons.commentOutline</v-icon
        >
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          Comment on
          <span class="font-weight-medium text-capitalize pointer"
            >"{{ activity.item.name }}"</span
          >
          on the list of
          <router-link
            class="link--text font-weight-medium pointer text-capitalize no-deco"
            :to="'/lists/' + activity.list.id"
            >{{ activity.list.title }}</router-link
          >
        </v-list-item-title>
        <v-list-item-title class="italic font-weight-bold text-wrap"
          >"{{ activity.comment }}"</v-list-item-title
        >
        <v-list-item-subtitle>{{ created }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="activity.type == 'upvote'" class="pl-0 pr-0">
      <v-list-item-avatar tile>
        <v-icon color="accent" size="2rem"
          >$vuetify.icons.arrowUpOutline</v-icon
        >
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          Upvote for
          <span class="font-weight-medium pointer text-capitalize"
            >"{{ activity.item.name }}"</span
          >
          on the list of
          <router-link
            class="link--text font-weight-medium pointer text-capitalize no-deco"
            :to="'/lists/' + activity.list.id"
            >{{ activity.list.title }}</router-link
          >
        </v-list-item-title>
        <v-list-item-subtitle>{{ created }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="activity.type == 'downvote'" class="pl-0 pr-0">
      <v-list-item-avatar tile>
        <v-icon color="accent" size="2rem"
          >$vuetify.icons.arrowDownOutline</v-icon
        >
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          Downvote for
          <span class="font-weight-medium pointer text-capitalize"
            >"{{ activity.item.name }}"</span
          >
          on the list of
          <router-link
            class="link--text font-weight-medium pointer text-capitalize no-deco"
            :to="'/lists/' + activity.list.id"
            >{{ activity.list.title }}</router-link
          >
        </v-list-item-title>
        <v-list-item-subtitle>{{ created }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="activity.type == 'item'" class="pl-0 pr-0">
      <v-list-item-avatar tile>
        <v-icon size="2rem" color="accent"
          >$vuetify.icons.addItemOutline</v-icon
        >
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          Addition of item
          <span class="font-weight-medium pointer"
            >"{{ activity.item.name }}"</span
          >
          to the list of
          <router-link
            class="link--text font-weight-medium pointer text-capitalize no-deco"
            :to="'/lists/' + activity.list.id"
            >{{ activity.list.title }}</router-link
          >
        </v-list-item-title>
        <v-list-item-subtitle>{{ created }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="activity.type == 'rate'" class="pl-0 pr-0">
      <v-list-item-avatar tile>
        <v-icon size="2rem" color="accent">$vuetify.icons.starOutline</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          Rating on
          <router-link
            class="link--text font-weight-medium pointer text-capitalize no-deco"
            :to="'/lists/' + activity.list.id"
            >{{ activity.list.title }}</router-link
          >
          <rating
            :size="'0.8em'"
            :rating="activity.rating"
            :ratersCount="activity.raters_count"
          ></rating>
        </v-list-item-title>
        <v-list-item-subtitle>{{ created }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="activity.type == 'demand'" class="pl-0 pr-0">
      <v-list-item-avatar tile>
        <v-icon size="2rem" color="accent">$vuetify.icons.demandOutline</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          Demand for
          <router-link :to="'/demands/' + activity.demand.id" class="no-deco">
            <span
              class="link--text font-weight-medium pointer text-capitalize"
              >{{ activity.demand.title }}</span
            ></router-link
          >
        </v-list-item-title>
        <v-list-item-subtitle>{{ created }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="activity.type == 'item-update'" class="pl-0 pr-0">
      <v-list-item-avatar tile>
        <v-icon size="2.3rem" color="accent">$vuetify.icons.contribute</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          {{ activity.item.image ? "Image " : "Info " }}Contribution to
          <span
            class="font-weight-medium pointer text-capitalize"
            @click="go('/lists/' + activity.list.id)"
            >"{{ activity.item.name }}"</span
          >
        </v-list-item-title>
        <v-list-item-subtitle>{{ created }}</v-list-item-subtitle>
        <v-list-item-subtitle v-if="activity.item.image">
          <m-img :width="'100px'" :src="activity.item.image"></m-img>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="activity.type == 'reply'" class="pl-0 pr-0">
      <v-list-item-avatar tile>
        <v-icon color="accent" size="2rem">$vuetify.icons.replyOutline</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          Reply to a comment on
          <span class="font-weight-medium text-capitalize"
            >"{{ activity.item.name }}"</span
          >
          on the list of
          <router-link
            class="link--text font-weight-medium pointer text-capitalize no-deco"
            :to="'/lists/' + activity.list.id"
            >{{ activity.list.title }}</router-link
          >
        </v-list-item-title>
        <v-list-item-title class="italic font-weight-bold text-wrap">
          "{{ activity.reply.content }}"
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
    isProfile: Boolean
  },
  methods: {
    go(link) {
      return this.$router.go({ path: link });
    }
  },
  computed: {
    created() {
      return moment(this.activity.created.toDate()).fromNow();
    }
  }
};
</script>
<style scoped>
* > * {
  line-height: 1.6em !important;
}
</style>
