<template>
  <div id="main">
    <div v-if="!ids" class="preview my-4">
      <PreviewList
        v-for="list in lists"
        :key="list.id"
        :List="{ id: list.id, ...list.data() }"
        :sub="sub"
      ></PreviewList>
    </div>
    <div v-else class="preview my-4">
      <PreviewList
        v-for="id in ids"
        :key="id.id"
        :id="id.id"
        :sub="sub"
      ></PreviewList>
    </div>
  </div>
</template>

<script>
import PreviewList from "./PreviewList";
export default {
  components: {
    PreviewList,
  },
  props: {
    lists: Array,
    sub: Boolean,
    ids: {
      type: Array | Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.preview {
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 2em;
}
@media (min-width: 600px) {
  .preview {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    grid-column-gap: 1em;
  }
}
</style>
