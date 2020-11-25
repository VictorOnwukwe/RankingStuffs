<template>
  <div>
    <div v-if="fetched">
      <v-list-item>
        <v-list-item-avatar
          v-if="item.data().image || info.image"
          :size="$vuetify.breakpoint.xs ? 80 : 120"
          tile
        >
          <m-img
            :width="$vuetify.breakpoint.xs ? '80' : '120'"
            v-if="item.data().image"
            :src="item.data().image.url"
            :radius="'0'"
          ></m-img>
          <m-img
            v-else
            :width="$vuetify.breakpoint.xs ? '80' : '120'"
            :src="info.image.url.high"
            :radius="'0'"
          ></m-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            class="text-capitalize link--text text-wrap"
            :style="{ fontSize: fontSize }"
          >
            <span style="line-height:100%" v-if="!info.name"> {{ item.data().name }}</span>
            <router-link v-else :to="'/items/' + info.id" class="no-deco" style="line-height:100%">{{
              item.data().name
            }}</router-link>
          </v-list-item-title>
          <v-list-item-subtitle class="subtitle-2"
            >Favorite {{ item.id }}</v-list-item-subtitle
          >
          <v-hover v-slot:default="{ hover }">
            <v-list-item-subtitle
              @click="more = !more"
              class="ptd mt-2"
              :class="{ 'pre-wrap': more }"
              :style="{ opacity: hover && !more ? '0.5' : null }"
              >{{ item.data().comment }}</v-list-item-subtitle
            >
          </v-hover>
        </v-list-item-content>
      </v-list-item>
    </div>
    <div v-else>
      <v-list-item>
        <v-card
          min-height="100px"
          width="100%"
          outlined
          class="loading"
        ></v-card>
      </v-list-item>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: Object,
  },
  data() {
    return {
      info: {},
      more: false,
      fetched: false,
    };
  },
  methods: {
    fetchInfo() {
      this.$store
        .dispatch("fetch_item", this.item.data().name.toLowerCase())
        .then((info) => {
          this.info = info;
          this.fetched = true;
        })
        .catch((_) => {
          this.fetched = true;
        });
    },
  },
  computed: {
    fontSize() {
      return this.$vuetify.breakpoint.xs ? "1.3em" : "1.5em";
    },
  },
  created() {
    if (!this.item.data().image) {
      this.fetchInfo();
    } else {
      this.fetched = true;
    }
  },
};
</script>
