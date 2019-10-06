<template>
  <div id="main">
    <div id="preview" class="my-4">
      <PreviewList v-for="list in lists" :key="list.id" :list="list" :sub="sub"></PreviewList>
    </div>
  </div>
</template>

<script>
import PreviewList from "./PreviewList";
export default {
  components: {
    PreviewList
  },
  props: {
    lists: Array,
    sub: Boolean
  }
};
</script>

<style scoped>
#preview {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 0.5em;
}

@media (min-width: 700px) {
    #preview{
        grid-template-columns: 1fr 1fr;
    }
}
</style>
