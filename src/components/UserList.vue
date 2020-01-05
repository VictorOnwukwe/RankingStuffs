<template>
  <v-list-item class="px-2" v-if="list" link :to="'/lists/' + list.id">
    <v-list-item-avatar size="120" v-if="list.preview_image" tile>
      <v-img :src="list.preview_image.url.low"></v-img>
    </v-list-item-avatar>
    <v-list-item-content align-with-title>
      <v-list-item-title
        class="text-capitalize link--text text-wrap"
        :style="{ fontSize: fontSize }"
        >{{ list.title }}</v-list-item-title
      >
      <v-list-item-subtitle>{{ created(list.created) }}</v-list-item-subtitle>
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
      default: false
    }
  },
  data() {
    return {
      list: null
    };
  },
  methods: {
    created(time) {
      return moment(time.toDate()).calendar();
    },
    go(link) {
      this.$router.push(link);
    }
  },
  computed: {
    fontSize() {
      return this.$vuetify.breakpoint.xs ? "1.3em" : "1.5em";
    }
  },
  created() {
    if (!this.List) {
      this.$store.dispatch("fetch_list", this.id).then(list => {
        this.list = list;
      });
    } else {
      this.list = this.List;
    }
  }
};
</script>
