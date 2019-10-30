<template>
  <v-layout class="pa-4">
    <v-flex xs12>
      <v-card flat tile>
        <v-card flat style="border: 1px solid rgb(132, 180, 255)" tile class="mb-4">
          <v-card-title
            class="text-capitalize title top-bar pa-1"
            style="font-weight:normal"
          >Favorite Items</v-card-title>
          <v-card-text>
            <v-layout class="my-4" v-if="fetchingItems" justify-center>
              <v-progress-circular size="24" indeterminate color="brand"></v-progress-circular>
            </v-layout>
            <v-list v-if="favoriteItems.length > 0">
              <v-list-item @click="goItem(favItem)" v-for="(favItem, index) in favoriteItems" :key="index">
                <v-list-item-avatar v-if="favItem.image" size="80" tile>
                  <v-img :src="favItem.image.src"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text-capitalize brand--text text-wrap">{{favItem.name}}</v-list-item-title>
                  <v-list-item-subtitle class="subtitle-2">{{favItem.category}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <p v-else class="subtitle-1 mt-4 secondary-text-dark text-center">No Favorite Items...</p>
            <v-card
              :class="addFavorites ? 'grey lighten-3' : null"
              tile
              :outlined="addFavorites"
              flat
              v-if="isProfile"
            >
              <v-layout :class="{'top-bar': addFavorites}" pl-1 align-center py-1>
                <v-icon
                  @click="addFavorites=!addFavorites"
                  :class="addFavorites ? 'accent--text' : 'grey--text'"
                  size="2.5em"
                >mdi-plus-box</v-icon>
                <div
                  class="ml-2"
                  style="font-weight:normal"
                  :class="addFavorites ? 'grey--text text--darken-3 title' : 'grey--text'"
                >Add Favorite Item</div>
              </v-layout>
              <v-divider v-if="addFavorites"></v-divider>

              <div v-if="addFavorites" class="px-4">
                <v-card class="grey lighten-3" tile flat>
                  <v-layout column>
                    <v-flex mt-8>
                      <p
                        class="text-capitalize font-weight-medium grey--text text--darken-2"
                      >Category</p>
                      <v-select
                        hint="Note: Adding an existing category overrides the previous one"
                        persistent-hint
                        solo
                        flat
                        :items="['person', 'sport', 'pet', 'animal', 'movie', 'music', 'singer', 'footballer']"
                        color="brand"
                        v-model="newFav.category"
                      ></v-select>
                    </v-flex>
                    <add-item
                      :commentPlaceholder="'[Optional] Tell us what this item means to you. Any close connection you have with it...'"
                      @receiveItem="setItem"
                      @receiveComment="setItemComment"
                    ></add-item>
                  </v-layout>

                  <v-card-actions>
                    <v-btn @click="addFavorite()" dark class="brand darken-1 ml-n3">Add</v-btn>
                  </v-card-actions>
                </v-card>
              </div>
            </v-card>
          </v-card-text>
        </v-card>
      </v-card>
      <v-card tile  flat style="border: 1px solid rgb(132, 180, 255)">
        <v-card-title
          class="text-capitalize title top-bar pa-1"
          style="font-weight:normal"
        >Favorite Lists</v-card-title>
        <v-card-text>
          <v-layout class="my-4" v-if="fetchingLists" justify-center>
            <v-progress-circular size="24" indeterminate color="brand"></v-progress-circular>
          </v-layout>
          <div v-else-if="favoriteLists.length > 0">
            <v-list>
              <template v-for="(list, index) in favoriteLists">
                <list-preview :id="list.id" :key="list.id"></list-preview>
                <v-divider v-if="index < favoriteLists.length - 1" :key="index"></v-divider>
              </template>
            </v-list>
            <v-layout v-if="fetchingMoreLists" class="mt-4" justify-center>
              <v-progress-circular size="24" indeterminate color="brand"></v-progress-circular>
            </v-layout>
            <v-layout
              v-if="favoriteLists.length !== user.favorite_lists"
              class="mt-4"
              justify-center
            >
              <v-icon @click="fetchMoreLists()" size="32">mdi-plus-circle-outline</v-icon>
            </v-layout>
          </div>
          <div v-else class="subtitle-1 mt-4 secondary-text-dark text-center">No Favorite Lists...</div>
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
      fetchingMoreLists: false,
      userTags: "",
      tags: [],
      newFav: {
        category: "",
        item: {},
        comment: ""
      }
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
    getFavoriteLists(limit, timestamp) {
      this.fetchingLists = true;
      this.$store
        .dispatch("fetch_favorite_lists", {
          limit: limit,
          timestamp: timestamp,
          user: this.user.id
        })
        .then(results => {
          for (let result of results) {
            this.favoriteLists.push(result);
          }
          this.fetchingLists = false;
        })
        .catch(error => {
          this.fetchingLists = false;
        });
    },
    fetchMoreLists() {
      this.fetchingMoreLists = true;
      this.$store
        .dispatch("fetch_favorite_lists", {
          limit: 5,
          timestamp: this.favoriteLists[this.favoriteLists.length - 1].created,
          user: this.user.id
        })
        .then(results => {
          this.favoriteLists = this.favoriteLists.concat(results);
          this.fetchingMoreLists = false;
        })
        .catch(error => {
          console.log(error);
          this.fetchingMoreLists = false;
        });
    },
    addFavorite() {
      this.$store.dispatch("favorite_item", this.newFav).then(() => {});
    },
    setItem(index, item) {
      this.newFav.item = item;
    },
    setItemComment(index, comment) {
      this.newFav.comment = comment;
    },
    go(link) {
      this.$router.push({ path: link });
    },

    goItem(item) {
      this.$router.push({
        path: "/items/" + item.name,
        query: {
          id: item.info
        }
      });
    }
  },
  mounted: function() {
    this.getFavoriteItems(5, "now");
    this.getFavoriteLists(10, false);
  }
};
</script>

<style scoped>
</style>