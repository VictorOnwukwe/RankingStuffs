<template>
  <div>
    <v-card v-if="list.title" class="mt" tile flat>
      <v-card-text class="px-0">
        <v-layout>
          <v-flex shrink style="position:relative">
            <router-link :to="'/lists/' + list.id" class="no-deco">
              <m-img
                v-if="list.preview_image"
                :src="list.preview_image ? list.preview_image.url.high : false"
                :minWidth="'120px'"
                :maxWidth="'250px'"
                :width="'25vw'"
                class="mr-7"
              ></m-img>
              <m-img
                v-else
                :src="require('../assets/' + list.category + '-low.jpg')"
                :minWidth="'120px'"
                :maxWidth="'250px'"
                :width="'25vw'"
                class="mr-7"
                :aspectRatio="'1'"
              ></m-img>
            </router-link>
          </v-flex>
          <v-flex>
            <h3 class="brand--text text--lighten-3">{{ type }}</h3>
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

            <div
              class="font-weight-bold"
              v-for="(item, index) in list.items"
              :key="index"
            >
              <span>{{ index + 1 }}.&nbsp;</span>
              <span class="text-capitalize font-weight-medium">{{ item.name }}</span>
            </div>
            <div class="ptd mt-4 spacious pre-wrap" v-if="list.description">{{ list.description.slice(0, charCount)
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
