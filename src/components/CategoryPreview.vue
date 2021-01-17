<template>
  <div>
    <v-card-title
      class="text-capitalize font-weight-medium"
      style="font-size:1.5em"
    >
      <router-link class="no-deco ptd" :to="'/categories/' + category.name">
        {{ category.name }}
      </router-link>
    </v-card-title>
    <v-card-text>
      <div
        v-for="(list, index) in lists"
        :key="index"
        class="mt-1 category-line"
        style="display:flex"
      >
        <div class="mr-1 font-weight-bold">-</div>
        <router-link
          tag="a"
          :to="'/lists/' + list.id"
          class="no-deco text-capitalize"
          style="font-size:13px"
        >
          {{ list.data().title }}
        </router-link>
      </div>
    </v-card-text>
  </div>
</template>
<script>
export default {
  props: {
    category: Object,
  },
  data() {
    return {
      lists: [],
    };
  },
  created() {
    this.$store
      .dispatch("fetch_category_lists", {
        category: this.category.name,
        limit: 5,
      })
      .then((lists) => {
        this.lists = lists;
      })
      .catch((_) => {});
  },
};
</script>
<style scoped>
.category-line:hover > div{
  color: var(--accent);
}
</style>
