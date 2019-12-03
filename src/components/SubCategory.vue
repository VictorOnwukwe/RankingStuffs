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
        <h1 class="text-capitalize ptl">
          <router-link
            :to="`/categories/${category.name}`"
            class="no-deco b-link"
          >
            {{ category.name }}
          </router-link>
          / <span class="">{{ subCategory.name }}</span>
        </h1>
        <router-link
          :to="'/categories/' + category.name + '/' + sub.name"
          v-for="(sub, index) in category.subs"
          :key="index"
          class="stl brighten-1 no-deco"
          :class="{
            'accent--text font-weight-bold': sub.name == subCategory.name
          }"
          >{{ sub.name }}({{ sub.list_count }})&nbsp;&nbsp;
        </router-link>
      </div>
    </div>
    <div class="mt-12">
      <display-lists :lists="lists"></display-lists>
    </div>
    <list-loading v-if="fetching"></list-loading>
  </div>
</template>
<script>
export default {
  data() {
    return {
      lists: [],
      fetching: false
    };
  },
  methods: {
    fetchLists() {
      this.fetching = true;
      this.$store
        .dispatch("fetch_subcategory_lists", {
          category: this.$route.params.category,
          subCategory: this.$route.params.subcategory,
          limit: 20
        })
        .then(lists => {
          this.lists = this.lists.concat(lists);
          this.fetching = false;
        });
    },

  },
  computed: {
    category() {
      let category = this.$store.getters.categories.find(category => {
        return category.name == this.$route.params.category;
      });
      return category;
    },
    subCategory() {
      let subCategory = this.category.subs.find(sub => {
        return sub.name == this.$route.params.subcategory;
      });
      return subCategory;
    },
    sub() {
      return this.$route.params.subcategory;
    }
  },
  watch: {
    sub() {
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
  min-height: 60vh;
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
.b-link {
  color: white;
}
.b-link:hover {
  color: var(--accent);
}
</style>
