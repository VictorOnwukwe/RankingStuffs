<template>
  <v-layout class="py-4 px-2 mt-4">
    <v-flex>
      <v-card tile flat class="">
        <v-card-title class="text-capitalize top-bar pa-1 pl-2 title-text font-weight-medium">Lists</v-card-title>
        <v-card-text class="pa-0">
          <v-layout class="my-4" v-if="fetchingLists" justify-center>
            <m-progress></m-progress>
          </v-layout>
          <div v-else-if="lists.length > 0">
            <v-list>
              <template v-for="(list, index) in lists">
                <list-preview :List="{id: list.id, ...list.data()}" :key="list.id"></list-preview>
                <v-divider class="grey lighten-3" style="margin-left:100px" v-if="index < lists.length - 1" :key="index"></v-divider>
              </template>
            </v-list>
            <v-layout v-if="fetchingMoreLists" class="mt-4" justify-center>
              <m-progress></m-progress>
            </v-layout>
            <v-layout v-if="lists.length !== user.lists" justify-center class="my-4">
              <v-icon @click="fetchMoreLists()" size="30">mdi-plus-circle-outline</v-icon>
            </v-layout>
          </div>
          <v-layout class="my-4" v-else justify-center>
            <div class="ptd">
              No Lists
              <a class="underline" v-if="isProfile" @click="go('/create')">Click to Add List</a>
            </div>
          </v-layout>
        </v-card-text>
        <v-card-actions v-if="isProfile && lists.length > 0">
          <span class="std">Your Anonymous Lists are not displayed to other users</span>
        </v-card-actions>
      </v-card>
      <v-card class="mt-4" tile flat>
        <v-card-title class="text-capitalize grey lighten-3 pa-1 pl-2 title-text font-weight-medium">Demands</v-card-title>
        <v-card-text class="pa-0">
          <v-layout class="my-4" v-if="fetchingDemands" justify-center>
            <m-progress></m-progress>
          </v-layout>
          <div v-else-if="demands.length > 0">
            <v-list>
              <template v-for="(demand, index) in demands">
                <demanded :key="demand.id" :demand="{id: demand.id, ...demand.data()}" :user="user"></demanded>
                <v-divider class="grey lighten-3" v-if="index < demands.length - 1" :key="index"></v-divider>
              </template>
            </v-list>
            <v-layout v-if="fetchingMoreDemands" class="mt-4" justify-center>
              <m-progress></m-progress>
            </v-layout>
            <v-layout v-if="demands.length !== user.demands" justify-center class="my-4">
              <v-icon @click="fetchMoreDemands()" size="30">mdi-plus-circle-outline</v-icon>
            </v-layout>
          </div>
          <v-layout class="my-4" v-else justify-center>
            <div class="ptd">
              No Demands
              <a
                class="underline"
                @click="go('/demand')"
                v-if="isProfile"
              >Click to Demand List</a>
            </div>
          </v-layout>
        </v-card-text>
        <v-card-actions v-if="isProfile && demands.length > 0">
          <span class="std">Your Anonymous Demands are not displayed to other users</span>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
let moment = require("moment");
import UserDemanded from "./UserDemanded";
import UserList from "./UserList";
export default {
  components: {
    demanded: UserDemanded,
    'list-preview': UserList
  },
  props: {
    user: Object,
    isProfile: Boolean
  },
  data() {
    return {
      lists: [],
      demands: [],
      listsFetched: false,
      demandsFetched: false,
      fetchingDemands: false,
      fetchingMoreDemands: false,
      fetchingLists: false,
      fetchingMoreLists: false
    };
  },
  methods: {
    created(time) {
      return moment(time.toDate()).calendar();
    },
    go(link) {
      this.$router.push({ path: link });
    },
    fetchLists(limit) {
      this.fetchingLists = true;
      this.$store
        .dispatch("fetch_user_lists", {
          isProfile: this.isProfile,
          user: this.user.id,
          limit: limit
        })
        .then(result => {
          this.lists = result;
          this.fetchingLists = false;
        });
    },
    fetchDemands(limit) {
      this.fetchingDemands = true;
      this.$store
        .dispatch("fetch_user_demands", {
          limit: limit,
          isProfile: this.isProfile,
          user: this.user.id
        })
        .then(result => {
          this.demands = result;
          this.fetchingDemands = false;
        });
    },
    fetchMoreDemands() {
      this.fetchingMoreDemands = true;
      this.$store
        .dispatch("fetch_user_demands", {
          timestamp: this.demands[this.demands.length - 1].data().created,
          limit: 5,
          isProfile: this.isProfile,
          user: this.user.id
        })
        .then(results => {
          this.demands = this.demands.concat(results);
          this.fetchingMoreDemands = false;
        });
    },
    fetchMoreLists() {
      this.fetchingMoreLists = true;
      this.$store
        .dispatch("fetch_user_lists", {
          isProfile: this.isProfile,
          user: this.user.id,
          limit: 5,
          timestamp: this.lists[this.lists.length - 1].data().created
        })
        .then(results => {
          this.lists = this.lists.concat(results);
          this.fetchingMoreLists = false;
        });
    }
  },
  mounted() {
    this.fetchLists(10);
    this.fetchDemands(10);
  }
};
</script>