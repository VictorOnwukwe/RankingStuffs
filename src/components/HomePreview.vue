<template>
  <div>
    <div
      class="top-view"
      :style="{
        backgroundImage: `url(${require('../assets/background.jpg')})`,
      }"
    >
      <div
        style="position:absolute;top:0;right:0;bottom:0;left:0;background-color: rgba(0,0,0,0.6)"
      ></div>
      <div class="overlay">
        <v-layout v-if="mounted" column>
          <v-flex xs12 style="margin-bottom:1.5em">
            <splide :options="sideSplide" ref="sideSplide">
              <splide-slide v-for="(list, n) in hotLists" :key="n">
                <div style="position:relative;width:100%;padding-top:115%;">
                  <img
                    v-if="list.preview_image"
                    :src="
                      list.preview_image ? list.preview_image.url.high : false
                    "
                    style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:2"
                  />
                  <img
                    v-else
                    :src="require('../assets/' + list.category + '.jpg')"
                    style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:2"
                  />
                  <v-layout
                    style="position:absolute;top:0;left:0;width:100%;height:100%;border:1px solid white;z-index:1"
                    align-center
                    justify-center
                  >
                    <v-progress-circular
                      :value="20"
                      width="1"
                      indeterminate
                      color="white"
                    ></v-progress-circular>
                  </v-layout>
                </div>
              </splide-slide>
            </splide>
          </v-flex>
          <v-layout>
            <v-flex xs12 sm10 offset-sm1 md8 offset-md2>
              <splide :options="mainSplide" ref="mainSplide">
                <splide-slide
                  @active="transform(n)"
                  v-for="(list, n) in hotLists"
                  :key="n"
                >
                  <div style="position:relative;width:100%;padding-top:110%">
                    <div
                      style="width:100%;position:absolute;top:0;left:0;bottom:0;right:0;z-index:1;display:flex;flex-direction:column"
                      class="slide-overlay"
                    >
                      <router-link :to="`/lists/${list.id}`" class="no-deco">
                        <h1
                          class="ptl overlay-title text-capitalize text-shadow"
                        >
                          {{ list.title }}
                        </h1>
                      </router-link>
                      <v-layout class="mt-5 overlay-details">
                        <v-btn
                          :to="`/categories/${list.category}`"
                          outlined
                          class="mx-auto"
                          color="white"
                          style="background-color:rgba(0,0,0,0.5)"
                          >{{ list.category }}</v-btn
                        >
                      </v-layout>
                    </div>
                    <img
                      v-if="list.preview_image"
                      :src="
                        list.preview_image ? list.preview_image.url.high : false
                      "
                      style="position:absolute;width:100%;top:0;left:0;height:100%;object-fit:cover"
                    >
                    <img
                      v-else
                      :src="require('../assets/' + list.category + '.jpg')"
                      style="position:absolute;width:100%;top:0;left:0;height:100%;object-fit:cover"
                    >
                  </div>
                </splide-slide> </splide></v-flex
          ></v-layout>
        </v-layout>
        <div v-else style="position:relative;" class="my-auto">
          <h1 class="stl center-text welcome text-shadow">WELCOME!</h1>
          <h1 class="stl center-text to text-shadow">To</h1>
          <v-layout justify-center>
            <div>
              <h1
                class="font-weight-bold oswald accent--text ranking text-shadow"
                style="font-size:3.5em"
              >
                Ranking
              </h1>
              <h1
                class="white--text mt-n2 oswald stuffs text-shadow"
                style="font-size:3.5em"
              >
                STUFFS
              </h1>
            </div></v-layout
          >
        </div>
        <div
          style="position:absolute;bottom:0;background-color: rgba(0,0,0,0.5);right:0;left:0;padding: 2px 0;"
          class="under-text"
        >
          <div style="position:relative;overflow:hidden" class="text-house">
            <v-style>
              .text-house > div { animation: slide-text 20s linear infinite;
              animation-fill-mode: backwards; animation-delay: 2.9s;
              white-space: nowrap; position: relative; } @keyframes slide-text {
              0% { left: 100vw; } 100% { left:
              {{ `-${displayText.length * 7.8}px` }}
              }
            </v-style>
            <div class="ptl">
              {{ displayText }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "@splidejs/splide/dist/css/themes/splide-default.min.css";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import Style from "./Style";

export default {
  components: {
    Splide,
    SplideSlide,
    "v-style": Style,
  },
  data() {
    return {
      mainSplide: {
        type: "fade",
        perPage: 1,
        perMove: 1,
        pagination: false,
        arrows: false,
        speed: 500,
        width: "100%",
      },
      sideSplide: {
        type: "loop",
        width: "100%",
        direction: "rtl",
        perPage: 10,
        autoplay: true,
        pagination: false,
        arrows: false,
        isNavigation: true,
        updateOnMove: true,
        focus: "center",
        pauseOnFocus: false,
        pauseOnHover: false,
        breakpoints: {
          600: {
            perPage: 6,
          },
          960: {
            perPage: 8,
          },
        },
      },
      mounted: false,
      displayText:
        "Vote on your favorite Movies, Singers, Footballers, Sports Teams, and more... Share your opinions on your favorites. Create Lists or demand for Lists. Have fun here at Ranking Stuffs...",
    };
  },
  methods: {
    sync() {
      this.$refs.mainSplide.sync(this.$refs.sideSplide.splide);
    },
  },
  watch: {
    hotLists(val) {
      if (this.mounted) return;
      if (val.length > 0) {
        this.mounted = true;
        setTimeout(this.sync, 100);
      }
    },
  },
  computed: {
    hotLists() {
      return this.$store.getters.slideLists;
    },
    currentList() {
      return this.hotLists[this.$refs.mainSplide.index];
    },
  },
  mounted() {
    if (this.hotLists.length > 0) {
      this.mounted = true;
      setTimeout(this.sync, 100);
    }
  },
};
</script>

<style scoped>
.top-view {
  width: 100%;
  min-height: 80vh;
  background-position: center center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  position: relative;
  display: flex;
}
.overlay {
  display: flex;
  align-content: center;
  justify-content: center;
  padding: 4em 2em 3em 2em;
  min-height: 80vh;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
@media (min-width: 1280px) {
  .overlay {
    padding: 4em 0 3em 0;
  }
}
.overlay-title {
  font-size: 2.2em;
  font-family: "Oswald", sans-serif;
  transition: all 0.5s ease;
}
.slide-overlay {
  background: radial-gradient( rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.9));
  padding: 1em;
}
@media (min-width: 600px) {
  .overlay-title {
    font-size: 3.2em;
  }
  .grid {
    grid-template-columns: 3fr 1fr;
  }
  .slide-overlay {
    padding: 2em;
  }
}
@media (min-width: 900px) {
  .overlay-title {
    font-size: 3.8em;
  }
}
.splide--nav > .splide__track > .splide__list > .splide__slide.is-active {
  border: none;
}
.splide--nav > .splide__track > .splide__list > .splide__slide > div {
  opacity: 0.7;
}
.splide--nav > .splide__track > .splide__list > .splide__slide.is-active > div {
  opacity: 1;
}
.splide--fade > .splide__track > .splide__list > .splide__slide .overlay-title {
  transform: translateY(20px);
  opacity: 0;
}
.splide--fade
  > .splide__track
  > .splide__list
  > .splide__slide.is-active
  .overlay-title {
  transform: translateY(0);
  opacity: 1;
}
.overlay-details {
  transition: all 0.7s ease;
}
.splide--fade
  > .splide__track
  > .splide__list
  > .splide__slide
  .overlay-details {
  transform: translateY(20px);
  opacity: 0;
}
.splide--fade
  > .splide__track
  > .splide__list
  > .splide__slide.is-active
  .overlay-details {
  transform: translateY(0);
  opacity: 1;
}
.center-text {
  text-align: center;
}
.welcome {
  animation: enter-top 0.6s cubic-bezier(0.45, 1.71, 0.56, 0.61);
  animation-fill-mode: forwards;
}
@keyframes enter-top {
  0% {
    opacity: 0;
    transform: translateY(-300px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.to {
  animation: enter-bottom 0.6s ease;
  animation-fill-mode: both;
  animation-delay: 0.8s;
}
@keyframes enter-bottom {
  0% {
    opacity: 0;
    transform: translateY(300px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.ranking {
  animation: enter-left 0.6s cubic-bezier(0.45, 1.71, 0.56, 0.61);
  animation-fill-mode: both;
  animation-delay: 1.6s;
}
@keyframes enter-left {
  0% {
    opacity: 0;
    transform: translateX(-400px) scale(0);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}
.stuffs {
  animation: enter-right 0.6s ease;
  animation-fill-mode: both;
  animation-delay: 2.2s;
}
@keyframes enter-right {
  0% {
    opacity: 0;
    transform: translateX(400px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
