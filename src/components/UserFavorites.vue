<template>
  <v-layout id="main">
    <v-flex xs12 sm10 offset-sm-1 lg8 offset-lg-2>
      <v-card flat tile>
        <v-card flat tile>
          <p>No Favorites</p>
        </v-card>
        <v-card tile flat>
          <v-layout class="" align-center pl-1 py-1 style="border-top:1px solid grey;">
            <div
              style="cursor:pointer"
              @click="addFavorites=!addFavorites, addList=false"
              class="numeric-box"
              :class="{brand: addFavorites, 'grey': !addFavorites}"
            >
              <span style="font-size:2em">+</span>
            </div>
            <div
              class="title ml-2"
              :class="{'black--text': addFavorites, 'grey--text': !addFavorites}"
            >Add a Favorite</div>
          </v-layout>

          <div v-if="addFavorites">
            <v-card tile flat>
              <v-layout wrap>
                <v-flex xs12 mt-4>
                  <v-text-field label="Item" prepend-inner-icon="mdi-heart" placeholder="e.g. Music" outlined color="brand"></v-text-field>
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
            </v-card>
          </div>
        </v-card>
        <v-card tile flat class="mt-4">
          <p>No lists</p>
        </v-card>
        <v-card flat tile>
          <v-layout class="" align-center pl-1 py-1 style="border-top:1px solid grey;">
            <div
              style="cursor:pointer"
              @click="addList=!addList, addFavorites=false"
              class="numeric-box"
              :class="{brand: addList, 'grey': !addList}"
            >
              <span style="font-size:2em">+</span>
            </div>
            <div
              class="title ml-2"
              :class="{'black--text': addList, 'grey--text': !addList}"
            >Add a List</div>
          </v-layout>
          <div v-if="addList">
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
                  <v-textarea label="Comment" placeholder="Add a comment on your list..." prepend-inner-icon="mdi-comment" no-resize outlined color="brand"></v-textarea>
                </v-flex>
              </v-layout>
            </v-card>

            <v-card flat tile>
              <p class="title grey--text">Add Items</p>
              <div v-for="(item, index) in list.items" :key="index">
                <AddItem
                  :parentLength="0"
                  :index="index"
                  @deleteMe="deleteItem"
                  @receiveTitle="setItemTitle"
                  @receiveAbout="setItemAbout"
                ></AddItem>
              </div>

              <v-layout justify-center>
                <div style="cursor:pointer" @click="addItem()" class="numeric-box circle">
                  <span style="font-size:2em">+</span>
                </div>
              </v-layout>
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
    },
    deleteItem(index) {
      this.list.items.splice(index, 1);
    },
    setItemTitle(index, title) {
      this.list.items[index].title = title;
    },
    setItemAbout(index, about) {
      this.list.items[index].about = about;
      console.log(this.list.items[index].about + index);
    }
  }
};
</script>

<style scoped>
#main {
  scroll-behavior: smooth;
}
</style>