<template>
  <v-footer  padless>
    <v-card color="footer lighten-1" class="flex" flat tile>
        <v-card color="footer" flat class="mt-4">
          <v-card-title class="secondary-text-light">CATEGORIES</v-card-title>
          <v-card-text>
            <div v-masonry transition-duration="0.2s" item-selector=".item">
              <div v-masonry-tile class="item" v-for="(category, index) in categories" :key="index">
                <a class="text-uppercase underline font-weight-bold secondary-text-light">
                  {{category.name}}
                  <br />
                </a>
                <div>
                  <a
                    v-for="(sub, id) in category.subs"
                    :key="id"
                    class="text-capitalize underline secondary-text-light"
                  >
                    {{sub.name}}&nbsp;({{sub.count}})
                    <br />
                  </a>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      <v-card-text class="py-2 grey--text text--lighten-2 text-center">
        <v-layout class="secondary-text-light">
          topTEN
          <a class="grey--text underline">Privacy Policy</a>
          <a class="grey--text underline">Terms and Conditions</a>
        </v-layout>
        <!-- <v-btn @click="update()">
          update all
        </v-btn>-->
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
  }
};
</script>

<style scoped>
a {
  margin-left: 1em;
}
.item {
  width: 50%;
  margin-top: 1em;
  padding:0 0.25em;
  justify-self: center;
}
@media (min-width: 650px) {
  .item {
    width: 33.3%;
  }
}
@media (min-width: 800px) {
  .item {
    width: 25%;
  }
}
@media (min-width: 1000px) {
  .item {
    width: 20%;
  }
}
@media (min-width: 1200px) {
  .item {
    width: 16.6%;
  }
}
</style>
