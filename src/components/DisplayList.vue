<template>
  <div>
    <div class="main" v-if="fetched">
      <!-- <v-layout align-center class="std">
        <span @click="" class="underline pointer">categories</span>
        <span>&nbsp;>&nbsp;</span>
        <router-link
          class="no-deco underline std"
          :to="`/categories/${list.category}`"
          >{{ list.category }}</router-link
        >
        <div v-if="list.sub_category">
          <span>&nbsp;>&nbsp;</span>
          <router-link
            class="no-deco underline std"
            :to="`/categories/${list.category}/${list.sub_category}`"
            >{{ list.sub_category }}</router-link
          >
        </div>
      </v-layout> -->
      <v-breadcrumbs class="px-0 pb-0 crumbs" :items="linkItems">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <v-layout class="list-view">
        <v-flex>
          <v-flex class="mx-auto mt-4">
            <div id="title-nav" class="inherit">
              <div
                style="padding:8px; align-items:center; justify-content:space-between"
                class="mx-auto"
              >
                <h1
                  v-if="list"
                  style="font-size:2.2em; font-weight:normal;"
                  class="sidebar--text text--darken-2 text-capitalize"
                >
                  {{ list.title }}
                </h1>
                <!-- <p>
                  <span class>Created by</span>
                  <span @click="showUser=true" style="font-weight:bold">&nbsp;{{creator.username}}</span>
                </p>-->
                <v-layout align-center class>
                  <rating
                    :rating="list.rating"
                    :ratersCount="list.raters_count"
                    :size="'1.2em'"
                  ></rating>
                </v-layout>
                <v-layout v-if="creator" class="mt-4" align-center>
                  <v-avatar class="mr-2" size="1.8em">
                    <img
                      v-if="creator.profile_pic"
                      :src="creator.profile_pic.low"
                    />
                    <img v-else :src="require('../assets/nophoto.jpg')" />
                  </v-avatar>
                  <a
                    @click="showUser = true"
                    class="link--text font-weight-medium pointer"
                    >{{ creator.username }}</a
                  >
                </v-layout>
                <div
                  style="white-space:pre-wrap;"
                  class="mt-4 grey--text text--darken-2"
                  v-if="list.description"
                >{{ list.description }}</div>
              </div>
              <div></div>
            </div>

            <div id="container" class="mt">
              <div v-for="(item, index) in list.items" :key="index">
                <ListItem
                  :id="item.id"
                  :item="{ id: item.id, ...item.data() }"
                  :list="list"
                  :voted="voted || !list.votable"
                  :index="index + 1"
                  @hasImage="setPreview"
                  @voted="voted = true"
                ></ListItem>
                <v-card
                  flat
                  tile
                  class="my-8 grey lighten-2 pa-1 pl-2 font-weight-black grey--text text--darken-2"
                  v-if="index === 9 && list.items.length > 10"
                  >Top Contenders</v-card
                >
              </div>

              <v-layout v-if="fetchingMore" justify-center class="mt-12">
                <v-progress-circular
                  indeterminate
                  color="brand"
                ></v-progress-circular>
              </v-layout>

              <v-layout
                class="mt-12"
                v-if="list.item_count > list.items.length"
              >
                <v-flex xs8 offset-xs2>
                  <v-btn @click="loadMore()" block class="brand" depressed dark>
                    <!-- <v-icon>mdi-reload</v-icon> -->
                    LOAD MORE
                  </v-btn>
                </v-flex>
              </v-layout>

              <v-card
                tile
                outlined
                class="mt-12 grey lighten-3"
                v-if="!list.self_moderated"
              >
                <v-card-title class="pl-2 pa-1 title-text grey lighten-2">
                  <v-icon @click="addItem = !addItem" size="2.5em" class="mr-2"
                    :color="addItem ? 'accent' : null"
                    >mdi-plus-box</v-icon
                  >
                  Didn't find your option? Add to the List</v-card-title
                >
                <div v-if="addItem">
                  <v-card-text>
                    <AddItem
                      :numeral="false"
                      class="mt-4"
                      :parentLength="list.items.length"
                      :index="0"
                      @receiveItem="setItem"
                      @receiveComment="setItemComment"
                      @setValid="setValid"
                    ></AddItem>
                  </v-card-text>

                  <v-card-actions>
                    <v-btn
                      :disabled="!itemValid"
                      class="brand darken-1 white--text"
                      :loading="addingItem"
                      @click="upload_item()"
                      >Submit</v-btn
                    >
                  </v-card-actions>
                </div>
              </v-card>
            </div>
          </v-flex>
        </v-flex>
      </v-layout>

      <div class="mt-4">
        <v-card-title
          class="pl-2 pa-1 grey lighten-2 grey--text text--darken-2 text-capitalize"
          style="font-size: 1em"
          >Other {{ list.category }} lists</v-card-title
        >
        <div class="mt-6">
          <display-lists :lists="otherLists" :sub="true"></display-lists>
        </div>
      </div>
      <div
        @click="(showSidebar = !showSidebar), (sidebarOpened = true)"
        class="pull-push accent elevation-4"
      >
        <v-icon class="pull-push-icon grey--text text--lighten-4" size="35"
          >mdi-chevron-right</v-icon
        >
      </div>
    </div>
    <v-dialog v-model="share" max-width="300px">
      <v-card class="pa-4">
        <social-sharing
          v-if="fetched"
          url="https://top-ten-534ca.com/"
          :title="list.title"
          :description="list.about"
          quote="Visit trending top tens for more lists"
          twitter-user="topteneverything"
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
                <i
                  class="fab fa-whatsapp green--text share"
                  style="font-size:2.5em"
                ></i>
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
                <i
                  class="fab fa-line green--text share"
                  style="font-size:2.5em"
                ></i>
              </network>
              <network network="email" class="pointer">
                <i
                  class="fa fa-envelope red--text text--darken-2 share"
                  style="font-size:2.5em"
                ></i>
              </network>
            </div>
            <br />
            <div style="display:flex;justify-content:space-around">
              <network network="skype" class="pointer">
                <i
                  class="fab fa-skype blue--text share"
                  style="font-size:2.5em"
                ></i>
              </network>
              <network network="telegram" class="pointer">
                <i
                  class="fab fa-telegram blue--text share"
                  style="font-size:2.5em"
                ></i>
              </network>
            </div>
          </div>
        </social-sharing>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showUser" max-width="400px">
      <preview-user @close="showUser = false" :id="creator.id"></preview-user>
    </v-dialog>

    <v-navigation-drawer
      height="calc(100vh - 4.5em)"
      style="margin-top:4.5em; z-index:8;"
      v-model="showSidebar"
      fixed
      class="sidebar"
      width="280px"
    >
      <div style="font-size:18px">
        <v-card-title>
          <v-tooltip bottom fixed>
            <template v-slot:activator="{ on }">
              <v-icon
                @click="(showSidebar = false), (share = true)"
                color="brand lighten-2"
                v-on="on"
                >share</v-icon
              >
            </template>
            <span class="">Share</span>
          </v-tooltip>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon @click="toggleFavorite()" color="red" v-on="on">{{
                favorited ? "mdi-heart" : "mdi-heart-outline"
              }}</v-icon>
            </template>
            <span class="white--text">{{
              !favorited ? "Add to Favorites" : "Remove from favorites"
            }}</span>
          </v-tooltip>
        </v-card-title>

        <v-card tile flat class="">
          <v-divider dark></v-divider>
          <v-card-title>
            <div class="title text-truncate">
              {{ rated ? "Your Rating" : "Rate" }}
            </div>
          </v-card-title>
          <v-layout v-if="checkedRated" class="pl-3">
            <rate v-if="!rated" @input="rate"></rate>
            <rating
              v-else
              :rating="userRating"
              :ratersCount="list.raters_count"
              :textColor="'ptd'"
              :size="'1.3em'"
            ></rating>
          </v-layout>
        </v-card>

        <v-divider class="mt-4" dark></v-divider>
        <v-card-title>
          <div class="title ptd text-truncate">Featured</div>
        </v-card-title>
        <v-list dense>
          <v-list-item
            @click="scrollTo(item.id), (showSidebar = false)"
            v-for="(item, index) in featured"
            :key="index"
          >
            <v-list-item-icon>
              <div class="ptd">{{ index + 1 }}</div>
            </v-list-item-icon>
            <v-list-item-content class="ml-n5 text-capitalize ptd">{{
              item.name
            }}</v-list-item-content>
          </v-list-item>
        </v-list>
        <v-layout v-if="fetchingMore" class="mb-2" justify-center>
          <v-progress-circular size="18" indeterminate></v-progress-circular>
        </v-layout>
        <v-layout
          v-if="fetched && list.item_count > list.items.length"
          justify-center
          class="mt-2 mb-4"
        >
          <v-icon @click="loadMore()">mdi-plus-circle-outline</v-icon>
        </v-layout>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { setTimeout } from "timers";
import ListItem from "./ListItem";
import Sidebar from "./Sidebar";
import AddItem from "./AddItem";
import SocialSharing from "vue-social-sharing";
import Rate from "./Rate";

export default {
  components: {
    ListItem,
    Sidebar,
    AddItem,
    SocialSharing,
    rate: Rate
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
      voted: "undefined",
      favorited: false,
      rated: false,
      showUser: false,
      share: false,
      previewUpdated: false,
      showSidebar: false,
      checkedRated: false,
      addingItem: false,
      fetchingMore: false,
      itemValid: false,
      otherLists: [],
      sidebarOpened: false,
      addItem: false
    };
  },

  methods: {
    upload_item() {
      this.addingItem = true;
      this.$store
        .dispatch("add_list_item", {
          list_id: this.listID,
          list_title: this.list.title,
          votes: 1,
          item: this.item
        })
        .then(() => {
          this.addingItem = false;
        });
    },

    pull() {
      document.querySelector(".pull-push-icon").classList.add("rotate");
      document.querySelector(".pull-push").classList.add("slide");
    },
    push() {
      document.querySelector(".pull-push-icon").classList.remove("rotate");
      document.querySelector(".pull-push").classList.remove("slide");
    },

    loadMore() {
      this.fetchingMore = true;
      this.$store
        .dispatch("fetch_list_items", {
          list_id: this.list.id,
          last: {
            created: this.list.items[this.list.items.length - 1].created,
            votes: this.list.items[this.list.items.length - 1].votes
          }
        })
        .then(results => {
          this.fetchingMore = false;
          this.list.items = this.list.items.concat(results);
          this.featured = this.featured.concat(
            results.map(result => {
              return { name: result.data().name, id: result.id };
            })
          );
        });
    },

    rate(rating) {
      this.userRating = rating;
      this.rated = true;
      this.list.raters_count++;
      this.$store
        .dispatch("rate_list", {
          rating: rating,
          list: this.list
        })
        .then(newRating => {
          this.list.rating = newRating;
        });
    },

    setItem(index, item) {
      this.item = item;
    },
    setItemComment(index, comment) {
      this.item.comment = comment;
    },

    async fetchList() {
      await this.$store
        .dispatch("fetch_complete_list", this.$route.params.id)
        .then(list => {
          this.list = list;
          // setTimeout(() => {
          this.fetched = true;
          this.fetchCreator();
          this.$store.dispatch("set_loading", false);
          // }, 30);
        })
        .then(() => {
          this.featured = this.list.items.map(item => {
            return {
              name: item.data().name,
              id: item.id
            };
          });
        })
        .catch(error => {
          console.log("error: ", error);
        });
    },

    checkVoted() {
      if (this.isCreator) {
        this.voted = true;
        return;
      }
      this.$store.dispatch("check_list_voted", this.listID).then(voted => {
        this.voted = voted;
      });
    },

    async toggleFavorite() {
      if (!this.favorited) {
        this.favorited = true;
        this.$store
          .dispatch("favorite_list", {
            id: this.listID,
            title: this.list.title,
            created: this.list.created
          })
          .then(() => {});
      } else {
        this.favorited = false;
        this.$store
          .dispatch("unfavorite_list", {
            id: this.listID
          })
          .then(() => {});
      }
    },
    fetchCreator() {
      this.$store.dispatch("fetch_user", this.list.user).then(user => {
        this.creator = user;
      });
    },
    scrollTo(target) {
      this.$vuetify.goTo(document.getElementById(target), {
        offset: 90
      });
    },
    setFavorited() {
      this.$store.dispatch("check_list_favorited", this.listID).then(result => {
        this.favorited = result;
      });
    },
    async startUp() {
      this.$store.dispatch("set_loading", true);
      await this.fetchList();
      this.fetchCategoryLists();
      this.checkVoted();

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
        if (rated) {
          this.rated = true;
          this.userRating = rated.rating;
        }
      });
      this.checkedRated = true;
    },
    setPreview(image) {
      if (!this.previewUpdated) {
        this.previewUpdated = true;
        if (
          this.list.preview_image &&
          this.list.preview_image.url.low == image.url.low &&
          this.list.preview_image.url.high == image.url.high &&
          this.list.preview_image.id == image.id &&
          this.list.preview_image.item == image.item
        ) {
          return;
        }
        this.$store
          .dispatch("update_list_preview", { image: image, id: this.listID })
          .catch(error => {
            this.previewUpdated = false;
          });
      }
    },
    setValid(valid) {
      this.itemValid = valid;
    },
    fetchCategoryLists() {
      let p = 1;
      if (p == 2) {
        this.$store
          .dispatch("fetch_subcategory_lists", {
            category: this.list.category,
            subCategory: this.list.sub_category,
            limit: 10
          })
          .then(lists => {
            this.otherLists = this.otherLists.concat(lists);
          });
      } else {
        this.$store
          .dispatch("fetch_category_lists", {
            category: this.list.category,
            limit: 10
          })
          .then(lists => {
            this.otherLists = this.otherLists.concat(lists);
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
    },
    linkItems() {
      let arr = [
        {
          text: "categories",
          to: "/categories"
        },
        {
          text: this.list.category,
          to: `/categories/${this.list.category}`
        }
      ];
      this.list.sub_category
        ? (arr = [
            ...arr,
            {
              text: this.list.sub_category,
              to: `/categories/${this.list.category}/${this.list.sub_category}`
            }
          ])
        : null;

      return arr;
    },
    isCreator() {
      return this.$store.state.user.id == this.list.user;
    }
  },

  watch: {
    listID() {
      this.reset();
      this.startUp();
    },
    showSidebar() {
      this.showSidebar ? this.pull() : this.push();
    },
    sidebarOpened() {
      this.checkRated();
      this.setFavorited();
    }
  },
  created() {
    // this.list = this.$route.query.list;
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
.main {
  position: relative;
}

/* @media (min-width: 600px) {
  .main {
    margin-left: calc((80px - 0.5em) * -1);
  }
}
@media (min-width: 1264px) {
  .main {
    margin-left: calc((256px - 0.5em) * -1);
  }
} */

#container {
  /* max-width: 950px; */
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

.pull-push {
  display: flex;
  width: 3em;
  height: 3em;
  background-color: var(--accent);
  position: fixed;
  top: 17.5em;
  left: -1.5em;
  z-index: 9;
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
/* @media (min-width: 600px) {
  .list-view {
    margin-left: calc(80px);
  }
  .pull-push {
    display: none;
  }
}
@media (min-width: 1264px) {
  .list-view {
    margin-left: calc(256px - 0.5em);
  }
} */

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

.slide-in {
  animation: slide 0.2s ease-in reverse;
  animation-fill-mode: forwards;
}

@keyframes slide {
  0% {
    transform: translateX(0);
    opacity: 0.6;
  }
  100% {
    transform: translateX(280px);
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

* ::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: inherit;
  opacity: 0;
  border-radius: 10px;
  display: none;
}

* ::-webkit-scrollbar {
  width: 4px;
  /* background-color: #f5f5f5; */
}

* ::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.54) !important;
  /* border-radius: 10px; */
}
</style>
