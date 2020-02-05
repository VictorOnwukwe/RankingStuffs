<template>
  <div :style="{ fontSize: size }">
    <v-layout class="">
      <v-flex shrink>
        <v-icon size="1.4em" :color="visual.color + ' ' + visual.tone"
          >mdi-star</v-icon
        >
      </v-flex>
      <v-flex shrink>
        <span
          class="caption font-weight-bold"
          :style="{ color: visual.color }"
          >{{ rate }}</span
        ></v-flex
      >
      <v-flex shrink>
        <span class="caption" :class="textColor + '--text'"
          >&nbsp;({{ ratersCount }}
          {{ ratersCount != 1 ? "reviews" : "review" }})</span
        >
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
export default {
  props: {
    rating: {
      type: Number,
      default: 0
    },
    ratersCount: {
      type: Number,
      default: 0
    },
    visual: {
      type: Object,
      default: () => {
        return {
          color: "#D56E0C",
          tone: ""
        };
      }
    },
    size: {
      type: Number | String,
      default: "1em"
    },
    textColor: {
      type: String,
      default: "ptd"
    }
  },
  computed: {
    rate() {
      if (this.rating % 1 == 0) {
        return this.rating + ".0";
      }
      return this.rating;
    }
  }
};
</script>
