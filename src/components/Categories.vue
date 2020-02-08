<template>
  <div class="grid mt">
    <div
      v-for="(category, index) in categories"
      :key="index"
      style="position:relative"
    >
      <credit :credit="credit(category.name)">
        <div style="min-height:6.5em;min-width:100%">
          <img
            class="image"
            :src="require('../assets/' + name(category.name))"
            width="100%"
          />
        </div>
      </credit>
      <v-card class="display">
        <prev :category="category"></prev>
      </v-card>
    </div>
  </div>
</template>

<script>
import CategoryPreview from "./CategoryPreview";
import imageLinks from "../../public/my-modules/image-links";
import PhotoCredit from "./PhotoCredit";
export default {
  components: {
    prev: CategoryPreview,
    credit: PhotoCredit
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
      let data = this.$vuetify.breakpoint.xs
        ? name + "-low.jpg"
        : name + ".jpg";
      return data.replace(/ /g, "");
    },
    credit(name) {
      let result =
        imageLinks[
          name
            .toLowerCase()
            .replace(/\&/g, "_")
            .replace(/ /g, "")
        ];
      return result;
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
  grid-gap: 2em;
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
  background-color: rgba(255, 255, 255, 0.97);
}
.image {
  min-height: 12em;
}
</style>
