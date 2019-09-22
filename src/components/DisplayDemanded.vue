<template>
  <div style="margin: 0 auto; max-width:1000px">
    <div class="page-title">Demanded Lists</div>
    <v-select
      :items="['Queuers - High', 'Queuers - Low', 'Newest', 'Oldest']"
      label="Sort By"
      width="200px"
      color="brand"
    ></v-select>
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
    },
    onLayoutComplete() {
      console.log("layout complete !");
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
  background-color: #eee;
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