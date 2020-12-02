<template>
  <div>
    <div class="top-view">
      <img
        :src="
          $vuetify.breakpoint.smAndUp
            ? require('../assets/background.jpg')
            : require('../assets/background-low.jpg')
        "
        style="object-fit:cover; width:100%;height:100%"
        class="my-auto"
      />
      <div class="overlay">
        <div class="grid" style="width:100%">
          <div class="grid-main">
            <splide :options="mainSplide" ref="mainSplide">
              <splide-slide
                :id="`main${n}`"
                @active="transform(n)"
                v-for="(list, n) in hotLists"
                :key="n"
              >
                <div
                  style="width:100%;padding-top:100%;display:flex;position:relative;box-shadow: 0 0 20px rgba(0,0,0,0.8)"
                >
                  <div
                    style="width:100%;position:absolute;top:0;left:0;bottom:0;right:0;z-index:1;padding:2em"
                    class="slide-overlay"
                  >
                    <h1 class="ptl overlay-text text-capitalize">
                      {{ list.title }}
                    </h1>
                  </div>
                  <v-img
                    v-if="list.preview_image"
                    :src="
                      list.preview_image ? list.preview_image.url.high : false
                    "
                    aspect-ratio="1"
                    width="100%"
                    style="position:absolute;top:0;left:0;"
                  ></v-img>
                  <v-img
                    v-else
                    :src="require('../assets/' + list.category + '.jpg')"
                    width="100%"
                    aspect-ratio="1"
                    style="width:100%;position:absolute;top:0;left:0;"
                  ></v-img>
                </div>
              </splide-slide>
            </splide>
          </div>
          <div class="sub" v-if="$vuetify.breakpoint.smAndUp">
            <splide :options="sideSplide" ref="sideSplide">
              <splide-slide
                v-for="(list, n) in hotLists"
                :key="n"
                style="overflow:hidden"
              >
                <v-img
                  v-if="list.preview_image"
                  :src="
                    list.preview_image ? list.preview_image.url.high : false
                  "
                  width="100%"
                  height="100%"
                ></v-img>
                <v-img
                  v-else
                  :src="require('../assets/' + list.category + '.jpg')"
                  width="100%"
                  height="100%"
                ></v-img>
              </splide-slide>
            </splide>
            <div
              style="overflow:hidden"
              class="mt-4 ptl list-details"
              v-if="this.$refs.mainSplide"
            >
              <div
                style="display:flex"
                v-for="(item, n) in currentList.items"
                :key="n"
              >
                <div
                  style="min-width:20px;"
                  :class="{
                    'golden-text': n == 0,
                    'silver-text': n == 1,
                    'bronze-text': n == 2,
                  }"
                >
                  {{ n + 1 }}.
                </div>
                <div
                  style=""
                >
                  <span>{{ item.name }}</span>
                </div>
              </div>
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

export default {
  components: {
    Splide,
    SplideSlide,
  },
  data() {
    return {
      mainSplide: {
        type: "fade",
        perPage: 1,
        perMove: 1,
        pagination: false,
        lazyLoad: "nearby",
        arrows: false,
        autoplay: true,
        breakpoints: {
          600: {
            autoplay: false,
          },
        },
      },
      sideSplide: {
        type: "loop",
        height: "calc(100% + 20px)",
        width: "100%",
        direction: "ttb",
        perPage: 2,
        autoplay: true,
        cover: true,
        pagination: false,
        arrows: false,
        isNavigation: true,
        updateOnMove: true,
        focus: "center",
      },
    };
  },
  methods: {},
  computed: {
    hotLists() {
      return this.$store.getters.categoryLists;
    },
    currentList() {
      return this.hotLists[this.$refs.mainSplide.index];
    },
  },
  mounted() {
    this.$vuetify.breakpoint.smAndUp
      ? this.$refs.mainSplide.sync(this.$refs.sideSplide.splide)
      : null;
  },
};
</script>

<style scoped>
.top-view {
  width: 100%;
  /* margin-left: -0.5em; */
  min-height: 80vh;
  /* height: 80vh; */
  background-position: center center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: contain;
  position: relative;
  display: flex;
  overflow: hidden;
}
.overlay {
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-content: center;
  justify-content: center;
  padding: 6.5em 2em 3em 2em;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.foreground {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.display-container {
  width: 100%;
  margin-top: 2em;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1em;
  max-width: 600px;
}
.display {
  width: 100%;
  padding: 1em;
  background-color: rgba(255, 255, 255, 0);
  border-radius: 8px;
}
.header {
  color: rgba(255, 255, 255, 0.87);
  text-align: center;
  font-size: 1.4em;
  border-bottom: 2px solid rgba(255, 255, 255, 0.5);
  transition: 0.2s ease-in;
  display: block;
}
.header:hover {
  color: var(--accent);
  border-bottom: 2px solid var(--accent);
}
.list-details * {
  animation: enter 0.5s ease;
}
@media (min-width: 800px) {
  .display-container {
    grid-gap: 3em;
  }
}
.grid {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 2em;
}
.grid > .grid-main {
  grid-row: span 2;
}
.grid > .grid-main {
  overflow: hidden;
}
.overlay-text {
  animation: enter 0.5s ease;
  font-size: 2em;
  font-family: "Oswald", sans-serif;
}
@media (min-width: 600px) {
  .overlay-text {
    font-size: 3em;
  }
  .grid {
    grid-template-columns: 3fr 1fr;
  }
}
.slide-overlay {
  background: radial-gradient(
    circle,
    rgba(20, 20, 20, 0),
    rgba(20, 20, 20, 0.9)
  );
}
@keyframes enter {
  0% {
    transform: translateY(30px);
  }
  100% {
    transform: translateY(0);
  }
}
.splide--nav > .splide__track > .splide__list > .splide__slide.is-active {
  border-color: rgba(255, 255, 255, 0.5);
  opacity: 1;
}
</style>
