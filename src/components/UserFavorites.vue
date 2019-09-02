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
            <v-card flat tile outlined class="mt-8 pa-3">
              <p class="title grey--text mt-1">List Type</p>
              <v-radio-group v-model="list.votable">
                <v-radio color="green" label="Votable - List can be interacted with by others through voting." :value="true"></v-radio>
                <v-radio
                  color="green"
                  label="Not Votable - List cannot be interacted with through voting. Suitable for factual, statistical lists."
                  :value="false"
                ></v-radio>
              </v-radio-group>
            </v-card>
            <v-card class="mt-5" outlined flat tile>
              <p class="title grey--text ml-3 mt-1">Add Category</p>
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
                </v-layout>
              </v-container>
            </v-card>

            <v-card class="pa-3 mt-5" outlined flat tile>
              <p class="title grey--text">Add Items</p>
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
        ],
        votable: false,
        personal: true
      },
      addFavorites: false,
      addList: false
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
    uploadList(){
      this.$store.dispatch("upload_list", this.list)
    },
    setItem(index, item) {
      this.list.items[index].name = item.name;
      this.list.items[index].exists = item.exists;
    },
    setItemComment(index, comment) {
      this.list.items[index].comment = comment;
    }
  }
};
</script>

<style scoped>
</style>