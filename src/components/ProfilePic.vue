<template>
  <div>
    <v-avatar :size="size" tile :style="{ borderRadius: radius }">
      <v-img
        :lazy-src="require('../assets/nophoto.jpg')"
        v-if="src"
        :src="src.low"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="white"
              size="25"
              width="1"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
      <v-img v-else :src="require('../assets/nophoto.jpg')"></v-img>
    </v-avatar>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: Object,
    },
    size: {
      type: String,
      default: "2em",
    },
    radius: {
      type: String | Number,
      default: "50%",
    },
  },
};
</script>
