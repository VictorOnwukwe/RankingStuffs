<template>
  <div>
    <v-avatar v-if="src" :size="size">
      <img :src="src" />
    </v-avatar>
    <v-avatar v-else :size="size">
      <img :src="$store.state.nophoto" />
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
