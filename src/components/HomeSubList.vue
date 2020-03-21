<template>
  <div>
    <!-- <v-layout justify-center class="mb-2">
      <router-link
        :to="'/categories/' + list.category"
        class="no-deco mx-auto"
        style=""
      >
        <div
          class="font-weight-medium pa-2 blue--text text-uppercase cat-name"
          style=""
        >
          {{ list.category }}
        </div>
      </router-link>
    </v-layout> -->
    <div style="border-radius:3px" class="">
      <router-link :to="'/lists/' + list.id" class="no-deco">
        <v-hover v-slot:default="{ hover }">
          <v-card :flat="!hover" tile>
            <div class="img-overlay pa-2">
              <router-link
                :to="'/categories/' + list.category"
                class="no-deco mx-auto"
                style=""
              >
                <div
                  class="font-weight-medium pa-2 text-uppercase cat-name"
                  style=""
                >
                  {{ list.category }}
                </div>
              </router-link>
              <!-- <div>
              <h2
                class="text-capitalize white--text font-weight-medium"
                style="font-family: 'Oswald', sans-serif;font-size:1.8em"
              >
                {{ list.title }}
              </h2>
            </div> -->
            </div>
            <v-card
              :style="
                $vuetify.breakpoint.xs
                  ? 'min-width:calc(100% + 1em);margin-left:-0.5em'
                  : null
              "
              flat
            >
              <m-img
                v-if="list.preview_image"
                :src="list.preview_image ? list.preview_image.url.high : false"
                :width="'100%'"
                :aspectRatio="'1.5'"
                :radius="'0'"
              ></m-img>
              <m-img
                v-else
                :src="require('../assets/' + list.category + '-low.jpg')"
                :width="'100%'"
                :aspectRatio="'1.5'"
                :radius="'0'"
              ></m-img>
            </v-card>
            <v-card flat tile>
              <div style="">
                <div
                  class="text-capitalize std oswald px-2 py-2"
                  style="font-size:1.2em"
                >
                  {{ list.title }}
                </div>
              </div>
            </v-card>
          </v-card>
        </v-hover>
      </router-link>
      <!-- <div class="">
        <div v-if="list.items.length > 0">
          <div
            v-for="(item, index) in list.items"
            :key="index"
            align-center
            style="display:flex;align-items:center"
          >
            <div
              class="px-3 py-1 mr-2 grey lighten-4 font-weight-black"
              style="display:inline-block"
              :class="{
                'golden-text': index == 0,
                'silver-text': index == 1,
                'bronze-text': index == 2
              }"
            >
              #{{ index + 1 }}
            </div>
            <div
              class="font-weight-medium text-capitalize"
              style="overflow:hidden;flex:1;text-overflow:ellipsis;white-space:nowrap"
            >
              {{ item.data().name }}
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Object,
      default: () => {}
    }
  }
};
</script>
<style scoped>
.img-overlay {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}
.cat-name {
  border: 1px solid white;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  color: white;
  transition: all 0.2s ease-in;
}
.cat-name:hover {
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--accent);
}
</style>
