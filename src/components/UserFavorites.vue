<template>
  <v-layout class="pa-4">
    <v-flex xs12>
      <v-card flat tile>
        <v-card outlined tile class="mb-4">
          <v-card-title
            class="text-capitalize title top-bar pa-1"
            style="font-weight:normal"
          >Favorite Items</v-card-title>
          <v-card-text>
            <v-layout class="my-4" v-if="fetchingItems" justify-center>
              <v-progress-circular indeterminate color="brand"></v-progress-circular>
            </v-layout>
            <v-card tile outlined v-else-if="favoriteItems.length > 0">
              <v-card-text class="mt-4">
                <v-list-item @click two-line v-for="(favItem, index) in favoriteItems" :key="index">
                  <v-list-item-avatar size="80" tile>
                    <v-img v-if="favItem.image" :src="favItem.image.src"></v-img>
                    <v-card flat tile v-else width="80px" height="80px" class="grey"></v-card>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class>{{favItem.name}}</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-icon small color="brand">mdi-account</v-icon>
                      {{favItem.category}}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-icon color="accent" size="22">mdi-delete</v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-card-text>
            </v-card>
            <p v-else class="subtitle-1 mt-4 secondary-text-dark text-center">No Favorite Items</p>
            <v-card tile :outlined="addFavorites" flat v-if="isProfile">
              <v-layout :class="{'top-bar': addFavorites}" pl-1 align-center py-1>
                <v-icon
                  @click="addFavorites=!addFavorites"
                  :class="addFavorites ? 'accent--text' : 'grey--text'"
                  size="2.5em"
                >mdi-plus-box</v-icon>
                <div
                  class="title ml-2"
                  :class="addFavorites ? 'grey--text text--darken-3' : 'grey--text'"
                >Add Favorite Item</div>
              </v-layout>

              <div v-if="addFavorites" class="px-2">
                <v-card tile flat>
                  <v-layout wrap>
                    <v-flex mt-8>
                      <v-select
                        hint="Note: Adding an existing category overrides the previous one"
                        persistent-hint
                        label="Category"
                        outlined
                        :items="['good', 'bad']"
                        color="brand"
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 mt-2>
                      <v-text-field
                        label="Item"
                        prepend-inner-icon="mdi-heart"
                        placeholder="e.g. Music"
                        outlined
                        color="brand"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 mt-n3>
                      <v-textarea
                        outlined
                        label="About"
                        placeholder="[Optional] Tell us what this item means to you. Any close connection you have with it..."
                        no-resize
                        color="brand"
                        prepend-inner-icon="mdi-information-variant"
                      ></v-textarea>
                    </v-flex>
                  </v-layout>

                  <v-card-actions>
                    <v-btn dark class="brand darken-1 ml-n3">Add</v-btn>
                  </v-card-actions>
                </v-card>
              </div>
            </v-card>
          </v-card-text>
        </v-card>
      </v-card>
      <v-card tile outlined>
        <v-card-title
          class="text-capitalize title top-bar pa-1"
          style="font-weight:normal"
        >Favorite Lists</v-card-title>
        <v-card-text>
          <v-layout class="my-4" v-if="fetchingLists" justify-center>
            <v-progress-circular indeterminate color="brand"></v-progress-circular>
          </v-layout>
          <v-list v-else-if="favoriteLists.length > 0">
            <template v-for="(list, index) in favoriteLists">
              <list-preview :id="list.id" :key="list.id"></list-preview>
              <v-divider v-if="index < lists.length - 1" :key="index"></v-divider>
            </template>
          </v-list>
          <div v-else class="subtitle-1 mt-4 secondary-text-dark text-center">No Favorite Lists</div>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import AddItem from "./AddItem";
import UserList from "./UserList";
export default {
  components: {
    AddItem,
    "list-preview": UserList
  },
  props: {
    id: String,
    user: Object,
    isProfile: Boolean
  },
  data() {
    return {
      addFavorites: false,
      favoriteItems: [],
      favoriteLists: [],
      fetchingItems: false,
      fetchingLists: false,
      userTags: "",
      tags: []
    };
  },
  methods: {
    getFavoriteItems(limit) {
      this.fetchingItems = true;
      this.$store
        .dispatch("fetch_favorite_items", { limit: limit, user: this.user.id })
        .then(results => {
          for (let result of results) {
            this.favoriteItems.push(result);
          }
          this.fetchingItems = false;
        })
        .catch(error => {
          this.fetchingItems = false;
        });
    },
    getFavoriteLists(limit) {
      this.fetchingLists = true;
      this.$store
        .dispatch("fetch_favorite_lists", { limit: limit, user: this.user.id })
        .then(results => {
          for (let result of results) {
            this.favoriteLists.push(result);
          }
          this.fetchingLists = false;
        })
        .catch(error => {
          this.fetchingLists = false;
        });
    }
  },
  mounted: function() {
    this.getFavoriteItems(5);
    this.getFavoriteLists(5);
  }
};
</script>

<style scoped>
</style>