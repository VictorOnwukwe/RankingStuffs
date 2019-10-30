<template>
  <v-layout class="pa-4">
    <v-flex>
      <v-card tile flat style="border: 1px solid rgb(132, 180, 255)">
        <v-card-title class="text-capitalize title top-bar pa-1" style="font-weight:normal">Lists</v-card-title>
        <v-card-text class="pb-0">
          <v-layout class="my-4" v-if="fetchingLists" justify-center>
            <v-progress-circular size="24" indeterminate color="brand"></v-progress-circular>
          </v-layout>
          <div v-else-if="lists.length > 0">
            <v-list>
              <template v-for="(list, index) in lists">
                <v-list-item :key="list.id" @click="go('/lists/' + list.id)">
                  <v-list-item-avatar size="80" v-if="list.preview_image" tile>
                    <v-img :src="list.preview_image.url"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="text-capitalize brand--text text-wrap">{{list.title}}</v-list-item-title>
                    <v-list-item-subtitle>{{created(list.created)}}</v-list-item-subtitle>
                    <v-list-item-subtitle>
                      <rating :value="list.rating" :size="'0.9em'"></rating>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider v-if="index < lists.length - 1" :key="index"></v-divider>
              </template>
            </v-list>
            <v-layout v-if="fetchingMoreLists" class="mt-4" justify-center>
              <v-progress-circular color="brand" size="24" indeterminate></v-progress-circular>
            </v-layout>
            <v-layout v-if="lists.length !== user.lists" justify-center class="my-4">
              <v-icon @click="fetchMoreLists()" size="30">mdi-plus-circle-outline</v-icon>
            </v-layout>
          </div>
          <v-layout class="my-4" v-else justify-center>
            <div class="primary-text-dark">
              No Lists
              <a class="underline" v-if="isProfile" @click="go('/create')">Click to Add List</a>
            </div>
          </v-layout>
        </v-card-text>
        <v-card-actions v-if="isProfile && lists.length > 0">
          <span>Your Anonymous Lists are not displayed to other users</span>
        </v-card-actions>
      </v-card>
      <v-card class="mt-4" tile flat style="border: 1px solid rgb(132, 180, 255)">
        <v-card-title class="text-capitalize title top-bar pa-1" style="font-weight:normal">Demands</v-card-title>
        <v-card-text class="pb-0">
          <v-layout class="my-4" v-if="fetchingDemands" justify-center>
            <v-progress-circular size="24" indeterminate color="brand"></v-progress-circular>
          </v-layout>
          <div v-else-if="demands.length > 0">
            <v-list>
              <template v-for="(demand, index) in demands">
                <demanded :key="demand.id" :demand="demand" :user="user"></demanded>
                <v-divider v-if="index < demands.length - 1" :key="index"></v-divider>
              </template>
            </v-list>
            <v-layout v-if="fetchingMoreDemands" class="mt-4" justify-center>
              <v-progress-circular color="brand" size="24" indeterminate></v-progress-circular>
            </v-layout>
            <v-layout v-if="demands.length !== user.demands" justify-center class="my-4">
              <v-icon @click="fetchMoreDemands()" size="30">mdi-plus-circle-outline</v-icon>
            </v-layout>
          </div>
          <v-layout class="my-4" v-else justify-center>
            <div class="primary-text-dark">
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
          <span>Your Anonymous Demands are not displayed to other users</span>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
let moment = require("moment");
import UserDemanded from "./UserDemanded";
export default {
  components: {
    demanded: UserDemanded
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
    fetchLists() {
      this.fetchingLists = true;
      this.$store
        .dispatch("fetch_user_lists", {
          isProfile: this.isProfile,
          user: this.user.id,
          limit: 10,
          timestamp: false
        })
        .then(result => {
          this.lists = result;
          this.fetchingLists = false;
        });
    },
    fetchDemands(limit, timestamp) {
      this.fetchingDemands = true;
      this.$store
        .dispatch("fetch_user_demands", {
          timestamp: timestamp,
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
          timestamp: this.demands[this.demands.length - 1].created,
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
          timestamp: this.lists[this.lists.length - 1].created
        })
        .then(results => {
          this.lists = this.lists.concat(results);
          this.fetchingMoreLists = false;
        });
    }
  },
  mounted() {
    this.fetchLists();
    this.fetchDemands(10, false);
  }
};
</script>