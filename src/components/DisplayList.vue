<template>
  <div>
    <div v-if="fetched">
      <div id="popout"></div>
      <div id="title-nav" class="inherit">
        <div
          style="max-width:800px; align-items:center; justify-content:space-between"
          class="mx-auto"
        >
          <div
            style="font-size:1.4em;font-weight:bold;"
            class="blue--text text--darken-2"
          >{{list.title}}</div>
          <p>
            <span class>Created by</span>
            <span @click="showUser=true" style="font-weight:bold">&nbsp;{{creator.username}}</span>
          </p>
          <div class="mt-n4 ml-n1">
            <v-rating
              :value="3"
              color="yellow darken-3"
              background-color="grey darken-1"
              half-increments
              :size="18"
              dense
              readonly
            ></v-rating>
          </div>
        </div>
        <div></div>
      </div>

      <div id="container">
        <div v-for="(item, index) in list.items" :key="index">
          <Item :item="item" :list="list" :index="index + 1"></Item>
          <div class="divide" v-if="index===9"></div>
        </div>

        <v-card tile class="mt-12">
          <v-card-title
            class="brand darken-2 primary--text title pa-1"
          >Didn't find your option? Add to the List</v-card-title>
          <v-card-text>
            <div class="item animated bounceIn" v-for="(item, index) in items" :key="item.id">
              <AddItem
                :parentLength="list.items.length"
                :index="index"
                @receiveTitle="setItemTitle"
                @receiveAbout="setItemAbout"
              ></AddItem>
            </div>

            <div id="plus-button">
              <div @click="addItem()" class="numeric-box circle" style="cursor:pointer">
                <span style="font-size:2.4em; color:white; font-weight:normal">+</span>
              </div>
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn class="brand primary--text" @click="upload_item()">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
    <v-dialog v-model="showUser" max-width="300px">
      <PreviewUser :user="creator" @closeDialog="showUser=false"></PreviewUser>
    </v-dialog>
  </div>
</template>

<script>
import { setTimeout } from "timers";
import Item from "./Item";
import Sidebar from "./Sidebar";
import AddItem from "./AddItem";
import PreviewUser from "./PreviewUser";

export default {
  components: {
    Item,
    Sidebar,
    AddItem,
    PreviewUser
  },
  data() {
    return {
      index: null,
      list: null,
      items: [
        {
          title: "",
          about: "",
          image: undefined
        }
      ],
      fetched: false,
      n: 0,
      creator: {},
      showUser: false
    };
  },

  methods: {
    onFileSelect(event) {
      const files = event.target.files;
      let fileName = files[0].name;
      if (fileName.lastIndexOf(".") <= 0) {
        return alert("Invalid File Selected...");
      }

      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.imageUrl = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.items[this.n].image = files[0];
      this.n++;
    },

    addItem() {
      this.items.push({
        title: "",
        about: "",
        image: undefined
      });

      setTimeout(() => {
        window.scrollTo(0, document.querySelector("#main").scrollHeight);
      }, 1);
    },

    upload_item() {
      for (let item of this.items) {
        this.$store.dispatch("add_list_item", {
          list_id: this.listID,
          item: {
            votes: 1,
            ...item
          }
        });
      }
    },

    setItemTitle(index, title) {
      this.items[index].title = title;
    },
    setItemAbout(index, about) {
      this.items[index].about = about;
      console.log(this.items[index].about);
    },

    async fetchList() {
      await this.$store
        .dispatch("fetch_complete_list", this.$route.params.id)
        .then(list => {
          this.list = list;
          setTimeout(() => {
            console.log("fetched");
            this.fetched = true;
          }, 1000);
        })
        .catch(error => {
          console.log(error);
        });
    },

    async favoriteList() {
      this.$store.dispatch("add_favorite", {
        list_id: this.listID,
        list_title: this.list.title,
        preview_image: this.list.items[0].image
      });
    },
    fetchCreator() {
      this.$store.dispatch("fetch_user", this.list.user).then(user => {
        this.creator = user;
      });
    }
  },

  computed: {
    listID() {
      return this.$route.params.id;
    },
    getDate() {
      return this.list.created.toDate();
    }
  },

  mounted: async function() {
    let index = -1;
    index = this.$store.state.lists.findIndex(list => {
      return list.id === this.listID;
    });
    if (index >= 0) {
      console.log(this.$store.state.lists[index]);
      this.list = this.$store.state.lists[index];
      setTimeout(() => {
        this.fetched = true;
      }, 1000);
    } else {
      console.log("here too");
      this.fetchList();
    }

    this.fetchCreator();
  }
};
</script>

<style scoped>
#container {
  max-width: 800px;
  margin: 0 auto;
  margin-bottom: 2em;
}
#item {
  margin-top: 2em;
}

#title-nav {
  width: 100%;
}

#plus-button {
  display: flex;
  margin: 1em 0;
  justify-content: center;
}

.item {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  margin-top: 2em;
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

.divide {
  display: block;
  height: 1em;
  background-color: grey;
  margin-top: 1em;
}

.close-container {
  display: none;
}
.item:hover .close-container {
  display: block;
}
.close-button {
  position: absolute;
  right: 3px;
  top: 7px;
}
.close-button:hover {
  color: rgb(172, 5, 5);
  cursor: pointer;
}
</style>
