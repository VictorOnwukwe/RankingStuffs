<template>
  <div>
    <div style="margin:0 auto;max-width:900px;">
    <v-card-title class="primary-text-dark page-title" style="font-size:2em;">Demand List</v-card-title>
    <v-card tile class="mb-2 primary">
      <v-card-title class="title top-bar pl-2 pa-1">1. Just A Tip</v-card-title>
      <v-card-text>
        <ul class="mt-4">
          <li class="subtitle-1">Make the viewers understand your request by stating a precise title.</li>
          <li class="subtitle-1">You can add a comment to clarify what you need to the viewers.</li>
          <li class="subtitle-1">Be sure to check if the list already exists.</li>
          <li class="subtitle-1">Be sure to check if the list is already on demand.</li>
        </ul>
      </v-card-text>
    </v-card>
    <v-card tile class="primary">
      <v-card flat tile>
        <v-card-title class="top-bar title pl-2 pa-1">2. Demand</v-card-title>
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
  },
  created(){
    if(this.$route.query.searched){
      this.title = this.$route.query.title;
    }
  }
};
</script>

<style scoped>

</style>