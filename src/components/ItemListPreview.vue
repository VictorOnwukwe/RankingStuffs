<template>
  <div>
    <v-card v-if="fetched" flat width="100%">
      <v-card-text class="pa-0">
        <v-layout>
          <v-flex shrink pr-2>
            <m-img
              v-if="list.preview_image"
              :src="list.preview_image ? list.preview_image.url.low : false"
              :minWidth="'100px'"
              :maxWidth="'120px'"
              width="10vw"
              :aspectRatio="'1'"
            ></m-img>
            <m-img
              v-else
              :src="require('../assets/' + list.category + '-low.jpg')"
              :minWidth="'100px'"
              :maxWidth="'120px'"
              width="10vw"
              :aspectRatio="'1'"
            ></m-img>
          </v-flex>
          <v-flex>
            <v-card height="100%" flat>
              <v-layout class="pl-2" column justify-space-between>
                <v-flex>
                  <router-link :to="'/lists/' + list.id" class="no-deco">
                    <h2
                      class="font-weight-medium text-capitalize std"
                      style="font-family: 'Oswald', sans-serif"
                    >
                      {{ list.title }}
                    </h2>
                  </router-link>
                  <div v-if="!related">
                    <span class="ptd subtitle-2">
                      {{ listItem.upvotes }}
                      {{ listItem.upvotes > 1 ? "upvotes" : "upvote" }}
                      <span class="htd">|</span> {{ listItem.downvotes }}
                      {{ listItem.downvotes > 1 ? "downvotes" : "downvote" }}
                    </span>
                    <h4>
                      <span
                        class="font-weight-bold accent--text"
                        style="font-size:1.7em"
                        >#{{ listItem.rank }}</span
                      >
                      of {{ list.item_count }}
                    </h4>
                  </div>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
        <!-- <div v-if="list.description && !sub" class="mt-3">
            <v-layout class="mt-2">
              <v-flex shrink>
                <dp class="mr-2" v-if="user" :src="user.profile_pic"></dp>
              </v-flex>
              <v-flex shrink>
                <username v-if="user" :user="user"></username
              ></v-flex>
            </v-layout>
            <div v-if="list.description" class="ptd">{{ !more ? list.description.slice(0, 200) : list.description }}
              <span
                @click="more = !more"
                class="brand--text pointer"
                v-if="list.description.length > 200"
                >...{{ !more ? "see more" : "see less" }}</span
              >
            </div> -->
        <!-- </div> -->
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  props: {
    id: String,
    item: Object,
    related: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      listItem: {},
      list: {},
      fetched: false,
    };
  },
  methods: {
    fetchItemRank() {
      this.$store
        .dispatch("fetch_item_rank", { list_id: this.id, item: this.item })
        .then((item) => {
          this.listItem = item;
        });
    },
  },
  created() {
    this.$store.dispatch("fetch_list", this.id).then((list) => {
      this.list = list;
      this.fetched = true;
    });
    if (!this.related) this.fetchItemRank();
  },
};
</script>
