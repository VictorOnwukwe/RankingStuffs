<template>
  <v-list-item v-if="list" link @click="go('/lists/' + id)">
    <v-list-item-avatar size="80" v-if="list.preview_image" tile>
      <v-img :src="list.preview_image.url.low"></v-img>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title class="text-capitalize brand--text text-wrap">{{list.title}}</v-list-item-title>
      <v-list-item-subtitle>{{created(list.created)}}</v-list-item-subtitle>
      <v-list-item-subtitle>
        <rating :value="list.rating" :size="'0.9em'"></rating>
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
let moment = require("moment")
export default {
  props: {
    id: String
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
    go(link){
        this.$router.push(link);
    }
  },
  created() {
    this.$store.dispatch("fetch_list", this.id).then(list => {
      this.list = list;
    });
  }
};
</script>