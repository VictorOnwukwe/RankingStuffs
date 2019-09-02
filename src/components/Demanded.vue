<template>
  <v-card class="mt-4">
    <v-card-title class="title brand--text text--darken-1">{{demand.title}}</v-card-title>
    <v-card-text>
      <div class="mt-n3">
        <span class="subtitle-2 brand--text text--darken-1" style="opacity:0.8">
          {{demand.waiters_count}}
          <span
            v-if="demand.waiters_count<2"
            class="subtitle-2"
          >person is</span>
          <span v-else class="subtitle-2">people are</span> waiting for this list
        </span>
        <p class="mt-2 grey--text text--darken-2">{{demand.comment}}</p>
      </div>
    </v-card-text>
    <v-card-actions class="mt-n8">
      <v-layout justify-start>
        <v-btn
          @click="joinWaiters()"
          class="join pointer orange--text white"
          depressed
        >Join the Queue</v-btn>
        <v-btn depressed @click="create()" class="make pointer green--text white">Make their day</v-btn>
      </v-layout>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    demand: Object
  },
  methods: {
    create() {
      this.$router.push({
        path: "/create",
        query: { demanded: true, id: "jdsfbsijbfjd", title: this.demand.title }
      });
    },
    joinWaiters() {
      this.$store.dispatch("join_demanders", demand.id).then(() => {});
    }
  }
};
</script>

<style scoped>
.make:hover {
  text-shadow: 1px 1px 8px green;
}
.join:hover {
  text-shadow: 1px 1px 8px orange;
}
p {
  line-height: 0.8em;
  letter-spacing: 0.001px;
}
</style>