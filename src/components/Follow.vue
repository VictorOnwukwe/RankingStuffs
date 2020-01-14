<template>
  <div>
    <span
      @click="fetchUsers(50)"
      class="pointer std font-weight-medium text-capitalize"
      >{{ type }}</span
    >
    <v-dialog v-model="view" max-width="400px">
      <v-card>
        <v-card-title
          style="position:sticky;top:0;z-index:2"
          class="brand lighten-3 white--text text-capitalize"
        >
          {{ type }}
          <v-spacer></v-spacer>
          <v-icon @click="view = false" class="close">mdi-close</v-icon>
        </v-card-title>
        <v-card-text class="mt-4">
          <v-list v-if="!fetching">
            <div v-for="(user, index) in users" :key="index">
              <user-mini :id="user.id"></user-mini>
              <v-divider
                class="grey lighten-3"
                v-if="index + 1 !== users.length"
              ></v-divider>
            </div>
          </v-list>
          <v-layout justify-center>
            <m-progress v-if="fetching"></m-progress>
            <v-icon v-else-if="!complete" size="32" @click="fetchMoreUsers(50)"
              >mdi-plus-circle-outline</v-icon
            >
            <div v-else-if="complete && users.length > 0" class="htd">
              {{
                type == "followers" ? "No more followers" : "No more following"
              }}
            </div>
            <empty
              v-else
              :message="type == 'followers' ? 'No Followers' : 'No Following'"
              :height="'8em'"
              :icon="'fa-user-slash'"
            ></empty>
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
    id: String,
    type: String,
    num: Number
  },
  data() {
    return {
      users: [],
      view: false,
      viewed: false,
      fetching: false,
      complete: false
    };
  },
  methods: {
    fetchUsers(limit) {
      this.view = true;
      if (this.viewed) {
        return;
      }
      let query =
        this.type == "followers" ? "fetch_followers" : "fetch_following";
      this.fetching = true;
      this.viewed = true;
      this.$store.dispatch(query, { id: this.id, limit: limit }).then(users => {
        this.users = this.users.concat(users);
        if (users.length < limit) {
          this.complete = true;
        }
        this.fetching = false;
      });
    },
    fetchMoreUsers(limit) {
      this.fetching = true;
      let query =
        this.type == "followers" ? "fetch_followers" : "fetch_following";
      this.$store
        .dispatch(query, {
          id: this.id,
          limit: limit,
          lastDoc: this.users[this.users.length - 1]
        })
        .then(users => {
          this.users = this.users.concat(users);
          if (users.length < limit) {
            this.complete = true;
          }
          this.fetching = false;
        });
    }
  }
};
</script>
