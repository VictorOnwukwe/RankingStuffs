<template>
  <div>
    <div class="mx-auto mb-4">
      <div class="page-title">
        <div>
          Demanded Lists
          <v-select
            :items="['Most Demanded', 'Least Demanded', 'Newest', 'Oldest']"
            label="Sort By"
            width="100%"
            v-model="sort"
            @change="shuffle()"
          ></v-select>
        </div>
      </div>

      <div v-masonry transition-duration="0.5s" item-selector=".item">
        <div v-masonry-tile class="item" v-for="(demand, index) in demands" :key="index">
          <Demanded :demand="demand"></Demanded>
        </div>
      </div>
      <mugen-scroll :handler="fetchMore" :should-handle="!loading" :threshold="0.5">
        <v-layout v-if="!complete" justify-center>
          <v-progress-circular class="my-8" size="30" width="3" color="brand" indeterminate></v-progress-circular>
        </v-layout>
      </mugen-scroll>
    </div>
  </div>
</template>

<script>
import Demanded from "./Demanded";
import MugenScroll from "vue-mugen-scroll";
export default {
  components: {
    Demanded,
    MugenScroll
  },
  data() {
    return {
      demands: [],
      sort: "Most Demanded",
      lastDoc: false,
      loading: false,
      complete: false
    };
  },
  methods: {
    fetchDemands() {
      this.$store
        .dispatch("fetch_demanded", {
          limit: 3,
          sort: this.sort,
          lastDoc: this.lastDoc
        })
        .then(demands => {
          this.lastDoc = demands[demands.length - 1];
          this.demands = demands.map(doc => {
            return {
              id: doc.id,
              ...doc.data()
            };
          });
          this.$store.dispatch("set_loading", false);
        });
    },
    fetchMore() {
      if (this.complete) {
        return;
      }
      this.loading = true;
      this.$store
        .dispatch("fetch_demanded", {
          limit: 2,
          sort: this.sort,
          lastDoc: this.lastDoc
        })
        .then(demands => {
          this.loading = false;
          if (demands.length > 0) {
            this.lastDoc = demands[demands.length - 1];
            this.demands = this.demands.concat(
              demands.map(doc => {
                return {
                  id: doc.id,
                  ...doc.data()
                };
              })
            );
          } else {
            this.complete = true;
          }
        });
    },
    shuffle(){
      this.demands = [];
      this.complete = false;
      this.loading = false;
      this.lastDoc = false;
      this.fetchDemands();
    }
  },
  mounted() {
    this.fetchDemands();
    this.$store.dispatch("set_loading", true);
  }
};
</script>

<style scoped>
.item {
  width: 100%;
  padding: 0.5em;
  margin-bottom: 0.5em;
}
@media (min-width:700px){
  .item{
    width:50%;
  }
}
@media (min-width:900px){
  .item{
    width:33.3%;
  }
}
</style>