<template>
  <v-footer padless class="mt-0">
    <v-card class="flex" flat tile>
      <v-card tile color="#242729" flat>
        <v-card-title class="stl title-text">
          <v-layout justify-center>
            <router-link to="/categories" class="stl no-deco"
              >CATEGORIES</router-link
            ></v-layout
          >
        </v-card-title>
        <v-card-text>
          <div
            id="container"
            v-masonry
            transition-duration="0.2s"
            item-selector=".cat-item"
          >
            <div
              v-masonry-tile
              class="cat-item"
              style="text-align:center"
              v-for="(category, index) in categories"
              :key="index"
            >
              <router-link
                :to="'/categories/' + category.name"
                style="font-size:0.9em"
                class="text-uppercase font-weight-bold ptl main-cat no-deco block"
              >
                {{ category.name }}&nbsp;({{category.list_count}})
                <br />
              </router-link>
              <div>
                <router-link
                  v-for="(sub, id) in category.subs"
                  :key="id"
                  style="font-size:0.9em;"
                  class="text-capitalize brighten-1 stl no-deco block"
                  :to="
                    '/categories/' +
                      category.name +
                      '/' +
                      encryptCategory(sub.name)
                  "
                >
                  {{ sub.name }}&nbsp;(<span class="stl">{{
                    sub.list_count
                  }}</span
                  >)
                  <br />
                </router-link>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
      <v-card-text
        class="py-2 grey--text text--lighten-2 text-center footer lighten-1"
      >
        <v-layout class="stl" align-center>
          <router-link :to="'/'" class="no-deco" style="font-size:1em">
            <img src="../assets/logo-trans-high.png" class="logo"/>
          </router-link>
          <router-link
            to="/terms-and-conditions"
            class="grey--text underline no-deco mx-4"
          >
            Terms and Conditions
          </router-link>
          <router-link
            to="/privacy-policy"
            class="grey--text underline no-deco"
          >
            Privacy Policy
          </router-link>
        </v-layout>
        <!-- <v-btn @click="update()">
          update all
        </v-btn> -->
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  methods: {
    update() {
      this.$store.dispatch("update_all_users");
    },
    encryptCategory(name) {
      return name.replace(/\//g, "zzsl");
    },
    decryptCategory(name) {
      return name.replace(/%sl/g, "/");
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
.cat-item {
  width: 50%;
  margin-top: 1em;
  padding: 0 0.25em;
}
@media (min-width: 600px) {
  .cat-item {
    width: 33.3%;
  }
}
@media (min-width: 800px) {
  .cat-item {
    width: 25%;
  }
}
@media (min-width: 1000px) {
  .cat-item {
    width: 20%;
  }
}
@media (min-width: 1200px) {
  .cat-item {
    width: 16.6%;
  }
}
.logo{
  background: transparent;
  width: 2.5em;
}
</style>
