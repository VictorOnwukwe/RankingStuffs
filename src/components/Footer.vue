<template>
  <v-footer  padless>
    <v-card class="flex" flat tile>
        <v-card tile color="#242729" flat>
          <v-card-title class="stl title-text">CATEGORIES</v-card-title>
          <v-card-text>
            <div id="container" v-masonry transition-duration="0.2s" item-selector=".cat-item">
              <div v-masonry-tile class="cat-item" v-for="(category, index) in categories" :key="index">
                <router-link :to="'/categories/' + category.name" style="font-size:0.9em" class="text-uppercase underline font-weight-bold ptl main-cat no-deco">
                  {{category.name}}
                  <br />
                </router-link>
                <div>
                  <router-link
                    v-for="(sub, id) in category.subs"
                    :key="id"
                    style="font-size:0.9em"
                    class="text-capitalize brighten-1 stl no-deco"
                    :to="'/categories/' + category.name + '/' + sub.name"
                  >
                    {{sub.name}}&nbsp;({{sub.list_count}})
                    <br/>
                  </router-link>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      <v-card-text class="py-2 grey--text text--lighten-2 text-center footer lighten-1">
        <v-layout class="stl">
          topTEN
          <a class="grey--text underline">Privacy Policy</a>
          <a class="grey--text underline">Terms and Conditions</a>
        </v-layout>
        <!-- <v-btn @click="update()">
          update all
        </v-btn> -->
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
import Masonry from "vue-masonry-css";
export default {
  components:{
    Masonry
  },
  data() {
    return {};
  },
  methods: {
    update() {
      this.$store.dispatch("update_all_users");
    }
  },
  computed: {
    categories() {
      return this.$store.getters.categories;
    }
  },
  created(){
    // this.$redrawVueMasonry();
  }
};
</script>

<style scoped>
a {
  /* margin-left: 1em; */
}
.cat-item {
  width: 50%;
  margin-top: 1em;
  padding:0 0.25em;
}
@media (min-width: 650px) {
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
.main-cat{
  
}
</style>
