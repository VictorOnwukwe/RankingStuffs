<template>
  <div>
    <v-list-item v-if="activity.type == 'list'">
      <v-list-item-avatar tile>
        <v-icon color="pink">$vuetify.icons.create</v-icon>
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
    <v-list-item v-if="activity.type == 'comment'">
      <v-list-item-avatar>
        <v-icon color="blue darken-2" size="2rem">mdi-comment</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          Comment on
          <span class="font-weight-medium text-capitalize pointer">{{
            activity.item.name
          }}</span>
          on the list of
          <router-link
            class="link--text font-weight-medium pointer text-capitalize no-deco"
            :to="'/lists/' + activity.list.id"
            >{{ activity.list.title }}</router-link
          >
        </v-list-item-title>
        <v-list-item-title class="italic font-weight-black text-wrap"
          >"{{ activity.comment }}"</v-list-item-title
        >
        <v-list-item-subtitle>{{ created }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-list-item v-if="activity.type == 'upvote'">
      <v-list-item-avatar>
        <v-icon color="green" size="2rem">mdi-arrow-up-bold-box</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          Upvote for
          <span class="font-weight-medium pointer text-capitalize">{{
            activity.item.name
          }}</span>
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
    <v-list-item v-if="activity.type == 'downvote'">
      <v-list-item-avatar>
        <v-icon color="red" size="2rem">mdi-arrow-down-bold-box</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          Downvote for
          <span class="font-weight-medium pointer text-capitalize">{{
            activity.item.name
          }}</span>
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
    <v-list-item v-if="activity.type == 'item'">
      <v-list-item-avatar>
        <v-icon>mdi-arrow-up</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          Add item
          <span class="font-weight-medium pointer">{{
            activity.item.name
          }}</span>
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
    <v-list-item v-if="activity.type == 'rate'">
      <v-list-item-avatar>
        <v-icon color="yellow darken-3">fa-star</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          Rated
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
    <v-list-item v-if="activity.type == 'demand'">
      <v-list-item-avatar tile>
        <v-icon color="brown">$vuetify.icons.demand</v-icon>
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
    <v-list-item v-if="activity.type == 'item-update'">
      <v-list-item-avatar>
        <v-icon size="2rem" color="grey">mdi-plus-box</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          Contribution to
          <span
            class="font-weight-medium pointer text-capitalize"
            @click="go('/lists/' + activity.list.id)"
            >{{ activity.item.name }}</span
          >
        </v-list-item-title>
        <v-list-item-subtitle>{{ created }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item v-if="activity.type == 'reply'">
      <v-list-item-avatar>
        <v-icon color="blue" size="2rem">mdi-reply</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="text-wrap">
          Reply to a comment on
          <span class="font-weight-medium text-capitalize">{{
            activity.item.name
          }}</span>
          on the list of
          <router-link
            class="link--text font-weight-medium pointer text-capitalize no-deco"
            :to="'/lists/' + activity.list.id"
            >{{ activity.list.title }}</router-link
          >
        </v-list-item-title>
        <v-list-item-title class="italic font-weight-black">
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
      return moment(this.activity.created.toDate()).fromNow();
    }
  },
  created() {
    // console.log(this.activity);
  }
};
</script>
