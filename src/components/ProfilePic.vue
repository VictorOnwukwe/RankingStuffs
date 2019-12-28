<template>
  <div>
    <v-avatar :size="size">
      <img v-if="src" :src="src" />
      <img v-else :src="require('../assets/nophoto.jpg')" />
    </v-avatar>
  </div>
</template>

<script>
export default {
  props: {
    src: String,
    size: {
      type: String,
      default: "2em"
    }
  }
};
</script>
