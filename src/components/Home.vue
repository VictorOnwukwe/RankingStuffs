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

    <v-btn v-if="false" @click="categorize()">Categorize</v-btn>
  </div>
</template>

<script>
// import { Carousel3d, Slide } from "vue-carousel-3d";
import categories from "../../public/my-modules/categories";
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
  methods: {
    categorize() {
      this.$store.dispatch("upload_categories", categories);
    }
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

<style scoped>
.top-view {
  background-image: url("../../public/background2.jpg");
  width: calc(100% + 1em);
  margin-left: -0.5em;
  height: auto;
  background-position: top center;
}
.overlay {
  background: rgba(0, 0, 0, 0.5);
  height: auto;
  display: flex;
  align-content: center;
  justify-content: center;
  padding: 3em 2em;
}
.foreground {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.search-container {
  width: 80%;
  max-width: 420px;
  position: relative;
}
.search {
  width: 100%;
  border: 1px solid white;
  height: 45px;
  border-radius: 0.3em;
  /* color: white; */
  padding: 0.2em 0.5em;
  background-color: white;
}
.display-container {
  width: 100%;
  /* background-color: white; */
  margin-top: 2em;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1em;
  max-width: 600px;
}
.display {
  width: 100%;
  /* border: 1px solid var(--accent); */
  padding: 1em;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 0.3em;
}
.header {
  color: var(--accent);
  text-align: center;
}
.description {
  font-weight: normal;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-column-gap: 0.5em;
  grid-row-gap: 1em;
}
/* @media (min-width: 500px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
} */
.img-overlay {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
