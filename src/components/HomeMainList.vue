<template>
  <div>
    <v-card v-if="list.title" class="mt grey lighten-4 elevation-1" tile flat>
      <v-card-text>
        <v-layout>
          <v-flex shrink style="position:relative">
            <m-img
              :src="list.preview_image ? list.preview_image.url.low : false"
              :minWidth="'120px'"
              :maxWidth="'250px'"
              :width="'25vw'"
              class="mr-3"
            ></m-img>
          </v-flex>
          <v-flex>
            <h3 class="brand--text">{{ type }}</h3>
            <router-link :to="'/lists/' + list.id" class="no-deco">
              <h2
                class="text-capitalize ptd"
                style="font-size:1.8em;font-family: 'Oswald', sans-serif"
              >
                {{ list.title }}
              </h2>
            </router-link>
            <rating
              class="mb-3"
              :rating="list.rating"
              :ratersCount="list.raters_count"
            ></rating>

            <v-layout
              class="font-weight-bold"
              v-for="(item, index) in list.items"
              :key="index"
            >
              <div>{{ index + 1 }}&nbsp;</div>
              <div class="text-capitalize">{{ item.data().name }}</div>
            </v-layout>
            <div class="ptd mt-4 pre-wrap">{{ list.description.slice(0, charCount)
              }}{{ list.description.length > charCount ? "..." : ""
              }}<router-link
                :to="'/lists/' + list.id"
                v-if="list.description.length > charCount"
                class="no-deco"
                >read more</router-link
              >
            </div>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-card v-else flat class="loading mt elevation-1" height="250px"></v-card>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Object,
      default: () => {}
    },
    type: String
  },
  data() {
    return {};
  },
  computed: {
    charCount() {
      return this.$vuetify.breakpoint.smAndDown ? 100 : 200;
    }
  }
};
</script>
