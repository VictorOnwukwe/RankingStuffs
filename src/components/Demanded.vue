<template>
  <v-card tile class="primary">
    <v-card-title class="primary-text-dark" style>
      <v-layout column>
        <h6 class="title" style="line-height: 1.3">{{demand.title}}</h6>
        <span class="subtitle-2 secondary-text-dark" style="">
          <span class="subtitle-2 font-weight-bold secondary-text-dark">{{demand.waiters_count}} </span>
          <span v-if="demand.waiters_count<2" class="secondary-text-dark subtitle-2">person</span>
          <span v-else class="subtitle-2 secondary-text-dark">people</span> waiting for this list
        </span>
      </v-layout>
    </v-card-title>
    <v-card-text style="margin-bottom:1.5em">
      <div class="">
        <p class="secondary-text-dark subtitle-1">{{demand.comment}}</p>
      </div>
    </v-card-text>
    <v-card-actions style="position:absolute; bottom:0" class="mt-n8">
      <v-layout>
        <v-btn
          @click="joinWaiters()"
          class="join pointer brand--text white font-weight-bold"
          depressed
        >Queue</v-btn>
        <v-btn
          depressed
          @click="create()"
          class="make pointer brand--text white font-weight-bold"
        >Create</v-btn>
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
  text-shadow: 1px 1px 8px #e2e8f7;
}
.join:hover {
  text-shadow: 1px 1px 8px #e2e8f7;
}
p {
  line-height: 0.8em;
  letter-spacing: 0.001px;
}
</style>