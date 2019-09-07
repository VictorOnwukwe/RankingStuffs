<template>
  <div>
    <div v-if="fetched">
      <v-layout>
        <transition name="list-nav">
          <v-flex style shrink class="mr-4 list-info">
            <v-card
              style="height:calc(100vh - 3em); overflow-y:scroll;"
              color="nav-bg"
              width="100%"
              tile
            >
              <v-card-title>
                <v-layout justify-space-between>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon color="grey lighten-1" v-on="on">favorite</v-icon>
                    </template>
                    <span class="white--text">Add List to Favorites</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon color="brand lighten-2" v-on="on">share</v-icon>
                    </template>
                    <span class="white--text">Share</span>
                  </v-tooltip>
                </v-layout>
              </v-card-title>

              <v-card flat tile class="nav-bg">
                <v-divider class="grey"></v-divider>
                <v-card-title class="title grey--text text--lighten-2">Creator</v-card-title>
                <v-card-text>
                  <v-layout column class="ml-2">
                    <v-avatar size="45">
                      <img :src="creator.profile_pic" />
                    </v-avatar>
                    <a class="secondary-text-light mt-2 font-weight-bold" style="font-size:1.2em">{{creator.username}}</a>
                  </v-layout>
                </v-card-text>
              </v-card>

              <v-card tile flat class="nav-bg">
                <v-divider class="grey"></v-divider>
                <v-card-title class="title grey--text text--lighten-2">Rate</v-card-title>
                <v-card-text>
                  <v-rating
                    color="accent darken-1"
                    half-increments
                    :size="18"
                    dense
                    background-color="grey"
                    v-model="userRating"
                  ></v-rating>
                </v-card-text>
              </v-card>

              <v-card flat tile color="nav-bg">
                <v-divider class="grey"></v-divider>
                <v-card-title
                  style="position:sticky; top:0"
                  class="title nav-bg grey--text text--lighten-2"
                >Featured</v-card-title>
                <v-card-text>
                  <ol class="font-weight-bold">
                    <li v-for="(item, index) in featured" :key="index">
                      <a
                        @click="scrollTo(item.id)"
                        class="ml-2 grey--text text--lighten-2 underline"
                      >{{item.name}}</a>
                    </li>
                  </ol>
                  <!-- <p v-for="n in 29">n</p> -->
                </v-card-text>
              </v-card>
            </v-card>
          </v-flex>
        </transition>

        <v-flex @click="hideInfo()" class="list-view">
          <v-flex class="mx-auto mt-4">
            <div id="title-nav" class="inherit">
              <div
                style="max-width:900px; padding:0.5em; align-items:center; justify-content:space-between"
                class="mx-auto"
              >
                <h1
                  style="font-size:2em; font-weight:normal"
                  class="sidebar--text text--darken-2"
                >{{list.title}}</h1>
                <!-- <p>
                  <span class>Created by</span>
                  <span @click="showUser=true" style="font-weight:bold">&nbsp;{{creator.username}}</span>
                </p>-->
                <div class="">
                  <v-rating
                    :value="list.rating"
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
                <ListItem :id="item.id" :item="item" :list="list" :voted="voted" :index="index + 1"></ListItem>
                <v-card
                  tile
                  class="mt-6 mb-6 brand primary--text title pa-1 top-bar"
                  v-if="index===9 && list.items.length>10"
                >Close Contenders</v-card>
              </div>

              <v-card tile class="mt-12 primary">
                <v-card-title
                  class="top-bar title pa-1"
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
      <div @click="toggle()" class="pull-push accent">
          <v-icon class="pull-push-icon grey--text text--lighten-4" size="35">mdi-chevron-right</v-icon>
      </div>
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
      featured: [],
      userRating: 0,
      voted: false
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
      document.querySelector(".pull-push").classList.toggle("slide");
      document.querySelector(".pull-push-icon").classList.toggle("rotate");
    },

    hideInfo() {
      document.querySelector(".list-info").classList.remove("show");
      document.querySelector(".pull-push").classList.remove("slide");
      document.querySelector(".pull-push-icon").classList.remove("rotate");
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
            this.fetched = true;
            this.$store.dispatch("set_loading", false);
          }, 30);
        })
        .then(() => {
          this.featured = this.list.items.map(item => {
            return {
              name: item.name,
              id: item.id
            };
          });
        })
        .catch(error => {
          console.log(error);
        });
    },

    checkVote() {
      this.$store.dispatch("check_voted", this.listID).then(voted => {
        this.voted = voted;
      })
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

  mounted: async function() {
    await this.fetchList();

    if (this.$route.query.notification) {
      setTimeout(() => {
        this.scrollTo(this.$route.query.item_id);
      }, 1500);
    }

    this.fetchCreator();
    this.checkVote();
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
  /* background: linear-gradient(90deg, rgb(241, 241, 243), rgb(247, 247, 248)); */
  background: #363640;
}
#item {
  margin-top: 2em;
}

#title-nav {
  width: 100%;
}

li > a {
  font-weight: normal;
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
  color: #E0E0E0;
  font-size: 1.2em;
  position: absolute;
  --size: 22px;
  left: calc(-1 * var(--size));
  line-height: var(--size);
  width: var(--size);
  height: var(--size);
  top: 0;
  /* background: black; */
  border-radius: 50%;
  text-align: center;
  /* box-shadow: 1px 1px 0 #999; */
}

.pull-push {
  display: flex;
  width: 3em;
  height: 3em;
  background-color: var(--accent);
  position: fixed;
  top: 17.5em;
  left: -1.5em;
  z-index: 6;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  border-radius: 50%;
  cursor: pointer;
}
.pull-push-icon{
  margin-left: 1rem
}

.list-info {
  display: none;
  position: fixed;
  z-index: 5;
  width: 200px;
  margin-left: -0.3em;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
}
@media (min-width: 800px) {
  .list-info {
    display: block;
    margin-left: -1em;
  }
  .list-view {
    margin-left: 200px;
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
  animation: expand-in 0.1s ease-in;
  transform-origin: left;
}

@keyframes expand-in {
  0% {
    transform: scaleX(0);
  }
  100% {
    transform: scaleX(1);
  }
}

.slide {
  animation: slide 0.1s ease-in;
  animation-fill-mode: forwards;
}

@keyframes slide {
  0% {
    transform: translateX(0);
    opacity: 0.6;
  }
  100% {
    transform: translateX(200px);
    opacity: 1;
  }
}

.rotate {
  animation: rotate-180 0.1s ease-in;
  animation-fill-mode: forwards;
}

@keyframes rotate-180 {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(180deg);
    margin-right: 0.5em;
  }
}
</style>
