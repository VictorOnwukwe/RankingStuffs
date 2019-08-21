<template>
  <div id="main">
    <div id="container">
      <div style="flex-grow:1">
        <div style="margin-bottom:2em"></div>
        <div style="margin:0 auto;max-width:700px;">
          <v-card tile class>
            <v-card-title class="brand darken-2 primary--text pa-1 title">1. Heads-Up</v-card-title>
            <v-card-text>
              <ol class="mt-5">
                <li>
                  <p>Is the list you are about to post offensive? It probably will not be accepted.</p>
                </li>
                <li>
                  <p>Is the list you are about to post offensive? It probably will not be accepted.</p>
                </li>
                <li>
                  <p>Is the list you are about to post offensive? It probably will not be accepted.</p>
                </li>
                <li>
                  <p>Is the list you are about to post offensive? It probably will not be accepted.</p>
                </li>
                <li>
                  <p>Is the list you are about to post offensive? It probably will not be accepted.</p>
                </li>
              </ol>
            </v-card-text>
          </v-card>

          <v-card tile class="mt-4">
            <v-card-title class="brand darken-2 primary--text title pa-1">2. Add List Description</v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 style class>
                    <v-text-field color="brand" outlined label="Title" v-model="list.title"></v-text-field>
                  </v-flex>

                  <v-flex xs12 class>
                    <v-textarea
                      no-resize
                      outlined
                      auto-grow
                      label="Description"
                      color="brand"
                      v-model="list.about"
                      style="width:100%"
                    ></v-textarea>
                  </v-flex>

                  <v-flex sm6>
                    <v-select
                      :items="categories"
                      placeholder="Optional"
                      color="brand"
                      outlined
                      label="Category"
                    ></v-select>
                  </v-flex>

                  <v-flex sm6>
                    <v-select
                      :items="categories"
                      placeholder="Optional"
                      color="brand"
                      outlined
                      label="Sub-Category"
                    ></v-select>
                  </v-flex>
                  <v-flex xs12>
                    <v-textarea
                      @keyup.space="pushTag()"
                      @keyup.delete="pushTag()"
                      v-model="userTags"
                      outlined
                      :rows="1"
                      placeholder="e.g. Happy Grooving Cool"
                      no-resize
                      label="Tags"
                      color="brand"
                      class
                    ></v-textarea>
                  </v-flex>
                  <v-flex>
                    <v-layout wrap class="mt-n8">
                      <span
                        v-for="(tag, i) in tags"
                        :key="i"
                        class="brand lighten-1 mr-2 mt-2 px-3 py-1"
                        style="border-radius:999px"
                      >{{tag}}</span>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>

          <v-card tile class="mt-4">
            <v-card-title class="brand darken-2 primary--text pa-1 title">3. Add List Items</v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <div class="item" v-for="(item, index) in list.items" :key="index">
                  <AddItem
                    :parentLength="0"
                    :index="index"
                    @deleteMe="deleteItem"
                    @receiveTitle="setItemTitle"
                    @receiveAbout="setItemAbout"
                  ></AddItem>
                </div>

                <div v-if="list.items.length <= 9" id="plus-button">
                  <div @click="addItem()" class="numeric-box circle" style="cursor:pointer">
                    <span style="font-size:2.4em; color:white; font-weight:normal">+</span>
                  </div>
                </div>
              </v-container>
            </v-card-text>
          </v-card>

          <v-btn @click="upload()">Upload</v-btn>
          <v-btn @click="get()">get</v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "./Toolbar";
import Sidebar from "./Sidebar";
import AddItem from "./AddItem";
export default {
  components: {
    Toolbar,
    Sidebar,
    AddItem
  },
  data() {
    return {
      list: {
        title: "",
        about: "",
        items: [
          {
            title: "",
            about: "",
            image: undefined
          }
        ]
      },
      n: 0,
      categories: [],
      userTags: "",
      tags: []
    };
  },

  methods: {
    onFileSelect(event) {
      const files = event.target.files;
      let fileName = files[0].name;
      if (fileName.lastIndexOf(".") <= 0) {
        return alert("Invalid File Selected...");
      }

      let imageUrl;

      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        imageUrl = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.list.items[this.n].image = files[0];
      this.n++;
    },

    async upload() {
      await this.$store.dispatch("upload_list", this.list);

      alert("Upload done");

      this.$router.go(-1);
    },

    async get() {
      this.$store
        .dispatch("fetch_complete_list", "aTXawHzZOZyEZAB7a3Cy")
        .then(() => {
          console.log("done");
        });
    },

    addItem() {
      this.list.items.push({
        title: "",
        about: ""
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
      console.log(this.list.items[index].about + index);
    },

    deleteItem(index) {
      this.list.items.splice(index, 1);
    },

    fetchCategories() {
      this.$store.dispatch("fetch_categories").then(result => {
        this.categories = result.map(category => category.name);
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
  created: function() {
    this.fetchCategories();
  }
};
</script>

<style scoped>
#container {
  display: flex;
}
input {
  border: 1px solid black;
  display: block;
  margin-top: 0.3em;
}

textarea {
  border: 1px solid black;
  margin-top: 0.3em;
  resize: none;
  height: 10em;
}
.item{
  position:relative;
}

.item + .item {
  display: grid;
  grid-template-columns: 1fr;
  margin-top: 2em;
}

#plus-button {
  display: flex;
  margin: 1em 0;
  justify-content: center;
}
</style>
