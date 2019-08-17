<template>
  <div id="main">
    <div id="preview">
      <PreviewList v-for="list in lists" :key="list.id" :list="list"></PreviewList>
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
    lists: Array
  }
};
</script>

<style scoped>
#preview {
    display: grid;
    grid-template-columns: 1fr;
}

@media (min-width: 1000px) {
    #preview{
        grid-template-columns: 1fr 1fr;
    }
}

@media (min-width: 1400px) {
    #preview{
        grid-template-columns: 1fr 1fr 1fr;
    }
}
</style>
