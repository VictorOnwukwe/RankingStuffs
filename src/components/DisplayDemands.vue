<template>
  <div>
    <div class="grid" style="margin-bottom:1em">
      <PreviewDemand
        v-for="(demand, index) in demands"
        :key="index"
        :demand="{ id: demand.id, ...demand.data() }"
        :sub="sub"
      ></PreviewDemand>
    </div>
  </div>
</template>
<script>
import PreviewDemand from "./PreviewDemand";
export default {
  components: {
    PreviewDemand
  },
  props: {
    demands: Array,
    sub: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style scoped>
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
</style>
