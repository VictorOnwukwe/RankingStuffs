<template>
  <div>
    <v-card-text
      class="mt pr-0 py-0"
      :class="$vuetify.breakpoint.xs ? 'px-0' : 'pl'"
    >
      <v-card width="100%" outlined>
        <v-card-title
          class="text-uppercase font-weight-bold black--text title-text"
          >Hot Lists</v-card-title
        >
        <v-card-text class="">
          <div v-for="(list, index) in lists" :key="index">
            <router-link :to="'/lists/' + list.id" class="no-deco">
              <a class="link--text text--darken-2 text-capitalize">{{ list.data().title }}</a>
            </router-link>
            <v-divider v-if="index !== lists.length - 1" class="my-1 grey lighten-2"></v-divider>
          </div>
        </v-card-text>
      </v-card>
      <v-card class="mt" outlined width="100%">
        <v-card-title
          class="text-uppercase font-weight-bold black--text title-text"
          >Hot Demands</v-card-title
        >
        <v-card-text class="">
          <div v-for="(demand, index) in demands" :key="index">
            <router-link :to="'/demands/' + demand.id" class="no-deco">
              <a class="link--text text--darken-2 text-capitalize">{{ demand.data().title }}</a>
            </router-link>
            <v-divider v-if="index !== demands.length - 1" class="my-1 grey lighten-2"></v-divider>
          </div>
        </v-card-text>
      </v-card>
      <v-card class="mt" flat v-if="extra!==null">
        <div>{{extra.title}}</div>
      </v-card>
    </v-card-text>
  </div>
</template>
<script>
export default {
  data() {
    return {
      lists: [],
      demands: []
    };
  },
  methods: {
    async fetchLists() {
      this.lists = await this.$store.dispatch("fetch_lists", {
        sort: "popularity",
        limit: 10
      });
    },
    async fetchDemands() {
      this.demands = await this.$store.dispatch("fetch_demanded", {
        sort: "most-demanded",
        limit: 10
      });
    }
  },
  computed: {
    extra(){
      return this.$store.getters.sidebarExtra;
    }
  },
  created() {
    this.fetchLists();
    this.fetchDemands();
  }
};
</script>
