<template>
  <v-card flat tile>
    <div v-show="showComments">
      <div class="px-0" v-for="(comment, index) in comments" :key="comment.id">
        <comment
          :comment="{ id: comment.id, ...comment.data() }"
          @delete="deleteComment"
          :list="list"
          :item="item"
          :index="index"
        ></comment>
      </div>
    </div>
  </v-card>
</template>

<script>
import comment from "./comment";
export default {
  components: {
    comment,
  },
  props: {
    comments: Array,
    list: Object,
    item: Object,
  },
  data() {
    return {
      showComments: true,
    };
  },
  methods: {
    deleteComment(index) {
      this.comments.splice(index, 1);
      this.$emit("deleted");
    },
  },
};
</script>
