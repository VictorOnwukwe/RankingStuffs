<template>
  <div>
    <div v-if="fetched">
      <v-layout reverse>
        <transition name="list-nav">
          <v-flex style shrink class="mr-n4 ml-4 list-info">
            <v-card
              style="position:sticky; top:3.0625em; height:calc(100vh - 3em); overflow-y:scroll;"
              color="nav-bg"
              class
              tile
              flat
            >
              <v-card-title>
                <v-layout justify-space-between>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon color="grey darken-3" v-on="on">favorite</v-icon>
                    </template>
                    <span class="white--text">Add List to Favorites</span>
                  </v-tooltip>
                  
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon color="#4CAF50" v-on="on">share</v-icon>
                    </template>
                    <span class="white--text">Share</span>
                  </v-tooltip>
                </v-layout>
              </v-card-title>

              <v-card tile flat class="nav-bg">
                <v-card-title class="title">Rate</v-card-title>
                <v-card-text>
                  <v-rating
                    color="yellow darken-3"
                    half-increments
                    :size="18"
                    dense
                    background-color="brand darken-3"
                    v-model="userRating"
                  ></v-rating>
                </v-card-text>
              </v-card>

              <v-card flat tile color="nav-bg">
                <v-card-title style="position:sticky; top:0" class="title nav-bg">Featured</v-card-title>
                <v-card-text>
                  <ol class="brand--text text--darken-1">
                    <li v-for="(item, index) in featured" :key="index">
                      <a
                        @click="scrollTo(item.id)"
                        class="ml-2 brand--text underline"
                      >{{item.name}}</a>
                    </li>
                  </ol>
                  <!-- <p v-for="n in 29">n</p> -->
                </v-card-text>
              </v-card>
            </v-card>
          </v-flex>
        </transition>

        <v-flex class="list-view">
          <v-flex class="mx-auto mt-4">
            <div id="title-nav" class="inherit">
              <div
                style="max-width:900px; padding:0.5em; align-items:center; justify-content:space-between"
                class="mx-auto"
              >
                <div
                  id="title"
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
                    background-color="grey darken-4"
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
                <ListItem :id="item.id" :item="item" :list="list" :index="index + 1"></ListItem>
                <v-card
                  tile
                  class="mt-6 mb-6 brand primary--text title pa-1 top-bar"
                  v-if="index===9"
                >Close Contenders</v-card>
              </div>

              <v-card tile class="mt-12">
                <v-card-title
                  class="top-bar primary--text title pa-1"
                >Didn't find your option? Add to the List</v-card-title>
                <v-card-text>
                  <AddItem
                    class="mt-4"
                    :parentLength="list.items.length"
                    :index="0"
                    @receiveItem="setItem"
                    @receiveComment="setItemComment"
                  ></AddItem>
                </v-card-text>

                <v-card-actions>
                  <v-btn class="brand darken-1 primary--text" @click="upload_item()">Submit</v-btn>
                </v-card-actions>
              </v-card>
            </div>
            <v-dialog v-model="showUser" max-width="300px">
              <PreviewUser :user="creator" @closeDialog="showUser=false"></PreviewUser>
            </v-dialog>
          </v-flex>
        </v-flex>
      </v-layout>
      <div @click="toggle()" class="pull-push"></div>
    </div>
  </div>
</template>

<script>
import { setTimeout } from "timers";
import ListItem from "./ListItem";
import Sidebar from "./Sidebar";
import AddItem from "./AddItem";
import PreviewUser from "./PreviewUser";

export default {
  components: {
    ListItem,
    Sidebar,
    AddItem,
    PreviewUser
  },
  data() {
    return {
      index: null,
      list: null,
      item: {
        name: "",
        exists: false,
        comment: ""
      },
      fetched: false,
      n: 0,
      creator: {},
      showUser: false,
      featured: []
    };
  },

  methods: {
    upload_item() {
      this.$store.dispatch("add_list_item", {
        list_id: this.listID,
        votes: 1,
        item: this.item
      });
    },

    toggle() {
      document.querySelector(".list-info").classList.toggle("show");
    },

    setItem(index, item) {
      this.item.name = item.name;
      this.item.exists = item.exists;
    },
    setItemComment(index, comment) {
      this.item.comment = comment;
    },

    async fetchList() {
      this.$store.dispatch("set_loading", true);
      await this.$store
        .dispatch("fetch_complete_list", this.$route.params.id)
        .then(list => {
          this.list = list;
          setTimeout(() => {
            console.log("fetched");
            this.fetched = true;
            this.$store.dispatch("set_loading", false)
          }, 1000);
        })
        .then(() => {
          this.featured = this.list.items.map(item => {
            return {
              name: item.title,
              id: item.id
            };
          });
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
    },
    scrollTo(target) {
      this.$vuetify.goTo(document.getElementById(target), {
        offset: 60
      });
    }
  },

  computed: {
    listID() {
      return this.$route.params.id;
    },
    getDate() {
      return this.list.created.toDate();
    },
    target() {
      return document.getElementById(this.list.items[8].id);
    }
  },

  mounted: function() {
    this.fetchList();

    if (this.$route.query.notification) {
      setTimeout(() => {
        this.scrollTo(this.$route.query.item_id);
      }, 1500);
    }

    this.fetchCreator();
  }
};
</script>

<style scoped>
#container {
  max-width: 900px;
  margin: 0 auto;
  margin-bottom: 2em;
}
.nav-bg {
  background: linear-gradient(90deg, rgb(243, 241, 241), rgb(248, 247, 247));
}
#item {
  margin-top: 2em;
}

#title-nav {
  width: 100%;
}

.pull-push {
  width: 25px;
  height: 40px;
  background-color: grey;
  position: fixed;
  top: 4.5em;
  right: 0em;
  z-index: 6;
}

.list-info {
  display: none;
  position: fixed;
  z-index: 5;
  border-left: 1px solid var(--brand);
  width: 200px;
}
@media (min-width: 800px) {
  .list-info {
    display: block;
  }
  .list-view {
    margin-right: 200px;
  }
  .pull-push {
    display: none;
  }
}
.show {
  display: block;
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
.divide {
  display: block;
  height: 1em;
  background-color: grey;
  margin-top: 1em;
}

.close-container {
  display: none;
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

.list-info {
  animation: slide 0.1s ease-in;
  transform-origin: right;
}

@keyframes slide {
  0% {
    transform: scaleX(0);
  }
  100% {
    transform: scaleX(1);
  }
}
</style>
