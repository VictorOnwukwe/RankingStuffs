<template>
  <div>
    <v-list-item v-if="activity.type == 'list'" class="pl-0 pr-0">
      <v-list-item-avatar tile class="mt-2" style="align-self:flex-start">
        <v-icon size="2rem" color="accent">$vuetify.icons.createOutline</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          Creation of List:
          <router-link
            class="link--text pointer text-capitalize no-deco"
            :to="'/lists/' + activity.list.id"
            >{{ activity.list.title }}</router-link
          >
        </v-list-item-title>
        <v-list-item-subtitle>{{ created }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="activity.type == 'comment'" class="pl-0 pr-0">
      <v-list-item-avatar tile class="mt-2 ml-n1" style="align-self:flex-start">
        <v-icon color="accent" size="2rem"
          >$vuetify.icons.commentOutline</v-icon
        >
      </v-list-item-avatar>
      <v-list-item-content class="ml-1">
        <v-list-item-title class="text-wrap">
          Comment on
          <span class="font-weight-medium text-capitalize pointer">{{
            activity.item.name
          }}</span>
          on the list of
          <router-link
            class="link--text pointer text-capitalize no-deco"
            :to="'/lists/' + activity.list.id"
            >{{ activity.list.title }}</router-link
          >
        </v-list-item-title>
        <v-list-item-title
          class="text-wrap mt-2 pl-2 scroll"
          style="border-left: 2px solid rgba(0,0,0,.2)"
          ><span class="pre-wrap roboto" style="font-size:1.1em">{{
            activity.comment
          }}</span></v-list-item-title
        >
        <v-list-item-subtitle>{{ created }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="activity.type == 'upvote'" class="pl-0 pr-0">
      <v-list-item-avatar tile class="mt-2" style="align-self:flex-start">
        <v-icon color="accent" size="2rem"
          >$vuetify.icons.arrowUpOutline</v-icon
        >
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          Upvote for
          <span class="font-weight-medium pointer text-capitalize">{{
            activity.item.name
          }}</span>
          on the list of
          <router-link
            class="link--text pointer text-capitalize no-deco"
            :to="'/lists/' + activity.list.id"
            >{{ activity.list.title }}</router-link
          >
        </v-list-item-title>
        <v-list-item-subtitle>{{ created }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="activity.type == 'downvote'" class="pl-0 pr-0">
      <v-list-item-avatar tile class="mt-2" style="align-self:flex-start">
        <v-icon color="accent" size="2rem"
          >$vuetify.icons.arrowDownOutline</v-icon
        >
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          Downvote for
          <span class="font-weight-medium pointer text-capitalize">{{
            activity.item.name
          }}</span>
          on the list of
          <router-link
            class="link--text pointer text-capitalize no-deco"
            :to="'/lists/' + activity.list.id"
            >{{ activity.list.title }}</router-link
          >
        </v-list-item-title>
        <v-list-item-subtitle>{{ created }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="activity.type == 'item'" class="pl-0 pr-0">
      <v-list-item-avatar tile class="mt-2" style="align-self:flex-start">
        <v-icon size="2rem" color="accent"
          >$vuetify.icons.item-approved</v-icon
        >
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          Addition of item
          <span class="font-weight-medium">{{
            activity.item.name
          }}</span>
          to the list of
          <router-link
            class="link--text pointer text-capitalize no-deco"
            :to="'/lists/' + activity.list.id"
            >{{ activity.list.title }}</router-link
          >
        </v-list-item-title>
        <v-list-item-subtitle>{{ created }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="activity.type == 'rate'" class="pl-0 pr-0">
      <v-list-item-avatar tile class="mt-2 ml-n1" style="align-self:flex-start">
        <v-icon size="2rem" color="accent">$vuetify.icons.starOutline</v-icon>
      </v-list-item-avatar>
      <v-list-item-content class="ml-1">
        <v-list-item-title class="text-wrap">
          Rating on
          <router-link
            class="link--text pointer text-capitalize no-deco"
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
      <v-list-item-avatar tile class="mt-2" style="align-self:flex-start">
        <v-icon size="2rem" color="accent">$vuetify.icons.demandOutline</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          Demand for
          <router-link :to="'/demands/' + activity.demand.id" class="no-deco">
            <span class="link--text pointer text-capitalize">{{
              activity.demand.title
            }}</span></router-link
          >
        </v-list-item-title>
        <v-list-item-subtitle>{{ created }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="activity.type == 'item-update'" class="pl-0 pr-0">
      <v-list-item-avatar tile class="mt-2" style="align-self:flex-start">
        <v-icon size="2rem" color="accent">{{
          activity.item.image
            ? "$vuetify.icons.item-image-approved"
            : "$vuetify.icons.item-info-approved"
        }}</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          {{ activity.item.image ? "Image " : "Info " }}Contribution to
          <router-link
            class="font-weight-medium text-capitalize no-deco ptd"
            :to="'/items/' + activity.item.info"
            >{{ activity.item.name }}</router-link
          >
        </v-list-item-title>
        <v-list-item-subtitle>{{ created }}</v-list-item-subtitle>
        <v-list-item-subtitle v-if="activity.item.image">
          <m-img :width="'100px'" :src="activity.item.image"></m-img>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="activity.type == 'reply'" class="pl-0 pr-0">
      <v-list-item-avatar tile class="mt-2 ml-n1" style="align-self:flex-start">
        <v-icon color="accent" size="2rem">$vuetify.icons.replyOutline</v-icon>
      </v-list-item-avatar>
      <v-list-item-content class="ml-1">
        <v-list-item-title class="text-wrap">
          Reply to a comment on
          <span class="font-weight-medium text-capitalize">{{
            activity.item.name
          }}</span>
          on the list of
          <router-link
            class="link--text pointer text-capitalize no-deco"
            :to="'/lists/' + activity.list.id"
            >{{ activity.list.title }}</router-link
          >
        </v-list-item-title>
        <v-list-item-title
          class="text-wrap mt-2 pl-2 scroll"
          style="border-left: 2px solid rgba(0,0,0,.2)"
        >
          <div class="grey lighten-3 pa-2 mb-1" style="font-size:0.85em">
            {{ activity.comment.content }}
          </div>
          <span class="pre-wrap roboto" style="font-size:1.1em">{{
            activity.reply.content
          }}</span>
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
  },
  computed: {
    created() {
      return moment(this.activity.created.toDate()).fromNow();
    },
  },
};
</script>
<style scoped>
* > * {
  line-height: 1.6em !important;
}
.scroll {
  max-height: 30vh;
  overflow-y: auto;
}
</style>
