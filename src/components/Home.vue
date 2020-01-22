<template>
  <div>
    <main-list :list="latest" :type="'Latest'"></main-list>
    <hr class="mt-12 mb-6 accent" />
    <div class="grid">
      <div
        v-for="(list, index) in categoryLists.slice(0, divider)"
        :key="index"
      >
        <sub-list :list="list"></sub-list>
      </div>
    </div>
    <main-list class="mt-12" :list="popular" :type="'Popular'"></main-list>
    <hr class="mt-12 mb-6 accent" />
    <div class="grid">
      <div
        v-for="(list, index) in categoryLists.slice(divider, divider * 2)"
        :key="index"
      >
        <sub-list :list="list"></sub-list>
      </div>
    </div>
    <main-list class="mt-12" :list="topRated" :type="'Top Rated'"></main-list>
    <hr class="mt-12 mb-6 accent" />
    <div class="grid">
      <div
        v-for="(list, index) in categoryLists.slice(
          divider * 2,
          categoryLists.length
        )"
        :key="index"
      >
        <sub-list :list="list"></sub-list>
      </div>
    </div>
  </div>
</template>

<script>
import HomeMainList from "./HomeMainList";
import HomeSubList from "./HomeSubList";

export default {
  components: {
    mainList: HomeMainList,
    subList: HomeSubList
  },
  data() {
    return {};
  },
  computed: {
    categories() {
      return this.$store.getters.categories;
    },
    latest() {
      return this.$store.getters.latestList;
    },
    popular() {
      return this.$store.getters.popularList;
    },
    topRated() {
      return this.$store.getters.topRatedList;
    },
    categoryLists() {
      return this.$store.getters.categoryLists;
    },
    divider() {
      return Math.round(this.categories.length / 3);
    }
  },
  created: function() {
    this.$store.dispatch("set_loading", false);
    this.$store.dispatch("fetch_home_contents");
  }
};
</script>
