<template>
  <div>
    <v-img
      v-if="src"
      :src="src"
      :width="width"
      :max-width="maxWidth"
      :min-width="minWidth"
      :aspect-ratio="aspectRatio"
    ></v-img>
    <v-img
      v-else
      :src="require('../assets/emptyimage.jpg')"
      :width="width"
      :max-width="maxWidth"
      :min-width="minWidth"
      :aspect-ratio="aspectRatio"
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
      type: String,
      default: "100px"
    },
    maxWidth: {
      type: String,
      default: "100%"
    },
    minWidth: {
      type: String,
      default: "0px"
    },
    aspectRatio: {
      type: String,
      default: "1"
    }
  },
  created(){
    
  }
};

</script>
