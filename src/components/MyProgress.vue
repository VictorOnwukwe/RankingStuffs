<template>
  <v-progress-circular
    indeterminate
    :size="size"
    :width="width"
    :color="color"
  ></v-progress-circular>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "grey darken-2"
    },
    size: {
      type: String | Number,
      default: "20"
    },
    width: {
      type: String | Number,
      default: "2"
    }
  }
};
</script>
