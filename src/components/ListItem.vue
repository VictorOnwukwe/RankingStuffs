<template>
  <div id="main">
    <v-layout mt-2>
      <v-card class="primary" tile width="100%">
        <v-card-title class="px-2 py-2 top-bar">
          <v-layout align-center>
            <v-flex shrink mr-2>
              <v-card
                flat
                elevation="3"
                :class="{'golden': index === 1, 'silver': index === 2, 'bronze': index === 3, 'plain': index > 3}"
                class="numeric-box"
                style="font-size:0.7em"
              >
                <span>{{index}}</span>
              </v-card>
            </v-flex>
            <v-flex>
              <h4
                class="title font-weight-black brand--text"
                style="border-radius:.5em; line-height:1.1;margin-top:0em; cursor:pointer;"
                @click="goItem()"
              >{{item.name}}</h4>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex shrink class>
              <div v-if="!voted">
                <v-icon @click="vote()" class="action-icon primary-text-light" size="35">mdi-vote</v-icon>Vote
              </div>
              <v-layout
                class
                style="width:2.4375em; border-radius:.3em"
                v-else
                justify-center
              >
                <h4
                  style="font-weight:bold;display:inline-block"
                >{{votePercentage()}}%</h4>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card-title>
        <v-divider></v-divider>
        <v-layout wrap>
          <v-flex xs12 sm4 xl3>
            <v-card tile class="pr-0 primary" flat height="100%" min-height="2.7em" style>
              <v-layout column style="height:100%">
                <div class v-if="info.about || info.image" column>
                  <v-card-text class="pa-1">
                    <div style="float:left; margin:0 1em 0.2em 0" v-if="info.image">
                      <v-img
                        v-model="info.image"
                        :src="info.image"
                        :width="windowSmall? 100 : 150"
                        aspect-ratio="1"
                      ></v-img>
                    </div>
                    <div v-if="info.about" class="secondary-text-dark subtitle-2">
                      {{windowSmall? info.about.slice(0,400) : info.about.slice(0,400)}}
                      <span
                        v-if="windowSmall && info.about.length>400"
                        class="brand--text"
                      >...read more</span>
                      <span v-else-if="info.about.length>400" class="brand--text">...read more</span>
                    </div>
                  </v-card-text>
                </div>
                <v-spacer></v-spacer>
                <div style="margin:0.5em 0;">
                  <v-layout justify-center>
                    <v-flex>
                      <v-layout justify-center>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon
                              class="action-icon"
                              color="grey darken-1"
                              v-on="on"
                            >mdi-eye-circle</v-icon>
                          </template>
                          <span class="white--text">View Item</span>
                        </v-tooltip>
                      </v-layout>
                    </v-flex>
                    <v-flex>
                      <v-layout justify-center>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-icon
                              @click="favoriteItem()"
                              v-on="on"
                              color="red"
                              class="action-icon"
                            >{{favorited ? "mdi-heart" : "mdi-heart-outline"}}</v-icon>
                          </template>
                          <span class="white--text">Add Item to Favorites</span>
                        </v-tooltip>
                      </v-layout>
                    </v-flex>
                    <v-flex>
                      <v-layout justify-center>
                        <v-tooltip bottom>
                          <template v-slot:activator="{on}">
                            <v-icon color="grey darken-1" v-on="on">add</v-icon>
                          </template>
                          <span>Follow Item</span>
                        </v-tooltip>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </div>
              </v-layout>
            </v-card>
          </v-flex>
          <v-flex xs12 sm8 xl9 id="comment-border">
            <v-divider class="hidden-sm-and-up"></v-divider>
            <v-card tile flat height="100%" class="pa-0">
              <v-layout style="height:100%" class column justify-space-between>
                <v-card flat tile>
                  <v-card
                    class="subtitle-1 pa-2"
                    flat
                    tile
                    v-if="comments.length == 0"
                  >Be the first to comment...</v-card>
                  <v-card flat tile v-else>
                    <v-layout class="my-2" justify-center>
                      <v-icon
                        v-if="comments.length < item.comment_count && !loadingComments"
                        @click="fetchComments(5, comments[0].created)"
                        size="1.8em"
                        class="primary-text-dark"
                      >mdi-plus-circle-outline</v-icon>
                      <div v-if="loadingComments" style="display:flex; justify-content:center">
                        <v-btn text>
                          <v-progress-circular indeterminate :value="80" :size="20" :width="3"></v-progress-circular>
                        </v-btn>
                      </div>
                    </v-layout>
                    <div v-for="(comment, index) in comments" :key="index">
                      <comment id="comment" :comment="comment" :list="list" :item="item"></comment>
                    </div>
                  </v-card>
                  <!-- <p v-for="n in 12">good</p> -->
                </v-card>
                <v-card tile flat>
                  <v-card-actions>
                    <v-layout>
                      <v-flex>
                        <v-layout class column reverse>
                          <v-flex>
                            <div style="position:relative;">
                              <comment-box
                                v-model="user_comment"
                                class="comment-box"
                                rows="1"
                                placeholder="Add Comment..."
                                :max-height="120"
                                @focused="setFocused"
                              />
                              <v-icon
                                size="1.5em"
                                @click="uploadComment()"
                                :class="focused ? 'brand--text' : null"
                                style="position:absolute; bottom:0.7em; right:0.5em"
                              >mdi-send</v-icon>
                            </div>
                          </v-flex>
                          <v-flex class="mr-2">
                            <v-layout class justify-end>
                              <a
                                v-if="item.comment_count>0"
                                class="secondary-text-dark underline"
                              >{{item.comment_count}} {{item.comment_count > 1 ? 'comments' : 'comment'}}</a>
                            </v-layout>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-card-actions>
                </v-card>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
import comment from "./comment";
import swalErrors from "../../public/my-modules/swalErrors";
import { setTimeout } from "timers";
import commentBox from "./CommentBox";

export default {
  components: {
    comment,
    commentBox
  },
  props: {
    item: Object,
    list: Object,
    index: Number,
    voted: Boolean
  },
  data() {
    return {
      user_comment: "",
      comments: [],
      display_comments: true,
      loading: false,
      commentHeight: null,
      autoGrow: true,
      Rows: 1,
      info: {},
      favorited: false,
      focused: false,
      loadingComments: false
    };
  },

  methods: {
    async uploadComment() {
      if (this.$store.state.authenticated) {
        await this.$store
          .dispatch("upload_comment", {
            item_id: this.item.id,
            list_id: this.list.id,
            comment: this.user_comment
          })
          .then(comment => {
            console.log(comment);
            this.comments.push(comment);
            this.item.comment_count++;
          });
      } else {
        swalErrors.showAuthenticationError();
      }

      this.user_comment = "";
    },

    setFocused(bool) {
      this.focused = bool;
    },

    checkGrow() {
      console.log(document.querySelector("#comment-reply").scrollHeight > 100);
      if (document.querySelector("#comment-reply").scrollHeight > 100) {
        setTimeout(() => {
          {
            this.autoGrow = false;
          }
        }, 500);
      }
    },

    favoriteItem() {
      this.$store.dispatch("favorite_item", this.info);
    },

    vote() {
      if (this.$store.state.authenticated) {
        this.$store.dispatch("add_vote", {
          item_id: this.item.id,
          list_id: this.list.id
        });
      } else {
        swalErrors.showAuthenticationError();
      }
    },

    votePercentage() {
      return Math.round((this.item.votes / this.list.votes) * 100);
    },

    async fetchComments(num, lastTimestamp) {
      this.loadingComments = true;
      return await this.$store
        .dispatch("fetch_comments", {
          item_id: this.item.id,
          list_id: this.list.id,
          num: num,
          timestamp: lastTimestamp
        })
        .then(comments => {
          for (let i = 0; i < comments.length; i++) {
            //make first created comment appear first
            this.comments.unshift(comments[i]);
          }
          this.loadingComments = false;
        })
        .catch(error => {
          console.log("Error: ", error);
          this.loadingComments = false;
        });
    },

    goItem() {
      this.$router.push({
        path: "/items/" + this.item.name,
        query: {
          id: this.info.id
        }
      });
    },

    async fetchInfo() {
      this.$store.dispatch("fetch_item", this.item.info).then(info => {
        this.info = info;
      });
    },

    setFavorited() {
      this.$store.dispatch("item_favorited", this.item.info).then(result => {
        this.favorited = result;
      });
    }
  },

  computed: {
    windowSmall() {
      return screen.width < 600;
    },
    checkHeight() {
      setTimeout(() => {
        return document.getElementById("comment-reply").scrollHeight < 130;
      }, 3000);
    }
  },

  watch: {
    info() {}
  },

  mounted: function() {
    this.fetchComments(5, "now");
    this.fetchInfo();
    this.setFavorited();
  }
};
</script>

<style scoped>
#comments {
  background-color: white;
  padding: 1em 1em;
}

@media (min-width: 600px) {
  #comment-border {
    border-left: 1px solid lightgray;
  }
}

.text-ellipsis {
  display: block;
  display: -webkit-box;
  height: 80px;
  margin: 0 auto;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

#bottom-nav {
  width: 100%;
  background-color: brown;
  height: 3em;
  display: flex;
  justify-content: center;
}

.clear-float {
  clear: both;
}

.comments-header {
  display: block;
  margin-bottom: 3em;
}

.image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.comment-box {
  /* background-color: blue; */
  /* border: 1px solid grey; */
  /* border-radius: 1em; */
}
</style>
