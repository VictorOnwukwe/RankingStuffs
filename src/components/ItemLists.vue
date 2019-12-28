<template>
  <div class="mt-4">
    <div class="mt-4" v-for="(id, index) in IDs" :key="index">
      <preview :id="id.id" :item="item"></preview>
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
    item: Object
  },
  methods: {}
};
</script>
