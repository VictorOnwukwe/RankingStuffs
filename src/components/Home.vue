<template>
  <div>
    <h1 class="grey--text text--darken-3">LATEST</h1>
    <main-list v-if="latest" :list="latest"></main-list>
    <hr class="mt-12 mb-6 accent" />
    <div class="grid">
      <div v-for="(list, index) in categoryLists.slice(0,2)" :key="index">
        <sub-list :list="list"></sub-list>
      </div>
    </div>
    <h1 class="mt-12 grey--text text--darken-3">POPULAR</h1>
    <main-list v-if="popular" :list="popular"></main-list>
    <hr class="mt-12 mb-6 accent" />
    <div class="grid">
      <div v-for="(list, index) in categoryLists.slice(2,4)" :key="index">
        <sub-list :list="list"></sub-list>
      </div>
    </div>
    <h1 class="mt-12 grey--text text--darken-3">TOP RATED</h1>
    <main-list v-if="topRated" :list="topRated"></main-list>
    <hr class="mt-12 mb-6 accent" />
    <div class="grid">
      <div v-for="(list, index) in categoryLists.slice(4,categoryLists.length)" :key="index">
        <sub-list :list="list"></sub-list>
      </div>
    </div>

    <v-btn v-if="false" @click="categorize()">Categorize</v-btn>
  </div>
</template>

<script>
// import { Carousel3d, Slide } from "vue-carousel-3d";
import { Glide, GlideSlide } from "vue-glide-js";
import categories from "../../public/my-modules/categories";
import HappeningNow from "./HappeningNow";
import Slide from "./Slide";
import HomeMainList from "./HomeMainList";
import HomeSubList from "./HomeSubList";

export default {
  components: {
    Slide,
    happening: HappeningNow,
    mainList: HomeMainList,
    subList: HomeSubList
  },
  data() {
    return {
      latest: false,
      popular: false,
      topRated: false,
      index: 0,
      categoryLists: []
    };
  },
  methods: {
    fetchLatest() {
      this.$store
        .dispatch("fetch_lists", {
          sort: "newest",
          limit: 1
        })
        .then(lists => {
          this.latest = { id: lists[0].id, ...lists[0].data() };
        });
    },
    fetchPopular() {
      this.$store
        .dispatch("fetch_lists", {
          sort: "popularity",
          limit: 1
        })
        .then(lists => {
          this.popular = { id: lists[0].id, ...lists[0].data() };
        });
    },
    fetchTopRated() {
      this.$store
        .dispatch("fetch_lists", {
          limit: 1,
          sort: "rating"
        })
        .then(lists => {
          this.topRated = { id: lists[0].id, ...lists[0].data() };
        });
    },
    async fetchCategoryLists() {
      for (let category of categories) {
        this.$store
          .dispatch("fetch_category_lists", {
            category: category.name,
            limit: 1
          })
          .then(async lists => {
            if (lists.length > 0) {
              let list = await {
                id: lists[0].id,
                ...lists[0].data()
              };
              this.categoryLists.push(list);
            }
          });
      }
    },
    clickItem(i) {
      this.index = i;
    },
    slidePrev() {
      this.$refs.slider.slidePrev();
    },
    slideNext() {
      this.$refs.slider.slideNext();
    },
    categorize() {
      this.$store.dispatch("upload_categories", categories);
    }
  },
  computed: {
    categories() {
      return this.$store.getters.categories;
    }
  },
  created: function() {
    this.$store.dispatch("set_loading", false);
    this.fetchLatest();
    this.fetchPopular();
    this.fetchTopRated();
    this.fetchCategoryLists();
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
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
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
