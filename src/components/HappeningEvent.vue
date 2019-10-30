<template>
  <v-list-item @click v-if="event">
    <v-list-item-content>
      <v-list-item-title v-html="message"></v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  props: {
    event: {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {};
  },
  methods: {},
  computed: {
    message() {
      switch (this.event.type) {
        case "list":
          return `New List Created: ${this.event.list.title}`;
          break;
        case "comment":
          return `New Comment on ${this.event.item.name} on ${this.event.list.title} <span class="font-weight-medium comment">"${this.event.comment}"</span>`;
          break;
        case "vote":
          return `New Vote for ${this.event.item.name} on ${this.event.list.title}`;
          break;
        case "item":
          return `New Item added to list ${this.event.list.title}`;
          break;
        case "rate":
          return `List ${this.event.title} rated ${this.event.rating} ${
            this.event.rating > 1 ? "stars" : "star"
          }`;
          break;
        case "demand":
          return `New List Demanded: ${this.event.demand.title}`;
          break;
      }
    }
  },
  mounted() {}
};
</script>

<style scoped>
.medium {
}
</style>