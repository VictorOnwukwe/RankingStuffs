<template>
  <div>
    <div class="mx-auto mb-4">
      <div class="page-title pa-0">
          <v-layout class="brand lighten-2 pa-1" style="border-radius:4px" wrap>
            <span class="mr-2 white--text">
              Demanded Lists
            </span>
            <!-- <select
              style="font-size:16px; background-color:white; padding: 0.3em;margin-top:-0.5em"
            >
              <option value="Most Demanded">Most Demanded</option>
              <option value="Least Demanded">Least Demanded</option>
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
            </select> -->
            <!-- <v-spacer></v-spacer> -->
          <div style="max-width:185px">
          <v-select
            :items="['Most Demanded', 'Least Demanded', 'Newest', 'Oldest']"
            v-model="sort"
            solo
            flat
            @change="shuffle()"
          ></v-select>
          </div>
          </v-layout>
      </div>

      <div class="grid" style="margin-bottom:1em">
        <PreviewDemand
          v-for="(demand, index) in demands"
          :key="index"
          :demand="{ id: demand.id, ...demand.data() }"
        ></PreviewDemand>
      </div>
      <mugen-scroll
        :handler="fetchMore"
        :should-handle="!loading"
        :threshold="1"
      >
        <list-loading v-if="!complete && loading"></list-loading>
      </mugen-scroll>
    </div>
  </div>
</template>

<script>
import PreviewDemand from "./PreviewDemand";
import MugenScroll from "vue-mugen-scroll";
export default {
  components: {
    PreviewDemand,
    MugenScroll
  },
  data() {
    return {
      demands: [],
      sort: "Most Demanded",
      lastDoc: false,
      loading: false,
      complete: false,
      config: {
        itemSelector: ".item",
        gutter: 10
      }
    };
  },
  methods: {
    fetchDemands() {
      this.$store
        .dispatch("fetch_demanded", {
          limit: 20,
          sort: this.sort,
          lastDoc: this.lastDoc
        })
        .then(demands => {
          this.lastDoc = demands[demands.length - 1];
          this.demands = demands;
          // this.$store.dispatch("set_loading", false);
          this.$redrawVueMasonry("container");
        });
    },
    fetchMore() {
      if (this.complete) {
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
          setTimeout(() => {
            this.$redrawVueMasonry("container");
          }, 1500);
        });
    },
    shuffle() {
      this.demands = [];
      this.complete = false;
      this.loading = false;
      this.lastDoc = false;
      this.fetchDemands();
    }
  },
  mounted() {
    this.fetchDemands();
    // this.$store.dispatch("set_loading", true);
    // this.$redrawVueMasonry();
  }
};
</script>

<style scoped>
.item {
  width: 100%;
  padding: 0.25em;
  margin-bottom: 0.125em;
}
@media (min-width: 700px) {
  .item {
    width: 50%;
  }
}
@media (min-width: 900px) {
  .item {
    width: 33.3%;
  }
}
.grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 0.5em;
}

@media (min-width: 900px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}
.v-text-field.v-text-field--enclosed .v-text-field__details{
  margin-bottom: 0px !important;
}
</style>
