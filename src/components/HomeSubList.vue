<template>
  <div>
    <v-layout justify-center class="mb-2">
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
    </v-layout>
    <div style="border:1px solid rgba(0,0,0,0.2);border-radius:3px" class="">
      <router-link :to="'/lists/' + list.id" class="no-deco">
        <v-card flat>
          <div class="img-overlay pa-2">
            <!-- <router-link
              :to="'/categories/' + list.category"
              class="no-deco mx-auto"
              style=""
            >
              <div
                class="font-weight-medium pa-2 white--text text-uppercase cat-name"
                style=""
              >
                {{ list.category }}
              </div>
            </router-link> -->
            <div>
              <h2
                class="text-capitalize white--text font-weight-medium"
                style="font-family: 'Oswald', sans-serif;font-size:1.8em"
              >
                {{ list.title }}
              </h2>
            </div>
          </div>
          <m-img
            :src="list.preview_image ? list.preview_image.url.low : false"
            :width="'100%'"
            class=""
            :aspectRatio="'1.5'"
          ></m-img>
        </v-card>
      </router-link>
      <div class="">
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
      </div>
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
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}
.cat-name {
  border: 1px solid rgb(73, 169, 245);
  cursor: pointer;
}
.cat-name:hover {
  background-color: rgba(73, 169, 245, 0.1);
}
</style>
