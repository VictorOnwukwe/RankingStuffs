<template>
  <v-layout id="main">
    <v-flex xs12 sm10 offset-sm-1 lg8 offset-lg-2>
      <v-card flat tile>
        <v-card flat tile class="mt-6">
          <p>No Favorites</p>
        </v-card>
        <v-card tile flat>
          <v-layout class align-center pl-1 py-1 style="border-top:1px solid grey;">
            <v-icon
              @click="addFavorites=!addFavorites, addList=false"
              :class="{'accent--text': addFavorites, 'grey--text': !addFavorites}"
              size="40"
            >mdi-plus-box</v-icon>
            <div
              class="title ml-2"
              :class="{'black--text': addFavorites, 'grey--text': !addFavorites}"
            >Add a Favorite</div>
          </v-layout>

          <div v-if="addFavorites" class="px-3">
            <v-card tile flat>
              <v-layout wrap>
                <v-flex xs12 mt-4>
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
          <p>No lists</p>
        </v-card>
        <v-card flat tile>
          <v-layout class align-center pl-1 py-1 style="border-top:1px solid grey;">
            <v-icon
              style="cursor:pointer"
              @click="addList=!addList, addFavorites=false"
              :class="{'accent--text': addList, 'grey--text': !addList}"
              size="40"
            >mdi-plus-box</v-icon>
            <div
              class="title ml-2"
              :class="{'black--text': addList, 'grey--text': !addList}"
            >Add a List</div>
          </v-layout>
          <div v-if="addList" class="px-3">
            <v-card flat tile>
              <p class="title grey--text mt-1">Add Category</p>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    outlined
                    label="Title"
                    placeholder="e.g. My Top Ten Favorite Movies"
                    color="brand"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 mt-n3>
                  <v-textarea
                    label="Comment"
                    placeholder="Add a comment on your list..."
                    prepend-inner-icon="mdi-comment"
                    no-resize
                    outlined
                    color="brand"
                  ></v-textarea>
                </v-flex>
              </v-layout>
            </v-card>

            <v-card flat tile>
              <p class="title grey--text">Add Items</p>
              <div v-for="(item, index) in list.items" :key="index">
                <AddItem
                  :parentLength="0"
                  :index="index"
                  @receiveTitle="setItemTitle"
                  @receiveAbout="setItemAbout"
                ></AddItem>
              </div>

              <v-layout justify-center>
                <v-icon color="accent" size="40" @click="addItem()">mdi-plus-circle</v-icon>
              </v-layout>
              <v-card-actions>
                <v-btn class="brand primary--text">Add</v-btn>
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
  data() {
    return {
      list: {
        title: "",
        comment: "",
        items: [
          {
            title: "",
            comment: ""
          }
        ]
      },
      addFavorites: false,
      addList: false
    };
  },
  methods: {
    addItem() {
      this.list.items.push({
        title: "",
        comment: ""
      });

      setTimeout(() => {
        window.scrollTo(0, document.querySelector("#main").scrollHeight);
      }, 1);
    },
    setItemTitle(index, title) {
      this.list.items[index].title = title;
    },
    setItemAbout(index, about) {
      this.list.items[index].about = about;
    }
  }
};
</script>

<style scoped>
#main {
  scroll-behavior: smooth;
}
</style>