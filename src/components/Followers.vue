<template>
  <div>
    <span @click="fetchFollowers()" class="pointer std font-weight-medium"
      >Followers</span
    >
    <v-dialog v-model="view" max-width="400px">
      <v-card>
        <v-card-title
          style="position:sticky;top:0;z-index:2"
          class="brand lighten-3 white--text"
        >
          Followers
          <v-spacer></v-spacer>
          <v-icon @click="view = false" class="close">mdi-close</v-icon>
        </v-card-title>
        <v-card-text class="mt-4">
          <v-list v-if="!fetching">
            <div v-for="(follower, index) in followers" :key="index">
              <user-mini :id="follower.id"></user-mini>
              <v-divider
                class="grey lighten-3"
                v-if="index + 1 !== followers.length"
              ></v-divider>
            </div>
          </v-list>
          <v-layout v-else justify-center class="pa-4">
            <m-progress></m-progress>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import UserMini from "./UserMini";
export default {
  components: {
    UserMini
  },
  props: {
    id: String
  },
  data() {
    return {
      followers: [],
      view: false,
      viewed: false,
      fetching: false
    };
  },
  methods: {
    fetchFollowers() {
      this.view = true;
      if (this.viewed) {
        return;
      }
      this.fetching = true;
      this.viewed = true;
      this.$store
        .dispatch("fetch_followers", { id: this.id, limit: 50 })
        .then(followers => {
          this.followers = this.followers.concat(followers);
          this.fetching = false;
        });
    }
  }
};
</script>
