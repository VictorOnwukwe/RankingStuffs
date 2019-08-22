<template>
  <div style="position:relative">
      <div v-if="index!=0" class="close-container" @click="deleteItem()">
        <div class>
          <span class="close-span close-button"></span>
        </div>
      </div>
      <div class="numeric-box mb-4">
        <span>{{parentLength + index + 1}}</span>
      </div>
      <div class>
        <v-text-field label="Item Name" outlined color="brand" v-model="title" @blur="emitTitle()"></v-text-field>
      </div>
      <div class="mt-n3">
        <v-textarea
          label="About Item"
          placeholder="(Optional) Tell us why you placed this item at this position"
          outlined
          no-resize
          color="brand"
          prepend-inner-icon="mdi-information-variant"
          v-model="about"
          @blur="emitAbout()"
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
      title: "",
      about: ""
    };
  },
  methods: {
    emitTitle() {
      this.$emit("receiveTitle", this.index, this.title);
    },
    emitAbout() {
      this.$emit("receiveAbout", this.index, this.about);
    },
    deleteItem() {
      this.$emit("deleteMe", this.index);
    }
  }
};
</script>

<style scoped>
.close-container{
  position: relative;
}
.close-button {
  position: absolute;
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