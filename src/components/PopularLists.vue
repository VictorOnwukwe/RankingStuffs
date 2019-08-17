<template>
  <div id="main">
    <div id="main-view">
      <div id="view">
        <PreviewList v-for="list in lists" :key="list.id" :list="list"></PreviewList>
      </div>
    </div>
  </div>
</template>

<script>
import PreviewList from "./PreviewList";
import Sidebar from "./Sidebar";
export default {
  components: {
    PreviewList,
    Sidebar
  },
  data() {
    return {
      lists: []
    };
  },
  computed: {},
  created: function() {
    this.$store.dispatch("fetch_popular", 20).then(lists => {
      this.lists = lists;
    });
  }
};
</script>

<style scoped>
/* #main-view {
  display: flex;
}
#view {
  flex-grow: 1;
} */
</style>
