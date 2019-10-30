<template>
  <div>
    <v-card class="mt-4" flat>
      <v-card-title class="text-uppercase font-weight-thin">Popular</v-card-title>
      <v-card-text class="pa-0">
        <hooper @beforeSlide="fetchMoreLatest" class="hooper" :settings="hooperSettings">
          <slide v-for="n in 10" :key="n">
            <v-card tile class="slide">Slide {{n}}</v-card>
          </slide>

          <hooper-navigation slot="hooper-addons"></hooper-navigation>
        </hooper>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <span class="accent--text pointer underline">See More</span>
        <v-icon size="1.2em" color="accent">mdi-arrow-right</v-icon>
      </v-card-actions>
    </v-card>
    <v-card flat class="mt-4">
      <v-card-title class="text-uppercase font-weight-thin">Latest</v-card-title>
      <v-card-text class="pa-0">
        <hooper @beforeSlide="fetchMorePopular" class="hooper" :settings="hooperSettings">
          <slide v-for="n in 10" :key="n">
            <v-card tile class="slide">Slide {{n}}</v-card>
          </slide>

          <hooper-navigation slot="hooper-addons"></hooper-navigation>
        </hooper>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <span class="accent--text pointer underline">See More</span>
        <v-icon size="1.2em" color="accent">mdi-arrow-right</v-icon>
      </v-card-actions>
    </v-card>
    <v-card flat class="mt-4">
      <v-card-title class="text-uppercase font-weight-thin">Top Rated</v-card-title>
      <v-card-text class="pa-0">
        <hooper class="hooper" :settings="hooperSettings">
          <slide v-for="n in 10" :key="n">
            <v-card tile class="slide">Slide {{n}}</v-card>
          </slide>

          <hooper-navigation slot="hooper-addons"></hooper-navigation>
        </hooper>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <span class="accent--text pointer underline">See More</span>
        <v-icon size="1.2em" color="accent">mdi-arrow-right</v-icon>
      </v-card-actions>
    </v-card>

    <v-card flat class="mt-4">
      <v-card-title class="text-uppercase font-weight-thin">Happening Now</v-card-title>
      <v-card-text>
        <happening></happening>
      </v-card-text>
    </v-card>

    <!-- <v-card flat class="mt-4">
      <v-card-title>Categories</v-card-title>
      <v-card-text>
        <div v-masonry transition-duration="0.2s" item-selector=".item">
          <div v-masonry-tile class="item" v-for="(category, index) in categories" :key="index">
            <a class="text-uppercase underline font-weight-bold primary-text-dark">
              {{category.name}}
              <br />
            </a>
            <div>
              <a v-for="(sub, id) in category.subs" :key="id" class="text-capitalize underline primary-text-dark">
                {{sub.name}}&nbsp;({{sub.count}})
                <br />
              </a>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card> -->
    <v-btn v-if="false" @click="categorize()">Categorize</v-btn>
  </div>
</template>

<script>
// import { Carousel3d, Slide } from "vue-carousel-3d";
import { Glide, GlideSlide } from "vue-glide-js";
import { Hooper, Slide, Navigation as HooperNavigation } from "hooper";
import "hooper/dist/hooper.css";
import categories from "../../public/my-modules/categories";
import Masonry from "vue-masonry-css";
import HappeningNow from "./HappeningNow";

export default {
  components: {
    Hooper,
    Slide,
    HooperNavigation,
    Masonry,
    'happening': HappeningNow
  },
  data() {
    return {
      latest: [],
      popular: [],
      index: 0,
      hooperSettings: {
        itemsToShow: 1.8,
        centerMode: true,
        infiniteScroll: true,
        wheelControl: false,
        breakpoints: {
          350:{
            itemsToShow: 2
          },
          400:{
            itemsToShow: 2.25
          },
          450:{
            itemsToShow: 2.5
          },
          500:{
            itemsToShow: 2.75
          },
          550:{
            itemsToShow: 3
          },
          650:{
            itemsToShow: 3
          },
          700:{
            itemsToShow: 3.25
          },
          750:{
            itemsToShow: 3.5
          },
          800:{
            itemsToShow: 3.75
          },
          850:{
            itemsToShow: 4
          },
          900:{
            itemsToShow: 4.25
          },
          950:{
            itemsToShow: 4.5
          },
          1000:{
            itemsToShow: 4.75
          },
          1050:{
            itemsToShow: 4.5
          },
          1100:{
            itemsToShow: 4.25
          },
          1150:{
            itemsToShow: 4.75
          },
          1200:{
            itemsToShow: 5
          },
          1250:{
            itemsToShow: 5.5
          }
        }
      }
    };
  },
  methods: {
    fetchLatest() {
      this.$store
        .dispatch("fetch_latest", {
          timestamp: "now",
          limit: 10,
          home: true
        })
        .then(latest => {
          this.latest = latest;
        });
    },
    fetchMoreLatest(payload){
      if(payload.currentSlide !== this.latest.length -2){
        return;
      }
      this.$store.dispatch("fetch_latest", {
        timestamp: this.latest[this.latest.length - 1].created,
        limit: 5,
        home:true
      })
      .then(lists => {
        this.latest = this.latest.concat(lists);
      })
    },
    fetchPopular(){
      this.$store.dispatch("fetch_popular", {
        limit: 10,
        home: true
      })
    },
    fetchMorePopular(payload){
      if(payload.currentSlide !== this.popular.length -2){
        return;
      }
      this.$store.dispatch("fetch_popular", {
        lastDoc: this.popular[this.popular.length - 1],
        limit: 5,
        home: true
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
    categorize(){
      this.$store.dispatch("upload_categories", categories);
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
.slide {
  background: grey;
  color: white;
  height: 150px;
  width: 150px;
}
.hooper {
  height: 150px;
  display: flex;
  justify-content: center;
}
@media (min-width: 650px) {
  .slide {
    height: 180px;
    width: 180px;
  }
  .hooper {
    height: 180px;
  }
}
@media (min-width: 950px) {
  .slide {
    height: 200px;
    width: 200px;
  }
  .hooper {
    height: 200px;
  }
}
.item {
  width: 50%;
  margin-top: 1em;
  padding:0 0.25em;
  justify-self: center;
}
@media (min-width: 650px) {
  .item {
    width: 33.3%;
  }
}
@media (min-width: 800px) {
  .item {
    width: 25%;
  }
}
@media (min-width: 1000px) {
  .item {
    width: 20%;
  }
}
@media (min-width: 1200px) {
  .item {
    width: 16.6%;
  }
}
</style>
