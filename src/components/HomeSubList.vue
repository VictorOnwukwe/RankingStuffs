<template>
  <div>
    <div style="border:1px solid rgba(0,0,0,0.2);border-radius:3px" class="">
      <router-link :to="'/lists/' + list.id" class="no-deco">
        <v-card flat>
          <div class="img-overlay pa-2">
            <router-link
              :to="'/categories/' + list.category"
              class="no-deco mx-auto"
            >
              <div
                class="font-weight-medium pa-2 white--text text-uppercase cat-name"
              >
                {{ list.category }}
              </div>
            </router-link>
            <div>
              <h2 class="text-capitalize white--text font-weight-medium">
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
        <div v-if="items.length > 0">
          <div
            v-for="(item, index) in items"
            :key="index"
            align-center
            style="display:flex;align-items:center"
          >
            <div
              class="px-2 py-1 white--text mr-2"
              style="display:inline-block"
              :class="{
                golden: index == 0,
                silver: index == 1,
                bronze: index == 2
              }"
            >
              {{ index + 1 }}
            </div>
            <div
              class="font-weight-bold text-capitalize"
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
      default: false
    }
  },
  data() {
    return {
      items: []
    };
  },
  methods: {
    async fetchItems() {
      this.items = await this.$store.dispatch("fetch_list_items", {
        list_id: this.list.id,
        limit: 3
      });
    }
  },
  created() {
    this.fetchItems();
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
}
.cat-name {
  border: 1px solid white;
  cursor: pointer;
}
.cat-name:hover {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
