<template>
  <div>
    <div class="main" v-if="fetched">
      <v-breadcrumbs
        class="crumbs px-0"
        :class="{ 'mt-n6': $vuetify.breakpoint.smAndDown }"
        :items="linkItems"
      >
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
        <template v-slot:item="props">
          <v-breadcrumbs-item :to="props.item.to" class="crumb-parent">
            <span class="crumb">
              {{ props.item.text }}
            </span>
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
      <v-layout>
        <v-flex>
          <div style="width:100%" class="inherit">
            <div>
              <h1
                v-if="list"
                style="font-size:2.2em; font-weight:normal;"
                class="sidebar--text text--darken-2 text-capitalize"
              >
                {{ list.title }}
              </h1>
              <v-layout align-center class>
                <rating
                  :rating="list.rating"
                  :ratersCount="list.raters_count"
                  :size="'1.2em'"
                ></rating>
              </v-layout>
              <div>
                <span class="ptd" v-if="list.votable"
                  >{{ list.voters_count }}
                  {{ list.voters_count > 1 ? "voters" : "voter"
                  }}<span class="htd">&nbsp;|</span></span
                >
                <span class="ptd" v-if="list.votable">
                  {{ list.votes }} votes<span class="htd">&nbsp;|</span></span
                >
                <span class="ptd"> {{ list.item_count }} items</span>
                <span class="ptd"
                  ><span class="htd">&nbsp;|</span> {{ list.views + 1 }}
                  {{ list.views + 1 == 1 ? "view" : "views" }}</span
                >
              </div>
              <div class="subtitle-2 std mt-4 text-capitalize mb-2">
                {{ list.type }} list created by:
              </div>
              <v-layout v-if="creator" align-center>
                <dp class="mr-2" :src="creator.profile_pic"></dp>
                <username :user="creator"></username>
              </v-layout>
              <div
                class="mt-4 pre-wrap spacious"
                style="margin-bottom:4em"
                v-if="list.description"
              >{{ list.description }}</div>
            </div>
            <div></div>
          </div>

          <div id="container" class="mt">
            <div v-for="(item, index) in list.items" :key="index">
              <ListItem
                :id="item.id"
                :rItem="{ id: item.id, ...item.data() }"
                :list="list"
                :list_voted="voted"
                :index="index + 1"
                @hasImage="setPreview"
                @voted="voted = true"
              ></ListItem>
            </div>

            <v-layout v-if="fetchingMore" justify-center style="margin-top:5em">
              <m-progress :size="'28'"></m-progress>
            </v-layout>

            <v-layout
              v-if="list.item_count > list.items.length"
              style="margin-top:5em"
            >
              <v-flex xs6 offset-xs3>
                <m-btn @click="loadMore()" block outlined>
                  More
                  <v-icon>mdi-chevron-down</v-icon>
                </m-btn>
              </v-flex>
            </v-layout>

            <v-card
              tile
              outlined
              style="margin-top:5em"
              class=""
              v-if="!list.self_moderated || isCreator"
            >
              <v-card-title
                class="pa-1 title-text grey lighten-4 pointer"
                @click="addItem = !addItem"
              >
                <v-icon
                  size="2.5em"
                  class="mr-2"
                  :color="addItem ? 'brand' : null"
                  >mdi-plus-box</v-icon
                >
                <span v-if="!isCreator">
                  Didn't find your option? Add to the List</span
                >
                <span v-else>Add another item to your List</span>
              </v-card-title>
              <div v-if="addItem">
                <v-card-text>
                  <AddItem
                    ref="addItem"
                    :numeral="false"
                    class="mt-4"
                    :parentLength="list.items.length"
                    :index="0"
                    @receiveItem="setItem"
                    @receiveComment="setItemComment"
                    @setValid="setValid"
                  ></AddItem>
                  <alert
                    class="mt-4"
                    :type="'success'"
                    :value="itemSubmitted"
                    :message="
                      'Your item has been submitted successfully. You will be notified on review'
                    "
                    @act="itemSubmitted = false"
                  ></alert>
                </v-card-text>

                <v-card-actions>
                  <m-btn
                    :disabled="!itemValid"
                    :loading="addingItem"
                    @click="upload_item()"
                    >Submit</m-btn
                  >
                </v-card-actions>
              </div>
            </v-card>
          </div>
        </v-flex>
      </v-layout>

      <div class="mt-4">
        <v-card-title
          class="ptd pl-0 font-weight-bold text-capitalize"
          style="font-size: 1em;"
          >Other lists you may like</v-card-title
        >
        <div class="mt-6">
          <display-lists :lists="otherLists" :sub="true"></display-lists>
        </div>
      </div>
      <div
        @click="(showSidebar = !showSidebar), (sidebarOpened = true)"
        class="pull-push black elevation-4"
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
          :url="'https://rankingstuffs.com/' + list.id"
          :title="list.title"
          :description="list.description"
          quote="Vote for your favorite songs, movies, brands, and more on rankingstuffs"
          twitter-user="rankingstuffs"
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

    <v-navigation-drawer
      :style="{
        marginTop: $vuetify.breakpoint.smAndDown ? '4.4em' : '6em',
        zIndex: 5,
        height: $vuetify.breakpoint.smAndDown
          ? 'calc(100vh - 4.4em)'
          : 'calc(100vh - 6em)',
        boxShadow:
          $vuetify.breakpoint.lgAndUp && showSidebar
            ? '3px 0px 9px rgba(0, 0, 0, 0.3)'
            : null
      }"
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
          <v-layout v-else>
            <m-progress class="ml-4 mt-2"></m-progress>
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
import AddItem from "./AddItem";
import SocialSharing from "vue-social-sharing";
import Rate from "./Rate";
import _ from "lodash";

function initialState() {
  return {
    index: null,
    list: null,
    item: {
      name: "",
      exists: false,
      comment: ""
    },
    fetched: false,
    creator: null,
    showUser: false,
    featured: [],
    userRating: 0,
    voted: undefined,
    favorited: false,
    rated: undefined,
    share: false,
    previewUpdated: false,
    showSidebar: false,
    checkedRated: false,
    addingItem: false,
    fetchingMore: false,
    itemValid: false,
    otherLists: [],
    sidebarOpened: false,
    addItem: false,
    itemSubmitted: false
  };
}

export default {

  components: {
    ListItem,
    AddItem,
    SocialSharing,
    rate: Rate
  },
  data() {
    return initialState();
  },

  head: {
    title: function () {
      return {
        inner: "List: " + _.startCase(this.destructureID(this.$route.params.id))
      }
    }
  },

  methods: {
    upload_item() {
      this.addingItem = true;
      this.itemSubmitted = false;
      setTimeout(() => {
        if (!this.list.personal) {
          this.$store
            .dispatch("add_pending_list_item", {
              list: { title: this.list.title, id: this.list.id },
              net_vote: 1,
              item: this.item,
              rank: this.list.item_count + 1
            })
            .then(() => {
              this.addingItem = false;
              this.itemSubmitted = true;
              this.item = {
                name: "",
                exists: false,
                comment: "",
                userImage: false
              };
              this.$refs.addItem.deleteItem();
            })
            .catch(error => {
              this.addingItem = false;
              this.$store.dispatch("set_snackbar", {
                show: true,
                message: "Sorry. An error occured while adding item",
                type: "error"
              });
            });
        } else {
          this.$store
            .dispatch("add_list_item", {
              list: { title: this.list.title, id: this.list.id },
              net_vote: 1,
              item: this.item,
              rank: this.list.item_count + 1
            })
            .then(item => {
              this.addingItem = false;
              this.item = {
                name: "",
                exists: false,
                comment: ""
              };
              this.$refs.addItem.deleteItem();
              this.list.items.push(item);
              this.list.item_count++;
            })
            .catch(error => {
              this.addingItem = false;
              this.$store.dispatch("set_snackbar", {
                show: true,
                message: "Sorry. This item already exists",
                type: "info"
              });
            });
        }
      }, 500);
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
          lastDoc: this.list.items[this.list.items.length - 1],
          limit: 50
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
      this.item = { ...this.item, ...item };
      this.itemSubmitted = false;
    },
    setItemComment(index, comment) {
      this.item.comment = comment;
    },

    async fetchList() {
      await this.$store
        .dispatch("fetch_complete_list", this.$route.params.id)
        .then(list => {
          this.list = list;
          this.fetched = true;
          this.fetchCreator();
          this.$store.dispatch("set_loading", false);
          // setTimeout(() => {
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
        .catch(error => {});
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
      this.$store.dispatch("fetch_user", this.list.creator.id).then(user => {
        this.creator = user;
      });
    },
    scrollTo(target) {
      let offset = this.$vuetify.breakpoint.xs ? 110 : 120;
      this.$vuetify.goTo(document.getElementById(target), {
        offset: offset
      });
    },
    setFavorited() {
      this.$store.dispatch("check_list_favorited", this.listID).then(result => {
        this.favorited = result;
      });
    },
    async startUp() {
      this.$store.dispatch("set_loading", true);
      await this.fetchList().then(() => {
        this.fetchCategoryLists();
      });
      this.checkVoted();

      if (this.$route.query.notification) {
        setTimeout(() => {
          this.scrollTo(this.$route.query.item);
        }, 2500);
      }
      // this.setPreview();
    },
    reset() {
      Object.assign(this.$data, initialState());
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
          this.list.preview_image.url.high == image.url.high
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
          text: "Categories",
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
      if (!this.authenticated) {
        return false;
      }
      return this.$store.state.user.id == this.list.creator.id;
    },
    authenticated() {
      return this.$store.state.authenticated;
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
    this.startUp();
    this.$router.beforeEach();
  },
  beforeRouteUpdate(to, from, next){
        window.document.title = "List: " + _.startCase(this.destructureID(to.params.id));
    next();
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
#container {
  margin: 0 auto;
  margin-bottom: 2em;
}
#item {
  margin-top: 2em;
}

.pull-push {
  display: flex;
  width: 3em;
  height: 3em;
  background-color: grey;
  position: fixed;
  top: 50vh;
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
    background-color: gray;
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

@media (min-width: 600px) {
  * ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: inherit;
    opacity: 0;
    border-radius: 10px;
    display: none;
  }

  * ::-webkit-scrollbar {
    width: 6px;
    /* background-color: #f5f5f5; */
  }

  * ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2) !important;
    /* border-radius: 10px; */
  }
}

.crumb {
  color: grey !important;
}
.crumb:hover {
  color: var(--brand) !important;
}
</style>
