<template>
  <div>
    <div style="margin:0 auto;max-width:950px;">
      <div class="page-title">Demand List</div>
      <v-card tile class="mb-2">
        <v-card-title class="title top-bar pl-2 pa-1">1. Just A Tip</v-card-title>
        <v-card-text>
          <ul class="mt-4 primary-text-dark">
            <li
              class="subtitle-1"
            >Make the viewers understand your request by stating a precise title.</li>
            <li class="subtitle-1">You can add a comment to clarify what you need to the viewers.</li>
            <li class="subtitle-1">Be sure to check if the list already exists.</li>
            <li class="subtitle-1">Be sure to check if the list is already on demand.</li>
          </ul>
        </v-card-text>
      </v-card>
      <v-card tile class="mb-2">
        <v-card-title class="title top-bar pa-1">2. Type</v-card-title>
        <v-card-text>
          <v-checkbox color="blue" v-model="anonymous" label="Post as Anonymous"></v-checkbox>
        </v-card-text>
      </v-card>
      <v-card tile class="">
        <v-card flat tile>
          <v-card-title class="top-bar title pl-2 pa-1">3. Demand</v-card-title>
        </v-card>
        <v-card-text class="mt-4">
          <v-form v-model="valid">
          <v-text-field counter="100" :rules="[rules.maxLength(100),rules.minLength(1)]" outlined label="Title" color="brand" v-model="title"></v-text-field>
          <v-textarea
            color="brand"
            outlined
            label="Comment"
            placeholder="[Optional] Tell us why this list is important to you..."
            v-model="comment"
            class=""
            no-resize
          ></v-textarea>
          <v-card-actions>
            <v-btn :disabled="!valid" class="brand primary--text" @click="demand()">Submit</v-btn>
          </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import Rules from "../rules";

export default {
  data() {
    return {
      title: "",
      comment: "",
      anonymous: false,
      valid: false,
      rules: Rules
    };
  },
  methods: {
    demand() {
      let upload = { title: this.title, anonymous: this.anonymous };
      this.comment !== ""
        ? (upload = { comment: this.comment, ...upload })
        : null;

      this.$store.dispatch("demand_list", upload);
    }
  },
  created() {
    if (this.$route.query.searched) {
      this.title = this.$route.query.title;
    }
  }
};
</script>

<style scoped>
</style>