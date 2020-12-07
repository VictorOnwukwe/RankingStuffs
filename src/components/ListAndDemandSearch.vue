<template>
  <div class="search-results white br">
    <div v-if="searching">
      <v-layout justify-center>
        <m-progress class="my-4"></m-progress>
      </v-layout>
    </div>
    <div v-else>
      <div v-if="demands.length > 0 || lists.length > 0">
        <div v-if="lists.length > 0" class="ptd">
          <div
            class="title-text pl-2 pt-2 grey--text text--darken-2 font-weight-bold"
          >
            Lists
          </div>
          <div class="px-2 mb-4">
            <div
              v-for="(result, index) in lists"
              :key="index"
              style="display:flex"
            >
              <div class="mr-1 font-weight-bold">-</div>
              <router-link
                :to="'/lists/' + result.objectID"
                class="pointer no-deco std ml-0"
              >
                <div
                  class="search-link"
                  style="font-size:15px"
                  @click="closeSearch(), clearKeyword()"
                >
                  {{ result.title }}
                </div>
              </router-link>
            </div>
          </div>
        </div>
        <div v-if="demands.length > 0" class="ptd">
          <div
            class="title-text grey--text text--darken-2 pl-2 pt-2 font-weight-bold"
          >
            Demands
          </div>
          <div class="px-2 mb-4">
            <div
              v-for="(result, index) in demands"
              :key="index"
              style="display:flex"
            >
              <div class="mr-1 font-weight-bold">-</div>
              <router-link
                :to="'/demands/' + result.objectID"
                @click="search = false"
                class="std pointer no-deco ml-0"
              >
                <div
                  class="search-link"
                  style="font-size:15px"
                  @click="closeSearch(), clearKeyword()"
                >
                  {{ result.title }}<br />
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="searched && !creation">
        <v-card tile flat class="ptd white">
          <v-card-text class
            >Sorry. This list does not exist yet. Be the first to create or
            demand it.</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <m-btn text small @click="goSearchedDemand()">Demand</m-btn>
            <m-btn text small @click="goSearchedCreate()">Create</m-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </div>
</template>
<script>
const _ = require("lodash");
export default {
  props: {
    keyword: String,
    creation: Boolean,
  },
  data() {
    return {
      lists: [],
      demands: [],
      searching: false,
      searched: false,
    };
  },
  methods: {
    fetchResults: _.debounce(async function() {
      this.searching = true;
      let results = await this.$store.dispatch(
        "search_lists_and_demands",
        this.keyword
      );
      this.lists = results.lists;
      this.demands = results.demands;
      this.searching = false;
      this.searched = true;
    }, 1500),
    goSearchedDemand() {
      this.clearKeyword();
      this.closeSearch();
      this.$router.push({
        path: "/demand",
        query: {
          searched: true,
          title: this.keyword,
        },
      });
    },

    goSearchedCreate() {
      this.clearKeyword();
      this.closeSearch();
      this.$router.push({
        path: "/create",
        query: { searched: true, title: this.keyword },
      });
    },

    closeSearch() {
      this.$emit("closeSearch");
    },
    clearKeyword() {
      this.$emit("clearKeyword");
    },
  },
  watch: {
    keyword() {
      this.searching = true;
      this.fetchResults();
      if (this.searched) this.searched = false;
    },
  },
};
</script>
<style scoped>
.search-results {
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  max-height: calc(70vh);
}
.search-link:hover {
  color: rgba(0, 0, 0, 0.75);
  filter: brightness(90%);
}
</style>
