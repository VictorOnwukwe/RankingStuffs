<template>
  <div>
    <div class="grid">
      <div class="mt-4" v-for="(id, index) in IDs" :key="index">
        <preview :id="id.id" :item="item" :related="related"></preview>
      </div>
    </div>
  </div>
</template>
<script>
import ItemListPreview from "./ItemListPreview";
export default {
  components: {
    preview: ItemListPreview
  },
  props: {
    IDs: Array,
    item: Object,
    related: {
      type: Boolean,
      default: false
    },
  },
  methods: {}
};
</script>
<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1em;
}

@media (min-width: 900px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
