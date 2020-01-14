<template>
  <div>
    <v-card-text
      class="pr-0 py-0"
      :class="$vuetify.breakpoint.xs ? 'px-0 mt-12' : 'pl mt'"
    >
      <v-card width="100%" outlined>
        <v-card-title
          class="text-uppercase font-weight-bold black--text title-text"
        >
          <v-layout justify-center>Hot Lists</v-layout>
        </v-card-title>
        <v-card-text class="">
          <div v-if="lists.length > 0">
            <div v-for="(list, index) in lists" :key="index">
              <router-link :to="'/lists/' + list.id" class="no-deco">
                <a class="link--text text--darken-2 text-capitalize">{{
                  list.title
                }}</a>
              </router-link>
              <v-divider
                v-if="index !== lists.length - 1"
                class="my-1 grey lighten-2"
              ></v-divider>
            </div>
          </div>
          <v-layout v-else justify-center class="my-4">
            <m-progress :color="'blue lighten-2'"></m-progress>
          </v-layout>
        </v-card-text>
      </v-card>
      <v-card class="mt" outlined width="100%">
        <v-card-title
          class="text-uppercase font-weight-bold black--text title-text"
        >
          <v-layout justify-center>Hot Demands</v-layout>
        </v-card-title>
        <v-card-text class="">
          <div v-if="demands.length > 0">
            <div v-for="(demand, index) in demands" :key="index">
              <router-link :to="'/demands/' + demand.id" class="no-deco">
                <a class="link--text text--darken-2  text-capitalize">{{
                  demand.title
                }}</a>
              </router-link>
              <v-divider
                v-if="index !== demands.length - 1"
                class="my-1 grey lighten-2"
              ></v-divider>
            </div>
          </div>
          <v-layout v-else justify-center class="my-4">
            <m-progress :color="'blue lighten-2'"></m-progress>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-card-text>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {},
  computed: {
    lists() {
      return this.$store.getters.hotLists;
    },
    demands() {
      return this.$store.getters.hotDemands;
    }
  },
  created() {}
};
</script>
