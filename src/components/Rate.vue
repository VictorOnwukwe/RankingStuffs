<template>
  <div>
    <v-rating
      v-model="rating"
      :color="color"
      background-color="grey lighten-1"
      :size="size"
      full-icon="mdi-star"
      half-icon="mdi-star-half"
      empty-icon="mdi-star"
      dense
      hover
      @input="rate()"
    ></v-rating>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: Number | String,
      default: "1.2em"
    },
    value: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: "yellow darken-4"
    },
  },
  data() {
    return {
      rating: this.value,
      readOnly: this.readonly
    };
  },
  methods: {
    rate() {
      this.$emit("input", this.rating);
      this.readOnly = true;
    }
  },
  watch: {
    value() {
      this.rating = this.value;
    }
  }
};
</script>