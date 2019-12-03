<template>
  <div>
    <div
      class="cover"
      :style="{
        backgroundImage:
          'url(' + require('../assets/' + category.name + '.jpg') + ')'
      }"
    >
      <div class="tint">
        <h1 class="text-capitalize ptl">{{ category.name }}</h1>
        <router-link
          :to="'/categories/' + category.name + '/' + sub.name"
          v-for="(sub, index) in category.subs"
          :key="index"
          class="stl brighten-1 no-deco"
          >{{ sub.name }}({{ sub.list_count }})&nbsp;&nbsp;
        </router-link>
      </div>
    </div>

    <v-layout align-center class="mt brand--text">
      <sorter @change="setShow" :options="options"></sorter>
    </v-layout>

    <div class="mt-12">
      <display-lists :lists="lists"></display-lists>
    </div>
    <list-loading v-if="fetching"></list-loading>
  </div>
</template>
<script>
import Sorter from "./Sorter";
export default {
  components: {
    Sorter
  },
  data() {
    return {
      lists: [],
      fetching: false,
      show: "lists",
      sortBy: "random"
    };
  },
  methods: {
    fetchLists() {
      this.fetching = true;
      this.$store
        .dispatch("fetch_category_lists", {
          category: this.$route.params.id,
          limit: 20
        })
        .then(lists => {
          this.lists = this.lists.concat(lists);
          this.fetching = false;
        });
    },
    fetchMoreLists() {},
    setShow(val){
      this.show = val;
    },
    setSortBy(val){
      this.sortBy = val;
    }
  },
  computed: {
    category() {
      let category = this.$store.getters.categories.find(category => {
        return category.name == this.$route.params.id;
      });
      return category;
    },
    cover() {
      let cover = "../assets/" + this.category.name.toLowerCase() + ".jpg";
      console.log(cover);
      return cover;
    },
    categoryID() {
      return this.$route.params.id;
    },
    options(){
      return [{
        label: "Lists",
        value: "lists",
        sorts: ["Random","Latest","Top Rated","Popular"]
      },{
        label: "Demands",
        value: "demands",
        sorts: ["Random","Most Demanded","Least Demanded","Newest","Oldest"]
      }]
    }
  },
  watch: {
    categoryID(val) {
      this.lists = [];
      this.fetchLists();
    }
  },
  created() {
    this.fetchLists();
  }
};
</script>
<style scoped>
.cover {
  width: calc(100% + 1em);
  min-height: 50vh;
  background-size: 100% auto;
  display: flex;
  position: relative;
  background-repeat: repeat-y;
  margin-top: -2em;
  margin-left: -0.5em;
}
@media (min-width: 600px) {
  .cover {
    min-height: 70vh;
    width: calc(100% + 1em);
    margin-left: -1em;
  }
}
.tint {
  position: absolute;
  background: rgba(0, 0, 0, 0.75);
  bottom: 0em;
  left: 2em;
  padding: 1em;
}
select {
  background: white;
  padding: 4px 8px;
  border: 1px solid black;
}
</style>
