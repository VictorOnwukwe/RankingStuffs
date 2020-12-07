<template>
  <div>
    <div style="border-radius:3px" class="cat-main">
      <router-link :to="'/lists/' + list.id" class="no-deco">
        <v-card flat tile>
          <div class="img-overlay pa-2">
            <v-btn
              :to="'/categories/' + list.category"
              outlined
              class="cat-name"
            >
              {{ list.category }}</v-btn
            >
          </div>
          <div
            :style="
              $vuetify.breakpoint.xs
                ? 'min-width:calc(100% + 1em);margin-left:-0.5em'
                : null
            "
            style="overflow:hidden"
          >
            <m-img
              v-if="list.preview_image"
              :src="list.preview_image ? list.preview_image.url.high : false"
              :width="'100%'"
              :aspectRatio="'1.5'"
              :radius="'0'"
              class="img"
            ></m-img>
            <m-img
              v-else
              :src="require('../assets/' + list.category + '-low.jpg')"
              :width="'100%'"
              :aspectRatio="'1.5'"
              :radius="'0'"
              class="img"
            ></m-img>
          </div>
          <v-card flat tile>
            <div style="">
              <div
                class="text-capitalize font-weight-medium ptd py-2"
                style="font-size:1em"
              >
                {{ list.title }}
              </div>
            </div>
          </v-card>
        </v-card>
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: Object,
  },
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
  justify-content: center;
  overflow: hidden;
}
.cat-name {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  transition: all 0.3s ease;
}
.img {
  transition: transform 0.3s ease;
}
.cat-main:hover .img {
  transform: scale(1.2);
}
.cat-main:hover .cat-name {
  border: 1px solid var(--accent);
  color: var(--accent);
}
</style>
