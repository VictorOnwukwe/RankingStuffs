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
                      <v-icon @click="share=true" color="brand lighten-2" v-on="on">share</v-icon>
                    </template>
                    <span class="white--text">Share</span>
                  </v-tooltip>
                </v-layout>

                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      @click="favoriteList()"
                      color="red"
                      v-on="on"
                    >{{favorited ? "mdi-heart" : "mdi-heart-outline"}}</v-icon>
                  </template>
                  <span class="white--text">Add List to Favorites</span>
                </v-tooltip>
              </v-card-title>

              <v-card flat tile class="nav-bg">
                <v-divider class="grey"></v-divider>
                <v-card-title class="title brand--text">Creator</v-card-title>
                <v-card-text>
                  <v-layout column class="ml-2">
                    <v-avatar size="45">
                      <img :src="creator.profile_pic" />
                    </v-avatar>
                    <a
                      @click="showUser=true"
                      class="secondary-text-dark mt-2 font-weight-bold"
                      style="font-size:1.2em"
                    >{{creator.username}}</a>
                  </v-layout>
                </v-card-text>
              </v-card>

              <v-card tile flat class="nav-bg">
                <v-divider class="grey"></v-divider>
                <v-card-title class="title brand--text">{{rated ? "Your Rating" : "Rate"}}</v-card-title>
                <v-card-text>
                  <v-layout>
                    <v-rating
                      class="hint-text-dark"
                      size="1.25em"
                      dense
                      background-color="grey darken-1"
                      color="yellow darken-4"
                      v-model="userRating"
                      clearable
                      :readonly="rated"
                      hover
                      @input="rate()"
                    ></v-rating>
                    <span v-if="rated" style="margin-top:0.15em">&nbsp;({{userRating}})</span>
                  </v-layout>
                </v-card-text>
              </v-card>

              <v-card flat tile color="nav-bg">
                <v-divider class="grey"></v-divider>
                <v-card-title
                  style="position:sticky; top:0"
                  class="title nav-bg brand--text"
                >Featured</v-card-title>
                <v-card-text>
                  <ol class="font-weight-bold">
                    <li v-for="(item, index) in featured" :key="index">
                      <a
                        @click="scrollTo(item.id)"
                        class="ml-2 brand--text text--darken-1 underline"
                      >{{item.name}}</a>
                    </li>
                  </ol>
                  <!-- <p v-for="n in 29">n</p> -->
                </v-card-text>
              </v-card>
            </v-card>
          </v-flex>
        </transition>

        <v-flex class="list-view" @click="hideInfo()">
          <v-flex class="mx-auto mt-4">
            <div id="title-nav" class="inherit">
              <div
                style="max-width:950px; padding:8px; align-items:center; justify-content:space-between"
                class="mx-auto"
              >
                <h1
                  style="font-size:2em; font-weight:normal; line-height:1.3em"
                  class="sidebar--text text--darken-2 text-capitalize"
                >{{list.title}}</h1>
                <!-- <p>
                  <span class>Created by</span>
                  <span @click="showUser=true" style="font-weight:bold">&nbsp;{{creator.username}}</span>
                </p>-->
                <v-layout align-center class>
                  <v-rating
                    :value="list.rating"
                    color="yellow darken-4"
                    background-color="grey darken-4"
                    half-increments
                    size="1.125em"
                    dense
                    readonly
                  ></v-rating>
                  <span style="margin-top:0.15em">&nbsp;({{list.rating}})&nbsp;-&nbsp;</span>
                  <div class="caption brand--text mt-1">{{list.raters_count}} reviews</div>
                </v-layout>
                <div style="white-space:pre-wrap; font-style:italic" class="mt-4">{{list.description}}</div>
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
                <v-card-title class="top-bar title pa-1">Didn't find your option? Add to the List</v-card-title>
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
      <v-dialog v-model="share" max-width="300px">
        <v-card class="pa-4">
          <social-sharing
            url="https://vuejs.org/"
            :title="list.title"
            :description="list.about"
            quote="Visit trending top tens for more lists"
            hashtags="good,great"
            twitter-user="Victor"
            inline-template
          >
            <div>
              <div style="display:flex;justify-content:space-around">
                <network network="twitter" class="pointer">
                <i class="fab fa-twitter blue--text text--lighten-1 share" style="font-size:2.5em"></i>
              </network>
                <network network="facebook" class="pointer">
                  <i class="fab fa-facebook blue--text text--darken-3 share" style="font-size:2.5em"></i>
                </network>
              </div>
              <br />
              <div style="display:flex;justify-content:space-around">
                <network network="reddit" class="pointer">
                <i class="fab fa-reddit orange--text text--darken-3 share" style="font-size:2.5em"></i>
              </network>
              <network network="whatsapp" class="pointer">
                <i class="fab fa-whatsapp green--text share" style="font-size:2.5em"></i>
              </network>
              </div>
              <br />
              <div style="display:flex;justify-content:space-around">
              <network network="linkedin" class="pointer">
                <i class="fab fa-linkedin blue--text text--darken-1 share" style="font-size:2.5em"></i>
              </network>
              
              
                <network network="pinterest" class="pointer">
                <i class="fab fa-pinterest red--text text--darken-3 share" style="font-size:2.5em"></i>
              </network>
              </div>
              <br />
              <div style="display:flex;justify-content:space-around">
              
              <network network="line" class="pointer">
                <i class="fab fa-line green--text share" style="font-size:2.5em"></i>
              </network>
              <network network="email" class="pointer">
                  <i class="fa fa-envelope red--text text--darken-2 share" style="font-size:2.5em"></i>
                </network>
              </div>
              <br />
              <div style="display:flex;justify-content:space-around">
              <network network="skype" class="pointer">
                <i class="fab fa-skype blue--text share" style="font-size:2.5em"></i>
              </network>
              <network network="telegram" class="pointer">
                <i class="fab fa-telegram blue--text share" style="font-size:2.5em"></i>
              </network>
              </div>
              
            </div>
          </social-sharing>
        </v-card>
      </v-dialog>
      <div @click="toggle()" class="pull-push accent">
        <v-icon class="pull-push-icon grey--text text--lighten-4" size="35">mdi-chevron-right</v-icon>
      </div>
    </div>
    <v-dialog v-model="showUser" max-width="300px">
      <preview-user @closeDialog="showUser=false" :user="creator"></preview-user>
    </v-dialog>
  </div>
</template>

<script>
import { setTimeout } from "timers";
import ListItem from "./ListItem";
import Sidebar from "./Sidebar";
import AddItem from "./AddItem";
import PreviewUser from "./PreviewUser";
import SocialSharing from "vue-social-sharing";

export default {
  components: {
    ListItem,
    Sidebar,
    AddItem,
    PreviewUser,
    SocialSharing
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
      creator: {},
      showUser: false,
      featured: [],
      userRating: 0,
      voted: false,
      favorited: false,
      rated: false,
      showUser: false,
      share: false
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

    rate() {
      console.log("here");
      this.$store
        .dispatch("rate_list", {
          rating: this.userRating,
          id: this.listID,
          newRating: Math.round(((this.list.rating + this.userRating) / (this.list.raters_count + 1)) * 10) / 10
        })
        .then(() => {});
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
          this.$store.dispatch("set_loading", false);
        });
    },

    checkVote() {
      this.$store.dispatch("check_list_voted", this.listID).then(voted => {
        this.voted = voted;
      });
    },

    async favoriteList() {
      this.$store.dispatch("favorite_list", {
        list_id: this.listID,
        list_title: this.list.title
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
    },
    setFavorited() {
      this.$store.dispatch("list_favorited", this.listID).then(result => {
        this.favorited = result;
      });
    },
    async startUp() {
      await this.fetchList();

      if (this.$route.query.notification) {
        setTimeout(() => {
          this.scrollTo(this.$route.query.item_id);
        }, 2500);
      }

      if (!this.list.anonymous) {
        this.fetchCreator();
      }
      this.checkVote();
      this.checkRated();
      this.setFavorited();
    },
    reset() {
      this.index = null;
      this.list = null;
      this.item = {
        name: "",
        exists: false,
        comment: ""
      };
      (this.fetched = false), (this.n = 0);
      this.showUser = false;
      this.featured = [];
      this.userRating = 0;
    },
    async checkRated() {
      this.$store.dispatch("check_rated", this.listID).then(rated => {
        if (rated === false) {
          return;
        } else {
          this.rated = true;
          this.userRating = rated.rating;
        }
      });
    }
  },

  computed: {
    listID() {
      return this.$route.params.id;
    },
    link() {
      return window.location.href;
    },
    getDate() {
      return this.list.created.toDate();
    },
    target() {
      return document.getElementById(this.list.items[8].id);
    }
  },

  watch: {
    listID() {
      console.log("here");
      this.reset();
      this.startUp();
    }
  },

  mounted: async function() {
    this.startUp();
  }
};
</script>

<style scoped>
.share {
  font-size: 2em;
  margin: 1em;
}

#container {
  max-width: 950px;
  margin: 0 auto;
  margin-bottom: 2em;
}
.nav-bg {
  /* background: linear-gradient(90deg, rgb(241, 241, 243), rgb(247, 247, 248)); */
  background: #e9e9ed;
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
  color: #6c6c6c;
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
.pull-push-icon {
  margin-left: 1rem;
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
    margin-left: -0.5em;
    box-shadow: none;
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
