<template>
  <div class="grid">
    <v-card
      v-for="item in items"
      :key="item"
      :min-height="random(120, 60)"
      class="loading"
      outlined
    ></v-card>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Number,
      default: 2
    }
  }
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 0.5em;
}

@media (min-width: 900px) {
  .grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
