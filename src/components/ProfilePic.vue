<template>
  <div>
    <v-avatar v-if="src" :size="size">
      <img :src="src" />
    </v-avatar>
    <v-icon v-else :size="size" :color="color">fa-user-circle</v-icon>
  </div>
</template>

<script>
export default {
  props: {
    src: String,
    size: {
        type: String,
        default: "2.5em"
    }
  },
  computed: {
      color(){
          let colors = ["blue","green","red","orange","purple"];

          return colors[Math.round(Math.random() * 5)];
      }
  }
};
</script>