<template>
  <div>
    <router-link :to="'/lists/' + list.id" class="no-deco">
      <v-card>
        <v-layout class="grey lighten-4">
          <div>
            <v-img
              v-if="list.preview_image"
              :src="list.preview_image.url.low"
              width="30vw"
              min-width="160px"
              max-width="300px"
              aspect-ratio="1.5"
              id="image"
            ></v-img>
            <v-img
              v-else
              min-width="160px"
              max-width="300px"
              aspect-ratio="1.5"
              :src="require('../assets/emptyimage.jpg')"
            ></v-img>
          </div>
          <v-layout class="px-4 py-2" column justify-space-between>
            <v-flex>
              <h2
                class="font-weight-medium text-capitalize"
                style="font-family: 'Oswald', sans-serif"
              >
                {{ list.title }}
              </h2>
              <h4 class="">
                <!-- <span class="htd">Rank: </span> -->
                <span
                  class="font-weight-bold accent--text"
                  style="font-size:1.7em"
                  >#{{ listItem.rank }}</span
                >
                of {{ list.item_count }}
              </h4>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-card>
    </router-link>
  </div>
</template>
<script>
export default {
  props: {
    id: String,
    item: Object
  },
  data() {
    return {
      listItem: {},
      list: {}
    };
  },
  methods: {
    fetchItemRank() {
      this.$store
        .dispatch("fetch_item_rank", { list_id: this.id, item: this.item })
        .then(items => {
          this.listItem = items[0].data();
        });
    }
  },
  created() {
    this.fetchItemRank();
    this.$store.dispatch("fetch_list", this.id).then(list => {
      this.list = list;
    });
  }
};
</script>
