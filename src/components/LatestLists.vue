<template>
  <div>
    <div class="mx-auto">
      <div class="page-title">Latest Lists</div>
      <div style="overflow-y:auto|scroll" v-if="lists.length>0">
        <display-lists :lists="lists"></display-lists>
        <mugen-scroll :handler="fetchMore" :should-handle="!loading" :threshold="0.5">
            <v-layout v-if="!complete" justify-center>
                <v-progress-circular size="30" width="3" color="brand" indeterminate></v-progress-circular>
            </v-layout>
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
      busy: false,
      loading: false,
      complete: false
    };
  },

  methods: {
    fetchLists(timestamp, limit) {
      this.$store.dispatch("set_loading", true);
      this.$store
        .dispatch("fetch_latest", {
          timestamp: timestamp,
          limit: 20
        })
        .then(lists => {
          this.lists = lists;
          this.$store.dispatch("set_loading", false);
        });
    },
    fetchMore() {
      if(this.complete){
          return;
      }
      this.loading = true;
      this.$store
        .dispatch("fetch_latest", {
          timestamp: this.lists[this.lists.length - 1].created,
          limit: 10
        })
        .then(lists => {
            this.loading = false
          if (lists.length > 0) {
            this.lists = this.lists.concat(lists);
          }else{
              this.complete = true;
          }
        });
    }
    //  :infinite-scroll-immediate-check="false" infinite-scroll-disabled="busy" infinite-scroll-distance="10"
    // v-infinite-scroll="fetchMore()"
  },
  created: function() {
    this.fetchLists("now", 5);
  }
};
</script>

<style scoped>
</style>
