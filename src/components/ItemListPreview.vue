<template>
  <div>
    <router-link :to="'/lists/' + list.id" class="no-deco">
      <v-card>
        <v-layout>
          <div>
            <v-img
              v-if="list.preview_image"
              :src="list.preview_image.url.low"
              min-width="250px"
              max-width="250px"
              aspect-ratio="1.5"
              id="image"
            ></v-img>
            <v-img
              v-else
              min-width="100px"
              max-width="150px"
              :src="require('../assets/emptyimage.jpg')"
            ></v-img>
          </div>
          <v-layout class="pa-4" column justify-space-between>
            <v-flex>
              <h3 class="font-weight-medium">
                <span class="text-capitalize">{{
                  list.title
                }}</span>
              </h3>
              <h4 class="">
                  <!-- <span class="htd">Rank: </span> -->
                <span class="font-weight-bold accent--text">#{{ listItem.rank }}</span> of {{list.item_count}}
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
