<template>
  <div>
    <v-card max-width="300px">
      <v-img :src="user.profile_pic" width="100%" aspect-ratio="1.8"></v-img>
      <v-card-title class="title">@{{user.username}}</v-card-title>
      <v-card-text>
        <p class="subtitle-1 grey--text mt-n4">Joined {{userCreated}}</p>
        <v-layout justify-start class="mt-n4">
          <p>
            {{user.followers}}
            <span class="link--text">Followers</span>
          </p>
          <p class="ml-4">
            {{user.following}}
            <span class="link--text">Following</span>
          </p>
        </v-layout>
        <div v-if="!isUser">
          <v-btn
            v-if="!following"
            @click="follow()"
            small
            rounded
            class="accent grey--text text--darken-4"
          >Follow</v-btn>
          <v-btn
            v-else
            @click="unfollow()"
            small
            rounded
            class="accent grey--text text--darken-4"
          >UnFollow</v-btn>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn small depressed @click="goUser()">View profile</v-btn>
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
    return {
      following: null
    };
  },
  methods: {
    closeUserDialog() {
      this.$emit("closeDialog");
    },
    goUser() {
      let link = "/" + this.user.id + "/profile";
      this.$router.push({ path: link });
    },
    follow() {
      this.$store.dispatch("follow_user", this.user).then(() => {});
    },
    unfollow() {
      this.$store.dispatch("unfollow_user", this.user.id).then(() => {});
    },
    checkFollowing() {
      this.$store.dispatch("check_following", this.user.id).then(query => {
        if (query.length > 0) {
          this.following = true;
        } else {
          this.following = false;
        }
      });
    }
  },
  computed: {
    userCreated() {
      return moment(this.user.created.toDate()).calendar();
    },
    isUser() {
      return this.$store.getters.getUser === this.user.id;
    }
  }
};
</script>

<style scoped>
</style>