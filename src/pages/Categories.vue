<template>
  <div class="grid mt">
    <v-card v-for="(category, index) in categories" :key="index">
      <div style="position:relative;padding-top:58%;width:100%">
        <credit :credit="credit(category.name)">
          <img
            :src="require('../assets/' + name(category.name))"
            style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:1"
            class="category-image"
          />
        </credit>
        <div
          v-if="!imageLoaded[index]"
          style="position:absolute;top:0;left:0;width:100%;height:100%;"
        >
          <div style="position:relative;height:100%;width:100%">
            <img
              :src="require('../assets/emptyimage.jpg')"
              style="object-fit:cover;height:100%;width:100%;filter:blur(2px)"
            />
            <v-layout
              style="position:absolute;top:0;left:0;width: 100%;height:100%;"
              align-center
              justify-center
            >
              <v-progress-circular
                :value="20"
                width="1"
                color="white"
                indeterminate
              ></v-progress-circular>
            </v-layout>
          </div>
        </div>
      </div>
      <div>
        <prev :category="category"></prev>
      </div>
    </v-card>
  </div>
</template>

<script>
import CategoryPreview from "../components/CategoryPreview";
import imageLinks from "../my-modules/js/image-links";
import PhotoCredit from "../components/PhotoCredit";
export default {
  components: {
    prev: CategoryPreview,
    credit: PhotoCredit,
  },
  data() {
    return {
      imageLoaded: [],
    };
  },
  methods: {
    async Lists(name) {
      let mlists;
      await this.$store
        .dispatch("fetch_category_lists", {
          category: name,
          limit: 10,
        })
        .then((lists) => {
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
    },
  },
  computed: {
    categories() {
      return this.$store.getters.categories;
    },
  },
  mounted() {
    let $this = this;
    let elements = document.getElementsByClassName("category-image");

    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener("load", function() {
        $this.imageLoaded[i] = true;
      });
    }
  },
};
</script>
<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  grid-column-gap: 1em;
  grid-row-gap: 2em;
}
</style>
