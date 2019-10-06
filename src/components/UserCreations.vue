<template>
  <v-layout class="pa-4">
    <v-flex>
      <v-card tile outlined>
        <v-card-title class="text-capitalize title top-bar pa-1" style="font-weight:normal">Lists</v-card-title>
        <v-card-text class="pb-0">
          <v-list v-if="listsFetched && lists.length > 0">
            <template v-for="(list, index) in lists">
              <v-list-item link :key="index" @click="go('/lists/' + list.id)">
                <v-list-item-avatar size="80" v-if="list.preview_image" tile>
                  <v-img :src="list.preview_image.url"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text-capitalize brand--text">{{list.title}}</v-list-item-title>
                  <v-list-item-subtitle>{{created(list.created)}}</v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <rating :value="list.rating" :size="'0.9em'"></rating>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider v-if="index < lists.length - 1" :key="index"></v-divider>
            </template>
          </v-list>
          <v-layout class="my-4" v-else-if="!listsFetched" justify-center>
            <v-progress-circular indeterminate color="brand"></v-progress-circular>
          </v-layout>
          <v-layout class="my-4" v-else justify-center>
            <div class="primary-text-dark">
              No Lists
              <a class="underline" v-if="isProfile" @click="go('/create')">Click to Add List</a>
            </div>
          </v-layout>
        </v-card-text>
        <v-card-actions v-if="isProfile && lists.length > 0">
          <span>Note: Your Anonymous Lists are not displayed to other users</span>
        </v-card-actions>
      </v-card>
      <v-card class="mt-4" tile outlined>
        <v-card-title class="text-capitalize title top-bar pa-1" style="font-weight:normal">Demands</v-card-title>
        <v-card-text class="pb-0">
          <v-list v-if="demandsFetched && demands.length > 0">
            <template v-for="(demand, index) in demands">
              <demanded :key="index" :demand="demand" :isProfile="isProfile" :user="user"></demanded>
              <v-divider v-if="index < demands.length - 1"></v-divider>
            </template>
          </v-list>
          <v-layout class="my-4" v-else-if="!demandsFetched" justify-center>
            <v-progress-circular indeterminate color="brand"></v-progress-circular>
          </v-layout>
          <v-layout class="my-4" v-else justify-center>
            <div class="primary-text-dark">
              No Demands
              <a class="underline" @click="go('/demand')" v-if="isProfile">Click to Demand List</a>
            </div>
          </v-layout>
        </v-card-text>
        <v-card-actions v-if="isProfile && demands.length > 0">
          <span>Note: Your Anonymous Demands are not displayed to other users</span>
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
      demandsFetched: false
    };
  },
  methods: {
    created(time) {
      return moment(time.toDate()).calendar();
    },
    go(link) {
      this.$router.push({ path: link });
    },
    fetchLists(limit, order, dir, start) {
      this.$store
        .dispatch("fetch_user_lists", {
          isProfile: this.isProfile,
          user: this.user.id,
          limit: limit,
          order: order,
          dir: dir
        })
        .then(result => {
          this.lists = result;
          this.listsFetched = true;
        });
    },
    fetchDemands() {
      this.$store
        .dispatch("fetch_user_demands", {
          isProfile: this.isProfile,
          user: this.user.id
        })
        .then(result => {
          this.demands = result;
          this.demandsFetched = true;
        });
    }
  },
  mounted() {
    this.fetchLists(10, "created", "desc");
    this.fetchDemands();
  }
};
</script>