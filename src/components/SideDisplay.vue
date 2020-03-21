<template>
  <div>
    <v-card-text
      class="pr-0 py-0"
      :class="$vuetify.breakpoint.xs ? 'px-0 mt-12' : 'pl mt'"
    >
      <div class="">
        <v-card width="100%" flat>
          <v-card-title
            class="text-uppercase font-weight-bold ptd title-text oswald pl-2 pt-0 mb-4"
            style="font-size:1.3em"
          >
            Hot Lists
          </v-card-title>
          <v-card-text class="pl-3 pr-0">
            <div v-if="lists.length > 0">
              <div v-for="(list, index) in lists" :key="index">
                <v-list-item class="pa-0">
                  <v-list-item-avatar tile>
                    <m-img
                      v-if="list.preview_image"
                      :src="list.preview_image.url.low"
                      :width="'60px'"
                      aspect-ratio="1"
                      class="ml-3"
                      :radius="'0'"
                    ></m-img>
                    <m-img
                      v-else
                      :src="require('../assets/' + list.category + '-low.jpg')"
                      :width="'60px'"
                      :aspectRatio="'1'"
                      class="ml-3"
                      :radius="'0'"
                    ></m-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <router-link
                      :to="'/lists/' + list.id"
                      class="no-deco"
                      style="font-size:14px"
                    >
                      <a class="side-text text-capitalize">{{ list.title }}</a>
                    </router-link>
                  </v-list-item-content>
                </v-list-item>
                <v-divider
                  v-if="index !== lists.length - 1"
                  class="my-2 grey lighten-2"
                ></v-divider>
              </div>
            </div>
            <v-layout v-else class="my-4">
              <m-progress></m-progress>
            </v-layout>
          </v-card-text>
        </v-card>
        <v-card class="mt" flat width="100%">
          <v-card-title
            class="text-uppercase font-weight-bold ptd title-text oswald pl-2 mb-4"
            style="font-size:1.3em"
          >
            Hot Demands
          </v-card-title>
          <v-card-text class="pl-2 pr-0">
            <div v-if="demands.length > 0">
              <div v-for="(demand, index) in demands" :key="index">
                <router-link :to="'/demands/' + demand.id" class="no-deco">
                  <a class="side-text text-capitalize" style="font-size:14px">{{
                    demand.title
                  }}</a>
                </router-link>
                <v-divider
                  v-if="index !== demands.length - 1"
                  class="my-2 grey lighten-2"
                ></v-divider>
              </div>
            </div>
            <v-layout v-else class="my-4">
              <m-progress></m-progress>
            </v-layout>
          </v-card-text>
        </v-card>
      </div>
    </v-card-text>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {},
  computed: {
    lists() {
      return this.$store.getters.hotLists;
    },
    demands() {
      return this.$store.getters.hotDemands;
    }
  },
  created() {}
};
</script>
<style scoped>
.side-text {
  color: rgba(0, 0, 0, 0.7);
  display: block;
}
.side-text:hover {
  color: rgba(0, 0, 0, 0.87);
}
</style>
