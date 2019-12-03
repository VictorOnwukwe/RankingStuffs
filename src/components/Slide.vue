<template>
  <hooper class="hooper" :settings="hooperSettings">
    <slide v-for="list in lists" :key="list.id">
      <v-card flat tile class="slide">
        <router-link :to="'/lists/' + list.id" class="no-deco">
          <v-img v-if="list.data().preview_image" width="100%" class="br elevation-5" :src="list.data().preview_image.url.low"></v-img>
          <v-img width="100%" v-else :src="require('../assets/emptyimage.jpg')"></v-img>
          <div class="detail pa-2">
            <span
              class="ptl text-capitalize"
              style="line-height:1;font-size:1.3em"
              >{{ list.data().title }}</span
            >
          </div>
        </router-link>
      </v-card>
    </slide>

    <hooper-navigation slot="hooper-addons"></hooper-navigation>
  </hooper>
</template>
<script>
import { Hooper, Slide, Navigation as HooperNavigation } from "hooper";
import "hooper/dist/hooper.css";
export default {
  components: {
    Hooper,
    Slide,
    HooperNavigation
  },
  props: {
    lists: Array
  },
  data() {
    return {
      hooperSettings: {
        itemsToShow: 1.8,
        centerMode: true,
        infiniteScroll: true,
        wheelControl: false,
        autoPlay: true,
        playSpeed: 10000,
        breakpoints: {
          350: {
            itemsToShow: 2.1
          },
          400: {
            itemsToShow: 2.3
          },
          450: {
            itemsToShow: 2.6
          },
          500: {
            itemsToShow: 2.8
          },
          550: {
            itemsToShow: 3.1
          },
          600: {
            itemsToShow: 2.6
          },
          650: {
            itemsToShow: 2.35
          },
          700: {
            itemsToShow: 2.6
          },
          750: {
            itemsToShow: 2.7
          },
          800: {
            itemsToShow: 2.8
          },
          850: {
            itemsToShow: 3
          },
          900: {
            itemsToShow: 3
          },
          950: {
            itemsToShow: 3
          },
          1000: {
            itemsToShow: 3.1
          },
          1050: {
            itemsToShow: 3.3
          },
          1100: {
            itemsToShow: 3.4
          },
          1150: {
            itemsToShow: 3.6
          },
          1200: {
            itemsToShow: 3.8
          },
          1250: {
            itemsToShow: 4
          },
          1350: {
            itemsToShow: 4.2
          }
        }
      }
    };
  }
};
</script>
<style scoped>
.detail {
  position: absolute;
  width: 100%;
  bottom: 0;
  height: auto;
  background-color: rgba(0, 0, 0, 0.5);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
.slide {
  /* background: grey; */
  color: white;
  height: 150px;
  width: 150px;
  position: relative;
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
  padding: 0 0.25em;
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
