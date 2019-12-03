<template>
  <div>
    <v-card flat class="mt" tile>
      <v-card-title class="text-uppercase font-weight-bold title-text grey lighten-3 black--text">Happening Now</v-card-title>
      <v-card-text class="px-2">
        <happening></happening>
      </v-card-text>
    </v-card>
    <v-card class="mt" flat tile>
      <v-card-title class="text-uppercase font-weight-bold grey lighten-3 title-text black--text">
        Popular
        <v-spacer></v-spacer>
        <router-link :to="'/popular-lists'" class="pointer underline text-capitalize std no-deco">See More</router-link>
        <v-icon size="1.2em" class="std">mdi-chevron-right</v-icon>
      </v-card-title>
      <v-card-text class="pa-0 mt-4">
        <Slide :lists="populars"></Slide>
      </v-card-text>
    </v-card>
    <v-card flat class="mt" tile>
      <v-card-title class="text-uppercase grey lighten-3 font-weight-bold title-text black--text">
        Latest
        <v-spacer></v-spacer>
        <router-link :to="'/latest-lists'" class="pointer underline text-capitalize std no-deco">See More</router-link>
        <v-icon size="1.2em" class="std">mdi-chevron-right</v-icon>
      </v-card-title>
      <v-card-text class="pa-0 mt-4">
        <Slide :lists="latests"></Slide>
      </v-card-text>
    </v-card>
    <v-card flat class="mt" tile>
      <v-card-title class="text-uppercase font-weight-bold grey lighten-3 title-text black--text">
        Top Rated
        <v-spacer></v-spacer>
        <router-link :to="'/top-rated-lists'" class="pointer underline text-capitalize std no-deco">See More</router-link>
        <v-icon size="1.2em" class="std">mdi-chevron-right</v-icon>
      </v-card-title>
      <v-card-text class="pa-0 mt-4">
        <Slide :lists="topRateds"></Slide>
      </v-card-text>
    </v-card>

    <v-btn v-if="false" @click="categorize()">Categorize</v-btn>
  </div>
</template>

<script>
// import { Carousel3d, Slide } from "vue-carousel-3d";
import { Glide, GlideSlide } from "vue-glide-js";
import categories from "../../public/my-modules/categories";
import HappeningNow from "./HappeningNow";
import Slide from "./Slide";

export default {
  components: {
    Slide,
    happening: HappeningNow
  },
  data() {
    return {
      latests: [],
      populars: [],
      topRateds: [],
      index: 0
    };
  },
  methods: {
    fetchLatest() {
      this.$store
        .dispatch("fetch_latest", {
          timestamp: "now",
          limit: 10
        })
        .then(lists => {
          this.latests = lists;
        });
    },
    fetchMoreLatest(payload) {
      if (payload.currentSlide !== this.latests.length - 2) {
        return;
      }
      this.$store
        .dispatch("fetch_latest", {
          timestamp: this.latest[this.latests.length - 1].created,
          limit: 5,
          home: true
        })
        .then(lists => {
          this.latests = this.latest.concat(lists);
        });
    },
    fetchPopular() {
      this.$store.dispatch("fetch_popular", {
        limit: 10,
      }).then(lists => {
        this.populars = lists;
      })
    },
    fetchMorePopular(payload) {
      if (payload.currentSlide !== this.populars.length - 2) {
        return;
      }
      this.$store.dispatch("fetch_popular", {
        lastDoc: this.populars[this.populars.length - 1],
        limit: 5,
        home: true
      });
    },
    fetchTopRated() {
      this.$store.dispatch("fetch_top_rated", {
        limit: 10,
      }).then(lists => {
        this.topRateds = lists;
      })
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
      this.$store.dispatch("convert_keywords", categories);
    }
  },
  computed: {
    categories() {
      return this.$store.getters.categories;
    }
  },
  mounted: function() {
    // this.fetchLatest(3);
    this.$store.dispatch("set_loading", false);
    Promise.all([this.fetchLatest(), this.fetchPopular(), this.fetchTopRated()]);
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
</style>
