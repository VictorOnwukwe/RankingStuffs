<template>
  <v-layout id="main">
    <v-flex xs12 sm10 offset-sm-1 lg8 offset-lg-2>
      <v-card flat tile>
        <v-card flat tile class="mt-6 mb-4">
          <p v-if="favoriteItems.length === 0" class="subtitle-1">No Favorite Items</p>
          <v-card tile outlined v-else>
            <v-card-title class="title top-bar pa-1">Favorite Items</v-card-title>
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
        </v-card>
        <v-card tile :flat="addFavorites ? false : true" v-if="isProfile">
          <v-layout
            :class="{'top-bar': addFavorites}"
            align-center
            pl-1
            py-1
          >
            <v-icon
              @click="addFavorites=!addFavorites, addList=false"
              :class="addFavorites ? 'accent--text' : 'secondary-text-dark'"
              size="40"
            >mdi-plus-box</v-icon>
            <div
              class="title ml-2"
              :class="addFavorites ? 'primary-text-dark' : 'secondary-text-dark'"
            >Add Favorite Item</div>
          </v-layout>

          <div v-if="addFavorites" class="px-3">
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
                <v-btn class="brand primary--text">Add</v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-card>
        <v-card tile flat class="mt-8">
          <v-card flat tile class="mt-6 mb-4">
            <p v-if="favoriteLists.length === 0" class="subtitle-1">No Lists</p>
            <v-card tile outlined v-else>
              <v-card-title class="title top-bar pa-1">Favorite Lists</v-card-title>
              <v-card-text class="mt-4">
                <v-list-item @click two-line v-for="(favList, index) in favoriteLists" :key="index">
                  <!-- <v-list-item-avatar size="80" tile>
                  <v-img v-if="favItem.image" :src="favItem.image.src"></v-img>
                  <v-card flat tile v-else width="80px" height="80px" class="grey"></v-card>
                  </v-list-item-avatar>-->
                  <v-list-item-content>
                    <v-list-item-title class>{{favList.title}}</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-icon small color="brand">mdi-account</v-icon>
                      <!-- {{favItem.category}} -->
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-icon>
                    <v-icon color="accent" size="22">mdi-delete</v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-card-text>
            </v-card>
          </v-card>
        </v-card>
        <v-card v-if="isProfile" :flat="addList? false : true" tile>
          <v-layout
            :class="{'top-bar': addList}"
            align-center
            pl-1
            py-1
          >
            <v-icon
              style="cursor:pointer"
              @click="addList=!addList, addFavorites=false"
              :class="addList ? 'accent--text' : 'secondary-text-dark'"
              size="40"
            >mdi-plus-box</v-icon>
            <div
              class="title ml-2"
              :class="addList ? 'primary-text-dark' : 'secondary-text-dark'"
            >Add List of Favorites</div>
          </v-layout>
          <div v-if="addList" class="pa-3">
            <v-card class="mt-8" flat outlined tile>
              <v-card-title class="title top-bar pa-1">1. Add Category</v-card-title>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field
                      outlined
                      label="Title"
                      placeholder="e.g. My Top Ten Favorite Movies"
                      color="brand"
                      v-model="list.title"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 mt-n5>
                    <v-textarea
                      label="Comment"
                      placeholder="Add a comment on your list..."
                      prepend-inner-icon="mdi-comment"
                      no-resize
                      outlined
                      color="brand"
                      v-model="list.about"
                    ></v-textarea>
                  </v-flex>
                  <v-flex xs6 mt-n5>
                    <v-select label="Category" :items="['Good', 'Bad', 'Sad']" outlined></v-select>
                  </v-flex>
                  <v-flex xs6 mt-n5>
                    <v-select label="Sub-Category" :items="['Good', 'Bad', 'Sad']" outlined></v-select>
                  </v-flex>
                  <v-flex xs12 mt-n5>
                    <v-textarea
                      @keyup.space="pushTag()"
                      @keyup.delete="pushTag()"
                      v-model="userTags"
                      outlined
                      :rows="1"
                      placeholder="Separate with space e.g. Happy Grooving Cool"
                      no-resize
                      label="Tags"
                      color="brand"
                      class
                    ></v-textarea>
                  </v-flex>
                  <v-flex>
                    <v-layout wrap class="mt-n9">
                      <v-chip v-for="(tag, i) in tags" :key="i" close class="mr-2 mt-2">{{tag}}</v-chip>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>

            <v-card class="mt-5" flat outlined tile>
              <v-card-title class="title top-bar pa-1">2. Add Items</v-card-title>
              <v-card-text class="mt-4">
                <div v-for="(item, index) in list.items" :key="index">
                  <AddItem
                    :parentLength="0"
                    :index="index"
                    @receiveItem="setItem"
                    @receiveComment="setItemComment"
                  ></AddItem>
                </div>

                <v-layout v-if="list.items.length<=10" justify-center>
                  <v-icon color="accent" size="40" @click="addItem()">mdi-plus-circle</v-icon>
                </v-layout>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="uploadList()" class="brand primary--text">Submit</v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-card>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import AddItem from "./AddItem";
export default {
  components: {
    AddItem
  },
  props: {
    id: String,
    user: String,
    isProfile: Boolean
  },
  data() {
    return {
      list: {
        title: "",
        about: "",
        items: [
          {
            name: "",
            exists: false,
            comment: ""
          }
        ]
      },
      addFavorites: false,
      addList: false,
      favoriteItems: [],
      favoriteLists: [],
      userTags: "",
      tags: []
    };
  },
  methods: {
    addItem() {
      this.list.items.push({
        name: "",
        exists: false,
        comment: ""
      });

      setTimeout(() => {
        window.scrollTo(0, document.querySelector("#main").scrollHeight);
      }, 1);
    },
    uploadList() {
      this.$store.dispatch("upload_list", { tags: this.tags, ...this.list });
    },
    setItem(index, item) {
      this.list.items[index].name = item.name;
      this.list.items[index].exists = item.exists;
    },
    setItemComment(index, comment) {
      this.list.items[index].comment = comment;
    },
    getFavoriteItems(limit) {
      this.$store
        .dispatch("fetch_favorite_items", { limit: limit, user: this.user })
        .then(results => {
          for (let result of results) {
            this.favoriteItems.push(result);
          }
        });
    },
    getFavoriteLists(limit) {
      this.$store
        .dispatch("fetch_favorite_lists", { limit: limit, user: this.user })
        .then(results => {
          for (let result of results) {
            this.favoriteLists.push(result);
          }
        });
    },
    pushTag() {
      if (this.userTags[this.userTags.length - 2] == " ") {
        return;
      }
      this.tags = this.userTags.split(" ");
      this.tags = this.tags.filter(tag => tag != " " && tag != "");
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