<template>
  <div>
    <div class="main" v-if="fetched">
      <v-layout>
        <v-flex class="list-view">
          <v-flex class="mx-auto mt-4">
            <div id="title-nav" class="inherit">
              <div
                style="max-width:950px; padding:8px; align-items:center; justify-content:space-between"
                class="mx-auto"
              >
                <h1
                  style="font-size:2em; font-weight:normal;"
                  class="sidebar--text text--darken-2 text-capitalize"
                >{{list.title}}</h1>
                <!-- <p>
                  <span class>Created by</span>
                  <span @click="showUser=true" style="font-weight:bold">&nbsp;{{creator.username}}</span>
                </p>-->
                <v-layout align-center class>
                  <div style="margin-top:0;display:flex" class>
                    &nbsp;
                    <div class="font-weight-medium" style="font-size:1.2em">{{list.rating}}&nbsp;-&nbsp;</div>
                    <!-- <div>/</div> -->
                    <!-- <div class="">5</div>
                    <div>&nbsp;-&nbsp;</div> -->
                  </div>

                  <div style="display:flex;margin-top:-0.2em">
                    <rating
                      :value="list.rating"
                      color="yellow darken-4"
                      background-color="grey"
                      half-increments
                      size="1em"
                      dense
                    ></rating>
                    <div class style="margin-top:0.15em">({{list.raters_count}})</div>
                  </div>
                </v-layout>
                <div
                  style="white-space:pre-wrap;"
                  class="mt-4 secondary-text-dark font-weight-medium"
                >{{list.description}}</div>
              </div>
              <div></div>
            </div>

            <div id="container">
              <div v-for="(item, index) in list.items" :key="index">
                <ListItem
                  :id="item.id"
                  :item="item"
                  :list="list"
                  :voted="voted"
                  :index="index + 1"
                  @hasImage="setPreview"
                  @voted="voted = true"
                ></ListItem>
                <v-card
                  tile
                  class="mt-6 mb-6 brand primary--text title pa-1 top-bar"
                  v-if="index===9 && list.items.length>10"
                >Close Contenders</v-card>
              </div>

              <v-card tile outlined class="mt-12" v-if="!list.self_moderated">
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
                  <v-btn class="brand darken-1" dark @click="upload_item()">Submit</v-btn>
                </v-card-actions>
              </v-card>
            </div>
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
                  <i
                    class="fab fa-twitter blue--text text--lighten-1 share"
                    style="font-size:2.5em"
                  ></i>
                </network>
                <network network="facebook" class="pointer">
                  <i
                    class="fab fa-facebook blue--text text--darken-3 share"
                    style="font-size:2.5em"
                  ></i>
                </network>
              </div>
              <br />
              <div style="display:flex;justify-content:space-around">
                <network network="reddit" class="pointer">
                  <i
                    class="fab fa-reddit orange--text text--darken-3 share"
                    style="font-size:2.5em"
                  ></i>
                </network>
                <network network="whatsapp" class="pointer">
                  <i class="fab fa-whatsapp green--text share" style="font-size:2.5em"></i>
                </network>
              </div>
              <br />
              <div style="display:flex;justify-content:space-around">
                <network network="linkedin" class="pointer">
                  <i
                    class="fab fa-linkedin blue--text text--darken-1 share"
                    style="font-size:2.5em"
                  ></i>
                </network>

                <network network="pinterest" class="pointer">
                  <i
                    class="fab fa-pinterest red--text text--darken-3 share"
                    style="font-size:2.5em"
                  ></i>
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
      <preview-user @close="showUser=false" :id="creator.id"></preview-user>
    </v-dialog>

    <v-navigation-drawer
      :expand-on-hover="$vuetify.breakpoint.md || $vuetify.breakpoint.sm ? true : false"
      :permanent="!$vuetify.breakpoint.xs ? true : false"
      height="calc(100vh - 3.5em)"
      style="margin-top:3.5em"
      fixed
      dark
      :temporary="$vuetify.breakpoint.xs ? true : null"
      v-model="showSidebar"
    >
      <template v-slot:prepend>
        <v-card-title>
          <v-tooltip bottom fixed>
            <template v-slot:activator="{ on }">
              <v-icon @click="share=true" color="brand lighten-2" v-on="on">share</v-icon>
            </template>
            <span class="white--text">Share</span>
          </v-tooltip>
          <v-spacer></v-spacer>
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

        <v-divider dark></v-divider>
        <v-card-title>
          <!-- <v-icon>mdi-account</v-icon> -->
          <div class="blue--text text-truncate title">Creator</div>
        </v-card-title>
        <v-list class="mt-n2">
          <v-list-item @click="showUser=true">
            <v-list-item-avatar size="45">
              <img :src="creator.profile_pic" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="secondary-text-light">@{{creator.username}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-card tile flat class="nav-bg">
          <v-divider dark></v-divider>
          <v-card-title>
            <div class="title blue--text text-truncate">{{rated ? "Your Rating" : "Rate"}}</div>
          </v-card-title>
          <v-layout v-if="checkedRated" class="pl-3" style="height:2em">
              <rating
                :readonly="rated"
                @input="rate"
                :value="userRating"
              ></rating>
              <span
                v-if="rated"
                class="secondary-text-light"
                style="margin-top:0.15em;"
              >&nbsp;({{userRating}})</span>
          </v-layout>
        </v-card>

        <v-divider dark></v-divider>
      <v-card-title>
        <div class="title blue--text text-truncate">Featured</div>
      </v-card-title>
      </template>
      <v-list dense>
        <v-list-item @click="scrollTo(item.id)" v-for="(item, index) in featured" :key="index">
          <v-list-item-icon>
            <div>{{index + 1}}</div>
          </v-list-item-icon>
          <v-list-item-content>{{item.name}}</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { setTimeout } from "timers";
import ListItem from "./ListItem";
import Sidebar from "./Sidebar";
import AddItem from "./AddItem";
import SocialSharing from "vue-social-sharing";

export default {
  components: {
    ListItem,
    Sidebar,
    AddItem,
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
      share: false,
      previewUpdated: false,
      showSidebar: false,
      checkedRated: false
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
      this.showSidebar = !this.showSidebar;
      document.querySelector(".pull-push").classList.toggle("slide");
      document.querySelector(".pull-push-icon").classList.toggle("rotate");
    },

    rate(rating) {
      this.$store
        .dispatch("rate_list", {
          rating: rating,
          id: this.listID,
          newRating:
            Math.round(
              ((this.list.rating + rating) /
                (this.list.raters_count + 1)) *
                10
            ) / 10
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

    checkVoted() {
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

      if (!this.list.anonymous) {
        this.fetchCreator();
      }
      this.checkVoted();
      this.checkRated();
      this.setFavorited();

      if (this.$route.query.notification) {
        setTimeout(() => {
          this.scrollTo(this.$route.query.item_id);
        }, 2500);
      }
      // this.setPreview();
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
      await this.$store.dispatch("check_rated", this.listID).then(rated => {
        if (rated === false) {
          null
        } else {
          this.rated = true;
          this.userRating = rated.rating;
        }
      });
      this.checkedRated = true;
    },
    setPreview(image) {
      if (!this.previewUpdated) {
        this.previewUpdated = true;
        if(this.list.preview_image && this.list.preview_image.url == image.url){
          return;
        }
        this.$store
          .dispatch("update_list_preview", { image: image, id: this.listID })
          .catch(error => {
            this.previewUpdated = false;
          });
      }
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

@media (min-width: 600px) {
  .main {
    margin-left: calc((80px - 0.5em) * -1);
  }
}
@media (min-width: 1264px) {
  .main {
    margin-left: calc((256px - 0.5em) * -1);
  }
}

#container {
  max-width: 950px;
  margin: 0 auto;
  margin-bottom: 2em;
}
.nav-bg {
  /* background: linear-gradient(90deg, rgb(241, 241, 243), rgb(247, 247, 248)); */
  background: #424242;
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
  --size: 1.5em;
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
  z-index: 8;
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
  margin-left: -1em;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
}
@media (min-width: 600px) {
  .list-view {
    margin-left: calc(80px - 0.5em);
  }
  .pull-push {
    display: none;
  }
}
@media (min-width: 1264px) {
  .list-view {
    margin-left: calc(256px - 0.5em);
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

.slide {
  animation: slide 0.2s ease-in;
  animation-fill-mode: forwards;
}

@keyframes slide {
  0% {
    transform: translateX(0);
    opacity: 0.6;
  }
  100% {
    transform: translateX(256px);
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
