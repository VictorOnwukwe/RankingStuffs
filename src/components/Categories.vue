<template>
  <div class="grid mt">
    <div
      v-for="(category, index) in categories"
      :key="index"
      style="position:relative"
    >
      <img
        :src="require('../assets/' + name(category.name) + '.jpg')"
        width="100%"
      />
      <v-card class="display">
        <prev :category="category"></prev>
      </v-card>
    </div>
  </div>
</template>

<script>
import CategoryPreview from "./CategoryPreview";
export default {
  components: {
    prev: CategoryPreview
  },
  methods: {
    async Lists(name) {
      let mlists;
      await this.$store
        .dispatch("fetch_category_lists", {
          category: name,
          limit: 10
        })
        .then(lists => {
          mlists = lists;
        });

      return mlists;
    },
    name(name) {
      return this.$vuetify.breakpoint.xs ? name + "-low" : name;
    }
  },
  computed: {
    categories() {
      return this.$store.getters.categories;
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
.display {
  margin-top: -8em;
  width: 86%;
  margin-left: 7%;
  min-height: 10em;
  background-color: rgba(255, 255, 255, 0.9);
}
</style>
