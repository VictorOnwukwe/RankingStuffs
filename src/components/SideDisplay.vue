<template>
  <div id="side-display">
    <v-card-text
      class="pr-0 py-0"
      :class="$vuetify.breakpoint.smAndDown ? 'px-0' : 'pl pr-2'"
    >
      <v-divider
        v-if="$vuetify.breakpoint.smAndDown"
        class="mb-3 grey"
      ></v-divider>
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
                <v-layout align-start>
                  <m-img
                    v-if="list.preview_image"
                    :src="list.preview_image.url.low"
                    :width="'3em'"
                    aspect-ratio="1"
                    class="mr-3"
                    :radius="'0'"
                  ></m-img>
                  <m-img
                    v-else
                    :src="require('../assets/' + list.category + '-low.jpg')"
                    :width="'3em'"
                    :aspectRatio="'1'"
                    class="mr-3"
                    :radius="'0'"
                  ></m-img>
                  <router-link
                    :to="'/lists/' + list.id"
                    class="no-deco"
                    style="font-size:14px"
                  >
                    <a class="side-text text-capitalize">{{ list.title }}</a>
                  </router-link>
                </v-layout>
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
    },
  },
  created() {},
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
#side-display::scrollbar-track {
  background-color: rgba(255, 255, 255, 0);
}

#side-display::scrollbar {
  width: 3px;
  position: absolute;
}

#side-display::scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0);
  border-radius: 3px;
}
#side-display:hover::scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0);
  border-radius: 3px;
}
#side-display::-webkit-scrollbar-track {
  background-color: rgba(255, 255, 255, 0);
}

#side-display::-webkit-scrollbar {
  width: 3px;
  position: absolute;
}

#side-display::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0);
  border-radius: 3px;
}
#side-display:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
#side-display::-moz-scrollbar-track {
  background-color: rgba(255, 255, 255, 0);
}

#side-display::-moz-scrollbar {
  width: 3px;
  position: absolute;
}

#side-display::-moz-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0);
  border-radius: 3px;
}
#side-display:hover::-moz-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
</style>
