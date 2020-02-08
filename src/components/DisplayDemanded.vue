<template>
  <div>
    <div class="mx-auto mb-4 mt">
      <v-layout
        align-center
        class="mb-8 px-2"
        style="border:1px solid lightgrey"
      >
        <div class="page-title pa-0">
          <span class="ptd">
            Demands
          </span>
        </div>
        <v-spacer></v-spacer>
        <div style="max-width:220px">
          <sorter :text="false" @change="shuffle" :options="options"></sorter>
        </div>
      </v-layout>

      <display-demands :demands="demands"></display-demands>
      <mugen-scroll
        :handler="fetchMore"
        :should-handle="!loading"
        :threshold="0"
      >
        <list-loading v-if="!complete && loading"></list-loading>
      </mugen-scroll>
    </div>
  </div>
</template>

<script>
import MugenScroll from "vue-mugen-scroll";
import DisplayDemands from "./DisplayDemands";
import Sorter from "./Sorter";
export default {
  components: {
    MugenScroll,
    DisplayDemands,
    Sorter
  },
  data() {
    return {
      demands: [],
      sort: "random",
      lastDoc: false,
      loading: false,
      complete: false
    };
  },
  methods: {
    fetchDemands() {
      this.loading = true;
      this.$store
        .dispatch("fetch_demanded", {
          limit: 20,
          sort: this.sort,
          lastDoc: this.lastDoc
        })
        .then(demands => {
          this.lastDoc = demands[demands.length - 1];
          this.demands = demands;
          this.loading = false;
        });
    },
    fetchMore() {
      if (this.complete || this.demands.length == 0) {
        return;
      }
      this.loading = true;
      this.$store
        .dispatch("fetch_demanded", {
          limit: 20,
          sort: this.sort,
          lastDoc: this.lastDoc
        })
        .then(demands => {
          this.loading = false;
          if (demands.length > 0) {
            this.lastDoc = demands[demands.length - 1];
            this.demands = this.demands.concat(demands);
          } else {
            this.complete = true;
          }
        })
        .catch(_ => {});
    },
    shuffle(val) {
      this.sort = val.choice;
      this.demands = [];
      this.complete = false;
      this.loading = false;
      this.lastDoc = false;
      this.fetchDemands();
    }
  },
  computed: {
    options() {
      return [
        {
          label: "Random",
          value: "random"
        },
        { label: "Most Demanded", value: "most-demanded" },
        { label: "Least Demanded", value: "least-demanded" },
        {
          label: "Newest",
          value: "newest"
        },
        { label: "Oldest", value: "oldest" }
      ];
    }
  },
  created() {
    this.fetchDemands();
  }
};
</script>
