<template>
  <div id="main" class>
    <div id="container">
      <div style="flex-grow:1">
        <div style="margin:0 auto;max-width:900px;">
          <v-card-title class="grey--text text--darken-2 ml-n4 mb-4">Create List</v-card-title>
          <v-card tile>
            <v-card elevation="1" style="position:sticky; top:3.275em;" tile>
              <v-card-title class="top-bar pa-1 title">1. Heads-Up</v-card-title>
            </v-card>
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
            <v-card elevation="1" tile style="position:sticky; top:3.125em;z-index:3">
              <v-card-title class="top-bar pa-1 title">2. List Type</v-card-title>
            </v-card>
            <v-card-text>
              <v-radio-group v-model="list.personal">
                <v-radio
                  color="blue"
                  label="General - List appears in public search."
                  :value="false"
                ></v-radio>
                <v-radio
                  color="blue"
                  label="Personal - List only appears on your timeline and cannot appear in public search."
                  :value="true"
                ></v-radio>
              </v-radio-group>
              <v-radio-group v-model="list.votable">
                <v-radio
                  color="green"
                  label="Votable - List can be interacted with by others through voting."
                  :value="true"
                ></v-radio>
                <v-radio
                  color="green"
                  label="Not Votable - List cannot be interacted with through voting. Suitable for factual, statistical lists."
                  :value="false"
                ></v-radio>
              </v-radio-group>
            </v-card-text>
          </v-card>

          <v-card tile class="mt-4">
            <v-card elevation="1" tile style="position:sticky; top:3.375em; z-index:3;">
              <v-card-title class="top-bar title pa-1">3. Add List Description</v-card-title>
            </v-card>
            <v-card-text>
              <v-container grid-list-md pa-0>
                <v-layout wrap>
                  <v-flex xs12 style class>
                    <v-text-field color="brand" outlined label="Title" v-model="list.title"></v-text-field>
                  </v-flex>

                  <v-flex xs12 class mt-n5>
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

                  <v-flex sm6 mt-n5>
                    <v-select
                      :items="categories"
                      placeholder="Optional"
                      color="brand"
                      outlined
                      label="Category"
                    ></v-select>
                  </v-flex>

                  <v-flex sm6 mt-n5>
                    <v-select
                      :items="categories"
                      placeholder="Optional"
                      color="brand"
                      outlined
                      label="Sub-Category"
                    ></v-select>
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
                      <v-chip
                        v-for="(tag, i) in tags"
                        :key="i"
                        close
                        class="mr-2 mt-2"
                      >{{tag}}</v-chip>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>

          <v-card tile class="mt-4">
            <v-card elevation="1" tile style="position:sticky; top:3.125em; z-index:3">
              <v-card-title class="top-bar pa-1 title">4. Add List Items</v-card-title>
            </v-card>
            <v-card-text>
              <v-container grid-list-md pa-0>
                <AddItem
                  class="item"
                  v-for="(item, index) in list.items"
                  :key="index"
                  :parentLength="0"
                  :index="index"
                  @receiveItem="setItem"
                  @receiveComment="setItemComment"
                ></AddItem>

                <div v-if="list.items.length <= 9" id="plus-button">
                  <div @click="addItem()" class="numeric-box circle" style="cursor:pointer">
                    <span style="font-size:2.4em; color:white; font-weight:normal">+</span>
                  </div>
                </div>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-btn @click="upload()" color="brand darken-1" class="primary--text">Submit</v-btn>
            </v-card-actions>
          </v-card>
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
            name: "",
            exists: false,
            comment: ""
          }
        ],
        personal: false,
        votable: true
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
      await this.$store.dispatch("upload_list", {
          tags: this.tags,
          ...this.list
        }).then(list_id => {
        if (this.$route.query.demanded) {
          this.dispatch("send_notification", {
            type: "demand-created",
            list_id: list_id,
            demand_id: this.$route.query.id,
            title: this.$route.query.title
          }).then(() => {
            this.$store.dispatch("delete_demand", this.$route.query.id);
          });
        }
      });

      alert("Upload done");

      this.$router.go(-1);
    },

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

    setItem(index, item) {
      this.list.items[index].name = item.name;
      this.list.items[index].exists = item.exists;
    },
    setItemComment(index, comment) {
      this.list.items[index].comment = comment;
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

    if (this.$route.query.title) {
      this.list.title = this.$route.query.title;
    }
  }
};
</script>

<style scoped>
#container {
  display: flex;
}
.item {
  position: relative;
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
