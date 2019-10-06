<template>
  <div id="main">
    <div style="max-width:1000px" class="mx-auto">
      <div class="page-title">Popular Lists</div>
      <div v-if="lists.length>0">
        <display-lists :lists="lists"></display-lists>
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
</style>
