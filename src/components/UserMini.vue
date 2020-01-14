<template>
  <v-list-item :to="'/users/' + id">
    <v-list-item-avatar>
      <dp :src="user.profile_pic" :size="'3em'"></dp>
    </v-list-item-avatar>
    <v-list-item-content class="font-weight-medium">
      <div v-if="user.username">@{{ user.username }}</div>
    </v-list-item-content>
  </v-list-item>
</template>
<script>
export default {
  props: {
    id: String
  },
  data() {
    return {
      user: {}
    };
  },
  methods: {
    fetchUser() {
      this.$store.dispatch("fetch_user", this.id).then(user => {
        this.user = user;
      });
    }
  },
  created() {
    this.fetchUser();
  }
};
</script>
