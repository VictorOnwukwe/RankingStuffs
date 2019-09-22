<template>
  <div id="main" class>
    <div style="margin:0 auto;max-width:950px;">
      <div class="page-title">Create List</div>
      <v-card v-if="true" tile class>
        <v-card style="position:sticky; top:3.375em; z-index:3" tile flat>
          <v-card-title class="top-bar pa-1 title">1. Heads-Up</v-card-title>
        </v-card>
        <v-card-text>
          <ul class="primary-text-dark">
            <li class="subtitle-1">
              A list can be
              <span class="primary-text-dark font-weight-bold">Personal / General</span> and
              <span class="primary-text-dark font-weight-bold">Votable / Non-Votable.</span>
              <ul>
                <li class="subtitle-1">
                  A
                  <span class="primary-text-dark font-weight-bold">Personal</span> list appears only on your timeline and is not accesible by public search.
                </li>
                <li class="subtitle-1">
                  A
                  <span class="primary-text-dark font-weight-bold">General</span> list appears on the public timeline and is accessible by public search.
                </li>
                <li class="subtitle-1">
                  A
                  <span class="primary-text-dark font-weight-bold">Votable</span> list can be voted on.
                </li>
                <li class="subtitle-1">
                  A
                  <span class="primary-text-dark font-weight-bold">Non-Votable</span> list cannot be voted on.
                </li>
              </ul>
            </li>

            <li class="subtitle-1">Be sure to check if a list already exists before creating yours.</li>
            <li
              class="subtitle-1"
            >Be sure to check if a list is already on demand in order to receive credit for creation.</li>
          </ul>
        </v-card-text>
      </v-card>

      <v-card tile class="mt-2">
        <v-card tile flat style="position:sticky; top:3.375em;z-index:3">
          <v-card-title class="top-bar pa-1 title">2. List Type</v-card-title>
        </v-card>
        <v-card-text class>
          <v-radio-group v-model="list.personal">
            <v-radio color="brand" label="General" :value="false"></v-radio>
            <v-radio color="brand" label="Personal" :value="true"></v-radio>
          </v-radio-group>
          <v-radio-group v-model="list.votable">
            <v-radio color="brand" label="Votable" :value="true"></v-radio>
            <v-radio color="brand" label="Non-Votable" :value="false"></v-radio>
          </v-radio-group>
          <v-checkbox color="blue" v-model="list.anonymous" label="Post as Anonymous"></v-checkbox>
        </v-card-text>
      </v-card>

      <v-card tile class="mt-2">
        <v-card flat tile style="position:sticky; top:3.375em; z-index:3;">
          <v-card-title class="top-bar title pa-1">3. Add List Description</v-card-title>
        </v-card>
        <v-card-text>
          <v-container grid-list-md pa-0>
              <v-form v-model="valid">
            <v-layout wrap>
              <v-flex xs12 style class>
                <v-text-field :rules="[rules.maxLength(100), rules.minLength(1)]" counter="100" small color="brand" outlined label="Title" v-model="list.title"></v-text-field>
              </v-flex>

              <v-flex xs12 class mt-n2>
                <v-textarea
                  no-resize
                  outlined
                  auto-grow
                  label="Description"
                  color="brand"
                  v-model="list.description"
                  style="width:100%"
                  counter="250"
                  :rules="[rules.maxLength(250)]"
                ></v-textarea>
              </v-flex>

              <v-flex sm6 mt-n2>
                <v-select
                  :items="categories"
                  placeholder="Optional"
                  color="brand"
                  outlined
                  label="Category"
                ></v-select>
              </v-flex>

              <v-flex sm6 mt-n2>
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
                  <v-chip v-for="(tag, i) in tags" :key="i" close class="mr-2 mt-2">{{tag}}</v-chip>
                </v-layout>
              </v-flex>
            </v-layout>
              </v-form>
          </v-container>
        </v-card-text>
      </v-card>

      <v-card tile class="mt-2">
        <v-card flat tile style="position:sticky; top:3.375em; z-index:3">
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
          <v-btn :disabled="!valid" @click="upload()" color="brand darken-1" class="primary--text">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import Toolbar from "./Toolbar";
import Sidebar from "./Sidebar";
import AddItem from "./AddItem";
import Rules from "../rules";
import { setTimeout } from 'timers';
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
        description: "",
        items: [{}],
        personal: false,
        votable: true,
        anonymous: false
      },
      n: 0,
      categories: [],
      userTags: "",
      tags: [],
      valid: false,
      rules: Rules
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

    upload() {
      setTimeout(async() => {
        await this.$store
        .dispatch("upload_list", {
          tags: this.tags,
          ...this.list
        })
        .then(async list_id => {
          if (this.$route.query.demanded) {
            let id = this.$route.query.id;
            await this.$store
              .dispatch("send_notification", {
                type: "demand-created",
                list_id: list_id,
                demand_id: id,
                title: this.$route.query.title
              })
              .then(() => {
                this.$store.dispatch("delete_demand", id);
              });
          }
          this.$router.push({ path: "/lists/" + list_id });
        });

      alert("Upload done");
      }, 500);
    },

    addItem() {
      this.list.items.push({});

      setTimeout(() => {
        window.scrollTo(0, document.querySelector("#main").scrollHeight);
      }, 1);
    },

    setItem(index, item, image) {
      this.list.items[index] = item;
      console.log("image: ",image);
      if (item.info) {
        if (image) {
          if (!this.list.preview_image) {
            this.list.preview_image = image;
          }
        }
      }
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

ol {
  counter-reset: my-awesome-counter;
  list-style: none;
}

ol > li {
  margin: 0 0 0.5em 0;
  counter-increment: my-awesome-counter;
  position: relative;
}

ol > li::before {
  content: counter(my-awesome-counter);
  color: black;
  opacity: 0.65;
  font-size: 1.2em;
  position: absolute;
  --size: 1.3em;
  left: calc(-1.25 * var(--size));
  line-height: var(--size);
  width: var(--size);
  height: var(--size);
  top: 0.1em;
  /* background: black; */
  border-radius: 50%;
  text-align: center;
  /* box-shadow: 1px 1px 0 #999; */
}

.radio {
  appearance: none;
  display: inline-block;
  position: relative;
}
</style>
