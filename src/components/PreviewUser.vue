<template>
  <div>
    <v-card max-width="300px">
      <v-img :src="user.profile_pic" width="100%" aspect-ratio="1.8"></v-img>
      <v-card-title class="title">@{{user.username}}</v-card-title>
      <v-card-text>
        <p class="subtitle-1 grey--text mt-n4">Joined {{userCreated}}</p>
        <v-layout justify-start class="mt-n4">
          <p>
            154
            <span class="link--text">Followers</span>
          </p>
          <p class="ml-4">
            128
            <span class="link--text">Following</span>
          </p>
        </v-layout>
        <v-btn small rounded class="accent white--text">Follow</v-btn>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn small depressed>View profile</v-btn>
        <v-spacer></v-spacer>
        <v-btn small depressed @click="closeUserDialog()">Close</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
let moment = require("moment");
export default {
  props: {
    user: Object
  },
  data() {
    return {};
  },
  methods: {
    closeUserDialog() {
      this.$emit("closeDialog");
    }
  },
  computed: {
    userCreated() {
      return moment(this.user.created.toDate()).calendar();
    }
  }
};
</script>

<style scoped>
</style>