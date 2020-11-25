<template>
  <div>
    <v-img
      v-if="src"
      :src="src"
      :lazy-src="require('../assets/logo-high.png')"
      :width="width"
      :max-width="maxWidth"
      :min-width="minWidth"
      :aspect-ratio="aspectRatio"
      :style="{ borderRadius: radius }"
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="grey lighten-3"
            size="25"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>
    <v-img
      v-else
      :src="require('../assets/emptyimage.jpg')"
      :width="width"
      :max-width="maxWidth"
      :min-width="minWidth"
      :aspect-ratio="aspectRatio"
      :style="{ borderRadius: radius }"
    ></v-img>
  </div>
</template>
<script>
export default {
  props: {
    src: {
      type: String | Boolean,
      default: undefined
    },
    width: {
      type: String | Number,
      default: 100
    },
    maxWidth: {
      type: String | Number,
      default: "100%"
    },
    minWidth: {
      type: String | Number,
      default: "0px"
    },
    aspectRatio: {
      type: String,
      default: "1"
    },
    radius: {
      type: String | Number,
      default: "5px"
    }
  },
  created() {}
};
</script>
