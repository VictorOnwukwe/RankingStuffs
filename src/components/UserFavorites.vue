<template>
  <v-layout class="py-4 px-2 mt-4">
    <v-flex xs12>
      <v-card flat tile class="mb-4">
        <v-card-title
          class="text-capitalize top-bar pa-1 pl-2 title-text font-weight-medium"
          >Items</v-card-title
        >
        <v-card-text class="pa-0">
          <v-layout class="my-4" v-if="fetchingItems" justify-center>
            <m-progress></m-progress>
          </v-layout>
          <v-list v-else-if="favoriteItems.length > 0">
            <v-list-item v-for="(favItem, index) in favoriteItems" :key="index">
              <v-list-item-avatar v-if="favItem.data().image" size="80" tile>
                <v-img :src="favItem.data().image.src"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  class="text-capitalize link--text text-wrap"
                  :style="{ fontSize: fontSize }"
                  >{{ favItem.data().name }}</v-list-item-title
                >
                <v-list-item-subtitle class="subtitle-2">{{
                  favItem.id
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <empty
            v-else
            :message="'No Favorite Items'"
            :height="'13em'"
            :icon="'fa-boxes'"
          ></empty>
          <v-layout class="my-4" v-if="fetchingMoreItems" justify-center>
            <m-progress></m-progress>
          </v-layout>
          <v-layout
            v-if="
              favoriteItems.length !== user.favorite_items &&
                favoriteItems.length > 0
            "
            class="mt-4"
            justify-center
          >
            <v-icon @click="fetchMoreItems()" size="32"
              >mdi-plus-circle-outline</v-icon
            >
          </v-layout>

          <v-card tile flat v-if="isProfile">
            <div :class="addFavorites ? 'grey lighten-3' : null">
              <v-hover v-slot:default="{ hover }">
                <v-layout
                  :class="{
                    'grey lighten-2': addFavorites,
                    'grey lighten-4': hover
                  }"
                  pl-2
                  align-center
                  py-1
                  @click="addFavorites = !addFavorites"
                  class="pointer"
                >
                  <v-icon
                    :color="addFavorites ? 'brand' : 'grey lighten-1'"
                    size="2.5em"
                    >mdi-plus-box</v-icon
                  >
                  <div
                    class="ml-2"
                    style="font-weight:normal"
                    :class="
                      addFavorites
                        ? 'grey--text text--darken-3 font-weight-bold'
                        : 'grey--text'
                    "
                  >
                    Add Favorite Item
                  </div>
                </v-layout>
              </v-hover>

              <div v-if="addFavorites" class="px-4">
                <v-card class="grey lighten-3" tile flat>
                  <v-layout column>
                    <v-flex mt-8>
                      <p
                        class="text-capitalize font-weight-medium grey--text text--darken-2"
                      >
                        Category
                      </p>
                      <v-autocomplete
                        hint="Note: Adding an existing category overrides the previous one"
                        persistent-hint
                        solo
                        flat
                        :items="[
                          'person',
                          'sport',
                          'pet',
                          'animal',
                          'movie',
                          'music',
                          'singer',
                          'footballer'
                        ]"
                        color="brand"
                        v-model="newFav.category"
                        no-data-text="Oops! This is new to us..."
                      ></v-autocomplete>
                    </v-flex>
                    <add-item
                      :commentPlaceholder="
                        '[Optional] Tell us what this item means to you. Any close connection you have with it...'
                      "
                      @receiveItem="setItem"
                      @receiveComment="setItemComment"
                      @setValid="setValid"
                      :numeral="false"
                    ></add-item>
                  </v-layout>

                  <v-card-actions>
                    <m-btn
                      :disabled="!valid || newFav.category == ''"
                      @click="addFavorite()"
                      class="ml-n4"
                      >Add</m-btn
                    >
                  </v-card-actions>
                </v-card>
              </div>
            </div>
          </v-card>
        </v-card-text>
      </v-card>
      <v-card tile flat class>
        <v-card-title
          class="text-capitalize top-bar pa-1 pl-2 title-text font-weight-medium"
          >Lists</v-card-title
        >
        <v-card-text class="pa-0">
          <v-layout class="my-4" v-if="fetchingLists" justify-center>
            <m-progress></m-progress>
          </v-layout>
          <div v-else-if="favoriteLists.length > 0">
            <v-list>
              <template v-for="(list, index) in favoriteLists">
                <list-preview
                  :id="list.data().list"
                  :key="list.id"
                ></list-preview>
                <v-divider
                  class="grey lighten-3"
                  style="margin-left:100px"
                  v-if="index < favoriteLists.length - 1"
                  :key="index"
                ></v-divider>
              </template>
            </v-list>
            <v-layout v-if="fetchingMoreLists" class="mt-4" justify-center>
              <m-progress></m-progress>
            </v-layout>
            <v-layout
              v-if="favoriteLists.length !== user.favorite_lists"
              class="mt-4"
              justify-center
            >
              <v-icon @click="fetchMoreLists()" size="32"
                >mdi-plus-circle-outline</v-icon
              >
            </v-layout>
          </div>
          <empty
            v-else
            :message="'No Favorite Lists'"
            :height="'13em'"
            :icon="'fa-list-alt'"
          ></empty>
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
      fetchingMoreItems: false,
      userTags: "",
      tags: [],
      newFav: {
        category: "",
        item: {},
        comment: ""
      },
      valid: false
    };
  },
  methods: {
    getFavoriteItems(limit) {
      this.fetchingItems = true;
      this.$store
        .dispatch("fetch_favorite_items", {
          limit: limit,
          user: this.user.id,
          timestamp: "now"
        })
        .then(results => {
          this.favoriteItems = results;
          this.fetchingItems = false;
        })
        .catch(error => {
          this.fetchingItems = false;
        });
    },
    fetchMoreItems() {
      this.fetchingMoreItems = true;
      this.$store
        .dispatch("fetch_favorite_items", {
          limit: 10,
          user: this.user.id,
          timestamp: this.favoriteItems[this.favoriteItems.length - 1].data()
            .created
        })
        .then(results => {
          for (let result of results) {
            this.favoriteItems = this.favoriteItems.concat(result);
          }
          this.fetchingMoreItems = false;
        })
        .catch(error => {
          this.fetchingMoreItems = false;
        });
    },
    setValid(val) {
      this.valid = val;
    },
    getFavoriteLists(limit) {
      this.fetchingLists = true;
      this.$store
        .dispatch("fetch_favorite_lists", {
          limit: limit,
          user: this.user.id
        })
        .then(results => {
          this.favoriteLists = this.favoriteLists.concat(results);
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
          limit: 10,
          timestamp: this.favoriteLists[this.favoriteLists.length - 1].data()
            .created,
          user: this.user.id
        })
        .then(results => {
          this.favoriteLists = this.favoriteLists.concat(results);
          this.fetchingMoreLists = false;
        })
        .catch(error => {
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
  computed: {
    fontSize() {
      return this.$vuetify.breakpoint.xs ? "1.3em" : "1.5em";
    }
  },
  mounted: function() {
    this.getFavoriteItems(10, "now");
    this.getFavoriteLists(10);
  }
};
</script>

<style scoped></style>
