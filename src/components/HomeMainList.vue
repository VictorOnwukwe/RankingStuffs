<template>
  <div>
    <router-link :to="'/lists/' + list.id" class="no-deco">
      <v-card v-if="list" class="mt grey lighten-4" tile flat>
        <v-card-text class="">
          <v-layout class="">
            <v-flex shrink style="position:relative">
              <m-img
                :src="list.preview_image ? list.preview_image.url.low : false"
                :minWidth="'120px'"
                :maxWidth="'250px'"
                :width="'25vw'"
                class="mr-3"
              ></m-img>
            </v-flex>
            <v-flex class="">
              <h2 class="text-capitalize ptd" style="font-size:1.8em">{{ list.title }}</h2>
              <rating
                class="mb-3"
                :rating="list.rating"
                :ratersCount="list.raters_count"
              ></rating>

              <v-layout
                class="font-weight-bold"
                v-for="(item, index) in items"
                :key="index"
              >
                <div>{{ index + 1 }}&nbsp;</div>
                <div class="text-capitalize">{{ item.data().name }}</div>
              </v-layout>
              <div class="font-weight-black">...</div>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </router-link>
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
    fetchItems() {
      this.$store
        .dispatch("fetch_list_items", { list_id: this.list.id, limit: 3 })
        .then(items => {
          this.items = items;
        });
    }
  },
  created() {
    this.fetchItems();
  }
};
</script>
