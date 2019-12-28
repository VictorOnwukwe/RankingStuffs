<template>
  <div>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="brand--text text-capitalize"
          >Flagged {{ element.type }}</v-card-title
        >
        <v-card-text class="mt-4">
          <div v-if="element.type == 'comment' || element.type == 'reply'">
            <div class="grey lighten-4 grey--text text--darken-2 pa-4 mb-4">
              {{ element.flaggedItem.content }}
            </div>
            <p>
              <span class="font-weight-bold">Reason: </span
              ><span>{{ element.reason }}</span>
            </p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <m-btn text @click="close()">cancel</m-btn>
          <m-btn text @click="deleteComment()">delete</m-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    element: Object
  },
  data() {
    return {
      dialog: true
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    deleteComment() {
      if (this.element.type == "comment") {
        this.$store
          .dispatch("delete_comment", {
            list_id: this.element.path.list.id,
            item_id: this.element.path.item.id,
            comment_id: this.element.path.comment.id
          })
          .then(() => {
            this.$store.dispatch("send_notification", {
              sendData: {
                list: {
                  title: this.element.path.list.title,
                  id: this.element.path.list.id
                },
                item: {
                  title: this.element.path.item.name,
                  id: this.element.path.item.id
                },
                content: this.element.flaggedItem.content
              },
              type: "comment-deleted",
              reason: this.element.reason
            });
          });
      }
    }
  },
  created() {
    console.log(this.element);
  }
};
</script>
