<template>
  <div>
    <v-card flat tile class="my-4">
      <v-card flat tile class="pa-0">
        <v-card-title class="top-bar title">Demand List</v-card-title>
      </v-card>
      <v-card-text class="mt-4">
        <v-text-field outlined label="Title" color="brand" v-model="title"></v-text-field>
        <v-textarea
          color="brand"
          outlined
          label="Comment"
          placeholder="[Optional] Tell us why this list is important to you..."
          v-model="comment"
          class="mt-n3"
        ></v-textarea>
        <v-card-actions>
          <v-btn class="brand primary--text" @click="demand()">Submit</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      comment: ""
    };
  },
  methods: {
    demand() {
      this.$store.dispatch("demand_list", {
        title: this.title,
        comment: this.comment
      });
    }
  }
};
</script>