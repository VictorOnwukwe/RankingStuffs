<template>
  <div>
    <div id="top-container">
      <div id="title">
        <div>
          <div id="title-header">
            <div style="display:flex; align-items:center">
              <div>----</div>
            </div>
            <div class="center-text" style="background-color:#010B18; padding:0.5em">
              <span class="title-header">WHERE ALL YOUR OPINIONS MATTER</span>
            </div>
            <div style="display:flex;  align-items:center">
              <div>----</div>
            </div>
          </div>
          <br />
          <div class="center-text">
            <span
              id="title-intro"
            >Join us in creating the World's Largest Top Ten Repository... We are ready to meet your needs</span>
          </div>
        </div>
      </div>
      <div id="content">
        <div>
          <v-icon id="chevron-left" class="chevron-head" @click="slidePrev">mdi-chevron-left</v-icon>
        </div>
        <hooper ref="slider" id="hooper" :settings="hooperSettings" style>
          <slide id="slide" v-for="i in 12" :key="i">
            <div id="slide-child" style>
              <div id="preview-image">Slide {{i}}</div>
            </div>
          </slide>
        </hooper>
        <div>
          <v-icon id="chevron-right" class="chevron-head" @click="slideNext">mdi-chevron-right</v-icon>
        </div>
      </div>
      <div id="cta-menu">
        <div>
          <button id="legend-btn">BECOME A LEGEND</button>
        </div>
        <div style="width:100%; display:flex; justify-content:center">
          <div id="search-container">
            <input id="search-bar" type="search" />
            <v-icon id="search-icon" color="orange">mdi-magnify</v-icon>
          </div>
        </div>
      </div>
    </div>
    <div style="display:flex; margin-top:1em; position:relative">
      <div style="position:relative">
        <Sidebar></Sidebar>
      </div>
      <router-view id="router-view"></router-view>
    </div>
  </div>
</template>

<script>
import Toolbar from "./Toolbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { coverflow } from "vue-coverflow";
// import { Carousel3d, Slide } from "vue-carousel-3d";
import { Glide, GlideSlide } from "vue-glide-js";
import { Hooper, Slide } from "hooper";
import "hooper/dist/hooper.css";

export default {
  components: {
    Toolbar,
    Sidebar,
    Footer,
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
          console.log(this.latest);
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
h2 {
  text-justify: center;
}
.center-text {
  text-align: center;
}
#router-view {
}
#top-container {
  width: calc(100% + 1em);
  height: calc(100vh - 70px);
  background-image: linear-gradient(90deg, rgb(5, 26, 53), rgb(8, 47, 99));
  margin-left: -0.5em;
  margin-top: -1em;
  display: flex;
  flex-direction: column;
  padding: 1em 0;
}
@media (min-width: 480px) {
  #top-container {
    margin-left: -1em;
    width: calc(100% + 2em);
  }
}
#content {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
  position: relative;
}
#content:hover .chevron-head {
  display: block;
}
#title {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
#title-header {
  font-size: 1.6em;
  color: hsl(60, 97%, 40%);
  font-family: "Shadows Into Light", cursive;
  font-weight: bold;
  letter-spacing: 0.0001em;
  display: flex;
  margin-bottom: 0.6em;
}
.title-header {
  color: hsl(60, 97%, 40%);
  background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/990140/download.png) -20px -20px
    no-repeat;
  /* background: var(--accent); */
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
}
#title-intro {
  color: var(--primary);
}
#title > div {
  display: flex;
  flex-direction: column;
  align-items: center;
}
#cta-menu {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
#preview-image {
  width: 200px;
  height: 200px;
  border-radius: 0.2em;
  background-color: gray;
}
#hooper {
  height: 200px;
  width: calc(1600px + 13em);
  position: absolute;
}
#slide-child {
  width: 100%;
  display: flex;
  justify-content: center;
}
#slide.is-current {
  color: white;
}
#legend-btn {
  background-color: orange;
  padding: 0.5em 1.5em;
  border-radius: 0.2em;
  margin-top: 1em;
}
#search-container {
  margin-top: 1em;
  width: 40%;
  min-width: 340px;
  position: relative;
}
#search-bar {
  border: 1px solid orange;
  border-radius: 0.2em;
  height: 3em;
  width: 100%;
  padding: 0.5em;
  color: aliceblue;
}
#search-icon {
  position: absolute;
  right: 0.2em;
  top: 0.5em;
}
.chevron-head {
  position: absolute;
  z-index: 2;
  color: orange;
  transform: scale(1.5);
  top: 90px;
  display: none;
}
#chevron-left {
  left: 1em;
  animation: slide-in-left 0.1s linear;
}
#chevron-right {
  right: 1em;
  animation: slide-in-right 0.1s linear;
}

@keyframes slide-in-left {
  0% {
    opacity: 0.7;
    transform: translateX(-1em);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes slide-in-right {
  0% {
    opacity: 0.7;
    transform: translateX(1em);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
