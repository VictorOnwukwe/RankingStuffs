<template>
  <div>
    <v-card>
      <v-card-title>
        Popular Lists
      </v-card-title>
      <v-card-text>
        
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
// import { Carousel3d, Slide } from "vue-carousel-3d";
import { Glide, GlideSlide } from "vue-glide-js";
import { Hooper, Slide } from "hooper";
import "hooper/dist/hooper.css";

export default {
  components: {
    Hooper,
    Slide
  },
  data() {
    return {
      latest: [],
      index: 0,
      hooperSettings: {
        itemsToShow: 8,
        centerMode: true,
        infiniteScroll: true
      }
    };
  },
  computed: {},
  methods: {
    fetchLatest(limit) {
      this.$store
        .dispatch("fetch_latest", {
          timestamp: "now",
          limit: limit
        })
        .then(latest => {
          this.latest = latest;
        });
    },
    clickItem(i) {
      this.index = i;
    },
    slidePrev() {
      this.$refs.slider.slidePrev();
    },
    slideNext() {
      this.$refs.slider.slideNext();
    }
  },
  mounted: function() {
    // this.fetchLatest(3);
  }
};
</script>

<style scoped>
</style>
