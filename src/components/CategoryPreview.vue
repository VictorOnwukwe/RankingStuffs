<template>
  <div>
    <v-card-title
      class="text-capitalize font-weight-medium"
      style="font-size:1.8em"
    >
      <router-link
        class="no-deco link--text"
        :to="'/categories/' + category.name"
      >
        {{ category.name }}
      </router-link>
    </v-card-title>
    <v-card-text>
      <div v-for="(list, index) in lists" :key="index" class="mt-1">
        <router-link
          tag="a"
          :to="'/lists/' + list.id"
          class="no-deco underline text-capitalize"
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
    category: Object
  },
  data() {
    return {
      lists: []
    };
  },
  created() {
    this.$store
      .dispatch("fetch_category_lists", {
        category: this.category.name,
        limit: 10
      })
      .then(lists => {
        this.lists = lists;
      })
      .catch(_ => {});
  }
};
</script>
