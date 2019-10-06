<template>
  <div>
    <div style="max-width:1000px" class="mx-auto mb-4">
    <div class="page-title">Demanded Lists</div>
    <!-- <v-select
      :items="['Most Demanded', 'Least Demanded', 'Newest', 'Oldest']"
      label="Sort By"
      color="brand"
    ></v-select> -->
    <!-- <the-masonry :cols="3" :gutter="12">
      <div class="item mb-3" v-for="(demand, index) in demands" :key="index">
        <Demanded :demand="demand"></Demanded>
      </div>
    </the-masonry>-->

    <div class="masonry">
      <div class="item" v-for="(demand, index) in demands" :key="index">
        <Demanded :demand="demand"></Demanded>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import Demanded from "./Demanded";
export default {
  components: {
    Demanded
  },
  data() {
    return {
      demands: {}
    };
  },
  methods: {
    fetchDemands(limit, max) {
      this.$store
        .dispatch("fetch_demanded", {
          limit: limit,
          max: max
        })
        .then(demands => {
          this.demands = demands;
        });
    }
  },
  mounted() {
    this.fetchDemands(20, 1000000);
  }
};
</script>

<style scoped>
.masonry {
  column-count: 1;
  column-gap: 0.5em;
}
.item {
  width: 100%;
  margin: 0 0 0.5em;
  break-inside: avoid;
}
@media (min-width: 700px) {
  .masonry {
    column-count: 2;
    column-gap: 0.5em;
  }
}
@media (min-width: 1200px) {
  .masonry {
    column-count: 3;
  }
}
</style>