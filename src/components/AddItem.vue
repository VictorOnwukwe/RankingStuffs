<template>
  <div style="position:relative">
    <v-layout class="mb-3 pa-1">
      <div class="numeric-box" v-if="['list-display'].indexOf($route.name) < 0">
        <span>{{parentLength + index + 1}}</span>
      </div>
      <v-spacer></v-spacer>
      <v-icon @click="deleteItem()">close</v-icon>
    </v-layout>
    <div class>
      <v-text-field label="Name" outlined color="brand" v-model="item.name" @blur="emitItem()"></v-text-field>
    </div>
    <div class="mt-n3">
      <v-textarea
        label="Comment"
        placeholder="[Optional] Tell us why you placed this item at this position"
        outlined
        no-resize
        color="brand"
        prepend-inner-icon="mdi-information-variant"
        v-model="comment"
        @blur="emitComment()"
      ></v-textarea>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    parentLength: Number,
    index: Number
  },
  data() {
    return {
      item: {
        name: "",
        info: undefined
      },
      comment: ""
    };
  },
  methods: {
    emitItem() {
      this.$emit("receiveItem", this.index, this.item);
    },
    emitComment() {
      this.$emit("receiveComment", this.index, this.comment);
    },
    deleteItem() {
      this.item.name = "";
      this.item.exists = false;
      this.comment = "";
    }
  }
};
</script>

<style scoped>
.close-container {
  position: relative;
}
.close-button {
  right: 0.5em;
  top: 1em;
}
.close-button::after {
  content: "\00D7";
  font-size: 2em;
}
.close-button:hover {
  color: rgb(172, 5, 5);
  cursor: pointer;
}
</style>