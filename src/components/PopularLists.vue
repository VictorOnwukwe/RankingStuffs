<template>
  <div id="main">
    <div class="mx-auto">
      <div class="page-title">Popular Lists</div>
      <div v-if="lists.length>0">
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
import PreviewList from "./PreviewList";
import Sidebar from "./Sidebar";
import MugenScroll from "vue-mugen-scroll";
export default {
  components: {
    PreviewList,
    Sidebar,
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
        .dispatch("fetch_popular", {
          limit: 8,
          lastDoc: false
        })
        .then(lists => {
          this.lastDoc = lists[lists.length - 1];
          this.lists = lists.map(doc => {
            return {
              id: doc.id,
              ...doc.data()
            };
          });
          this.$store.dispatch("set_loading", false);
          this.loading = false;
        });
    },
    fetchMore() {
      if(this.complete){
        return;
      }
      this.loading = true;
      this.$store
        .dispatch("fetch_popular", { lastDoc: this.lastDoc, limit: 2 })
        .then(lists => {
          this.lastDoc = lists[lists.length - 1];
          this.loading = false;
          if (lists.length > 0) {
            this.lists = this.lists.concat(
              lists.map(doc => {
                return {
                  id: doc.id,
                  ...doc.data()
                };
              })
            );
          }else{
            this.complete = true;
          }
        });
    }
  },
  computed: {},
  created: function() {
    this.fetchLists();
  }
};
</script>

<style scoped>
</style>
