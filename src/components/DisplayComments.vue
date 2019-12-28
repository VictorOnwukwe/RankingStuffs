<template>
  <v-card flat tile>
    <div class="px-4" v-for="(comment, index) in comments" :key="comment.id">
      <comment :comment="{id: comment.id, ...comment.data()}" @delete="deleteComment" :list="list" :item="item" :index="index"></comment>
    </div>
    <div class="px-4">
    <!-- <v-divider class="grey lighten-4 mt-1"></v-divider> -->
    </div>
  </v-card>
</template>

<script>
import comment from "./comment";
export default {
  components: {
    comment
  },
  props: {
    comments: Array,
    list: Object,
    item: Object
  },
  methods: {
    deleteComment(index){
      this.comments.splice(index, 1);
    }
  }
};
</script>