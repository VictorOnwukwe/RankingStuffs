<template>
  <v-list-item class="px-0 py-2" v-if="list" link :to="'/lists/' + list.id">
    <v-list-item-avatar
      class="mb-auto"
      :size="$vuetify.breakpoint.xs ? 80 : 120"
      tile
    >
      <m-img
        v-if="list.preview_image"
        :src="list.preview_image.url.low"
        :width="$vuetify.breakpoint.xs ? 80 : 120"
        :radius="'0'"
      ></m-img>
      <m-img
        v-else
        :src="require('../assets/' + list.category + '-low.jpg')"
        :width="$vuetify.breakpoint.xs ? 80 : 120"
        :radius="'0'"
      ></m-img>
    </v-list-item-avatar>
    <v-list-item-content align-with-title class="pt-1 mb-auto">
      <v-list-item-title
        class="text-capitalize link--text text-wrap"
        :style="{ fontSize: fontSize }"
        >{{ list.title }}</v-list-item-title
      >
      <v-list-item-subtitle>{{ created(list.created) }}</v-list-item-subtitle>
      <v-list-item-subtitle>
        <span class="ptd" v-if="list.votable"
          >{{ list.voters_count }}
          {{ list.voters_count > 1 ? "voters" : "voter"
          }}<span class="htd">&nbsp;|</span></span
        >
        <span class="ptd" v-if="list.votable">
          {{ list.votes }} votes<span class="htd">&nbsp;|</span></span
        >
        <span class="ptd"> {{ list.item_count }} items</span>
        <span class="ptd"
          ><span class="htd">&nbsp;|</span> {{ list.views + 1 }}
          {{ list.views + 1 == 1 ? "view" : "views" }}</span
        >
      </v-list-item-subtitle>
      <v-list-item-subtitle>
        <rating :rating="list.rating" :ratersCount="list.raters_count"></rating>
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
let moment = require("moment");
export default {
  props: {
    id: String,
    List: {
      type: Boolean | Object,
      default: false,
    },
  },
  data() {
    return {
      list: null,
    };
  },
  methods: {
    created(time) {
      return moment(time.toDate()).calendar();
    },
    go(link) {
      this.$router.push(link);
    },
  },
  computed: {
    fontSize() {
      return this.$vuetify.breakpoint.xs ? "1.2em" : "1.3em";
    },
  },
  created() {
    if (!this.List) {
      this.$store.dispatch("fetch_list", this.id).then((list) => {
        this.list = list;
      });
    } else {
      this.list = this.List;
    }
  },
};
</script>
<style scoped>
* > * {
  line-height: 1.6em !important;
}
</style>
