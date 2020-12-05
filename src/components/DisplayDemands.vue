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
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  grid-row-gap: 1em;
  grid-column-gap: 1em;
}
</style>
