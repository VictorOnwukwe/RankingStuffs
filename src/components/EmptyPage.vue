<template>
  <div>
    <v-layout :style="{ height: height }" justify-center align-center>
      <v-layout align-center column>
        <v-icon :size="iconSize" color="grey lighten-2">{{ icon }}</v-icon>
        <div class="htd mt-2">{{ message }}</div>
        <slot></slot>
      </v-layout>
    </v-layout>
  </div>
</template>
<script>
export default {
  props: {
    icon: {
      type: String,
      default: "far fa-frown"
    },
    height: {
      type: String,
      default: "70vh"
    },
    message: {
      type: String,
      default: "No Files Found"
    },
    iconSize: {
      type: String,
      default: "3em"
    }
  }
};
</script>
