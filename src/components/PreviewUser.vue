<template>
  <div>
    <v-card v-if="fetched">
      <v-img :src="user.profile_pic" width="100%" aspect-ratio="1.8"></v-img>
      <v-card-title class="title">@{{user.username}}</v-card-title>
      <v-card-text>
        <p class="subtitle-2 secondary-text-dark">Joined {{userCreated}}</p>
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
        <div style="position:relative;" v-if="!isProfile">
          <v-btn v-if="!following" @click="follow()" small outlined color="brand">Follow</v-btn>
          <v-hover v-else v-slot:default="{ hover }">
            <v-btn
              @click="unfollow()"
              small
              rounded
              dark
              :color="hover ? 'accent' : 'brand'"
            >{{hover ? 'unfollow' : 'Following'}}</v-btn>
          </v-hover>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn small color="accent" outlined @click="closeUserDialog()">Close</v-btn>
        <v-btn small color="accent" @click="goUser()">Profile</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>Loading...</v-card>
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
      following: null,
      isProfile: false,
      fetched: false
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
      this.$store.dispatch("follow_user", this.user).then(() => {
        this.following = true;
      });
    },
    unfollow() {
      this.$store.dispatch("unfollow_user", this.user.id).then(() => {
        this.following = false;
      });
    },
    async checkFollowing() {
      await this.$store
        .dispatch("check_following", this.user.id)
        .then(result => {
          this.following = result;
        });
    },
    async matchUser() {
      this.$store.getters.getUser.id === this.user.id
        ? (this.isProfile = true)
        : (this.isProfile = false);

      await this.checkFollowing();
    }
  },
  computed: {
    userCreated() {
      return moment(this.user.created.toDate()).calendar();
    },
    isUser() {
      return this.$store.getters.getUser.id === this.user.id;
    }
  },
  mounted: function() {
    this.matchUser().then(() => {
      this.fetched = true;
    });
  }
};
</script>

<style scoped>
</style>