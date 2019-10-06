<template>
  <v-navigation-drawer
    :expand-on-hover="$vuetify.breakpoint.md || $vuetify.breakpoint.sm ? true : false"
    permanent
    height="calc(100vh - 45px)"
    class="mt-12 elevation-2"
    fixed
    dark
    :temporary="$vuetify.breakpoint.xs ? true : null"
  >
    <template v-slot:prepend>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img :src="user.profile_pic"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="title">{{user.username}}</v-list-item-title>
            <v-list-item-subtitle class>{{user.email}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>

    <v-divider></v-divider>

    <v-list nav>
      <v-list-item @click="go(profile + 'creations')">
        <v-list-item-icon>
          <v-icon color="#EEEEEE">mdi-view-list</v-icon>
        </v-list-item-icon>
        <v-list-item-title>My Creations</v-list-item-title>
      </v-list-item>
      <v-list-item @click="go(profile + '')">
        <v-list-item-icon>
          <v-icon color="#EEEEEE">mdi-star</v-icon>
        </v-list-item-icon>
        <v-list-item-title>My Favorites</v-list-item-title>
      </v-list-item>
      <v-list-item link>
        <v-list-item-icon>
          <v-icon color="#EEEEEE">mdi-creation</v-icon>
        </v-list-item-icon>
        <v-list-item-title>My Timeline</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list>
      <v-list-item @click="go('/')">
        <v-list-item-icon>
          <v-icon color="#EEEEEE">mdi-home</v-icon>
        </v-list-item-icon>

        <v-list-item-title>Home</v-list-item-title>
      </v-list-item>

      <v-list-group no-action>
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon color="#EEEEEE">mdi-view-list</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Lists</v-list-item-title>
        </template>

        <v-list-item @click>
          <v-list-item-title>All Lists</v-list-item-title>
        </v-list-item>
        <v-list-item @click>
          <v-list-item-title>Popular</v-list-item-title>
        </v-list-item>
        <v-list-item @click="go('/latest-lists')">
          <v-list-item-title>Latest</v-list-item-title>
        </v-list-item>
        <v-list-item @click>
          <v-list-item-title>Trending</v-list-item-title>
        </v-list-item>
        <v-list-item @click="go('/demanded')">
          <v-list-item-title>On Demand</v-list-item-title>
        </v-list-item>
      </v-list-group>

      <v-list-group no-action>
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon color="#EEEEEE">mdi-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Add</v-list-item-title>
        </template>

        <v-list-item @click>
          <v-list-item-title>Create List</v-list-item-title>
        </v-list-item>
        <v-list-item @click>
          <v-list-item-title>Demand List</v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    fetchCategories() {
      this.$store.dispatch("fetch_categories").then(result => {
        this.categories = result;
      });
    },
    goFavorites() {
      this.$router.push({ path: this.profile });
    },
    goCreations() {
      this.$router.push({ path: this.profile + "timeline" });
    },
    go(val) {
      this.$router.push({ path: val });
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    profile() {
      return "/" + this.user.id + "/profile/";
    }
  }
};
</script>

<style scoped>
</style>


