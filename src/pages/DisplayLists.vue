<template>
  <div>
    <div class="mx-auto mb-4 mt">
      <v-layout
        align-center
        class="mb-8 px-2"
        style="border:1px solid lightgrey"
      >
        <div class="page-title pa-0">
          <span class="ptd">
            Lists
          </span>
        </div>
        <v-spacer></v-spacer>
        <div style="max-width:220px">
          <sorter :text="false" @change="shuffle" :options="options"></sorter>
        </div>
      </v-layout>

      <display-lists :lists="lists"></display-lists>
      <mugen-scroll
        :handler="fetchMore"
        :should-handle="!loading"
        :threshold="0"
      >
        <list-loading v-if="!complete && loading"></list-loading>
      </mugen-scroll>
    </div>
  </div>
</template>

<script>
import MugenScroll from "vue-mugen-scroll";
import Sorter from "../components/Sorter";
export default {
  components: {
    MugenScroll,
    Sorter
  },
  data() {
    return {
      lists: [],
      sort: "random",
      lastDoc: false,
      loading: false,
      complete: false,
      config: {
        itemSelector: ".item",
        gutter: 10
      }
    };
  },
  methods: {
    fetchlists() {
      this.loading = true;
      this.$store
        .dispatch("fetch_lists", {
          limit: 20,
          sort: this.sort,
          lastDoc: this.lastDoc
        })
        .then(lists => {
          this.lastDoc = lists[lists.length - 1];
          this.lists = lists;
          this.loading = false;
        });
    },
    fetchMore() {
      if (this.complete || this.lists.length == 0) {
        return;
      }
      this.loading = true;
      this.$store
        .dispatch("fetch_lists", {
          limit: 20,
          sort: this.sort,
          lastDoc: this.lastDoc
        })
        .then(lists => {
          this.loading = false;
          if (lists.length > 0) {
            this.lastDoc = lists[lists.length - 1];
            this.lists = this.lists.concat(lists);
          } else {
            this.complete = true;
          }
        })
        .catch(_ => {});
    },
    shuffle(val) {
      this.sort = val.choice;
      this.lists = [];
      this.complete = false;
      this.loading = false;
      this.lastDoc = false;
      this.fetchlists();
    }
  },
  computed: {
    options() {
      return [
        {
          label: "Random",
          value: "random"
        },
        {
          label: "Newest",
          value: "newest"
        },
        { label: "Oldest", value: "oldest" },
        { label: "Most Popular", value: "popularity" },
        { label: "Top Rated", value: "rating" }
      ];
    }
  },
  mounted() {
    this.fetchlists();
    this.$store.dispatch("set_loading", false);
    // this.$redrawVueMasonry();
  }
};
</script>
