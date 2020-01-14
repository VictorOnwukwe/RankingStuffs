<template>
  <v-card flat tile>
    <div class="px-0" v-for="(comment, index) in comments" :key="comment.id">
      <comment
        :comment="{ id: comment.id, ...comment.data() }"
        @delete="deleteComment"
        :list="list"
        :item="item"
        :index="index"
      ></comment>
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
    deleteComment(index) {
      this.comments.splice(index, 1);
    }
  }
};
</script>
