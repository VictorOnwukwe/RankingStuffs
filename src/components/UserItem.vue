<template>
  <div>
    <v-list-item>
      <v-list-item-avatar v-if="item.data().image || info.image" size="80" tile>
        <v-img v-if="item.data().image" :src="item.data().image.url"></v-img>
        <v-img v-else :src="info.image.url.low"></v-img>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title
          class="text-capitalize link--text text-wrap"
          :style="{ fontSize: fontSize }"
          >{{ item.data().name }}</v-list-item-title
        >
        <v-list-item-subtitle class="subtitle-2"
          >Favorite {{ item.id }}</v-list-item-subtitle
        >
      </v-list-item-content>
    </v-list-item>
  </div>
</template>
<script>
export default {
  props: {
    item: Object
  },
  data() {
    return {
      info: {}
    };
  },
  methods: {
    fetchInfo() {
      this.$store.dispatch("fetch_item", this.item.info).then(info => {
        this.info = info;
      });
    }
  },
  computed: {
    fontSize() {
      return this.$vuetify.breakpoint.xs ? "1.3em" : "1.5em";
    }
  },
  created() {
    if (this.item.info) {
      this.fetchInfo();
    }
  }
};
</script>
