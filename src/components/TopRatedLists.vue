<template>
  <div id="main">
    <div class="mx-auto">
      <div class="page-title">Top Rated Lists</div>
      <div v-if="lists.length > 0">
        <display-lists :lists="lists"></display-lists>
        <mugen-scroll
          :handler="fetchMore"
          :should-handle="!loading"
          :threshold="1"
        >
          <list-loading :items="2" v-if="!complete && loading"></list-loading>
        </mugen-scroll>
      </div>
    </div>
  </div>
</template>

<script>
import MugenScroll from "vue-mugen-scroll";
export default {
  components: {
    MugenScroll
  },
  data() {
    return {
      lists: [],
      lastDoc: undefined,
      loading: false,
      complete: false
    };
  },
  methods: {
    fetchLists() {
      this.loading = true;
      this.$store.dispatch("set_loading", true);
      this.$store
        .dispatch("fetch_top_rated", {
          limit: 20,
          lastDoc: false
        })
        .then(lists => {
          this.lastDoc = lists[lists.length - 1];
          this.lists = lists;
          this.$store.dispatch("set_loading", false);
          this.loading = false;
        });
    },
    fetchMore() {
      if (this.complete || this.lists == []) {
        return;
      }
      this.loading = true;
      this.$store
        .dispatch("fetch_top_rated", { lastDoc: this.lastDoc, limit: 20 })
        .then(lists => {
          this.lastDoc = lists[lists.length - 1];
          this.loading = false;
          if (lists.length > 0) {
            this.lists = this.lists.concat(lists);
          } else {
            this.complete = true;
          }
        });
    }
  },
  created: function() {
    this.fetchLists();
  }
};
</script>

<style scoped></style>
