<template>
  <div id="main">
    <v-card tile class="" flat>
      <v-divider class="grey lighten-1 mt-4 mb-2"></v-divider>
      <v-card-title class="px-2 py-2">
        <v-layout align-center>
          <v-flex shrink mr-2>
            <div
              :class="{
                golden: index === 1,
                silver: index === 2,
                'bronze white--text': index === 3,
                plain: index > 3
              }"
              class="numeric-box"
              style="font-size:0.5em"
            >
              <span>{{ index }}</span>
            </div>
          </v-flex>
          <v-flex>
            <router-link
              v-if="item.is_link"
              class="font-weight-medium text-capitalize ptd no-deco"
              style="font-size:1em;line-height:1em !important;"
              :to="itemPath"
              >{{ item.name }}</router-link
            >
            <span
              v-else
              class="font-weight-medium text-capitalize ptd no-deco"
              >{{ item.name }}</span
            >
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex shrink class>
            <v-layout justify-center align-center>
              <v-layout column align-center>
                <v-icon
                  size="1.4em"
                  @click="upvote()"
                  :class="{
                    'green--text': votedThis.type == 'upvote',
                    'grey--text': votedThis.type !== 'upvote'
                  }"
                  :disabled="!checkedVoted"
                  :style="{
                    cursor: votedThis !== false ? 'default' : 'pointer'
                  }"
                  >{{
                    votedThis.type == "upvote"
                      ? "mdi-arrow-up-bold-box"
                      : "mdi-arrow-up-bold-box-outline"
                  }}</v-icon
                >
                <span class="caption std mt-n1">{{ item.upvotes }}</span>
              </v-layout>
              <v-layout column align-center>
                <v-icon
                  size="1.4em"
                  @click="downvote()"
                  :disabled="!checkedVoted"
                  :style="{
                    cursor: votedThis !== false ? 'default' : 'pointer'
                  }"
                  :class="{
                    'red--text': votedThis.type == 'downvote',
                    'grey--text': votedThis.type !== 'downvote'
                  }"
                  >{{
                    votedThis.type == "downvote"
                      ? "mdi-arrow-down-bold-box"
                      : "mdi-arrow-down-bold-box-outline"
                  }}</v-icon
                >
                <span class="caption std mt-n1">{{ item.downvotes }}</span>
              </v-layout>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-title>
      <!-- <v-divider class="hidden-xs-only"></v-divider> -->
      <v-layout :column="true" class="mt-2">
        <v-flex shrink v-if="info.image || info.about">
          <v-layout column style="height:100%">
            <v-card-text v-if="info.image || info.about" class="px-2 py-0">
              <div style="margin:0 0.5em 0.1em 0; float:left" v-if="info.image">
                <img-prev
                  class="ml-10 mr-2"
                  v-model="info.image"
                  :image="info.image"
                  :width="200"
                  :aspect-ratio="1"
                  :path="{ item: info.id }"
                ></img-prev>
              </div>
              <p v-if="info.about" class="std pa-0" style="pre-wrap;">
                {{ info.about.slice(0, 500) }}
                <a
                  v-if="info.about.length > 500"
                  class="link--text underline"
                  @click.stop="goItem()"
                  >...read more</a
                >
              </p>
            </v-card-text>
          </v-layout>
        </v-flex>
        <v-flex id="comment-border">
          <!-- <v-divider class=""></v-divider> -->
          <v-card flat height="100%" class="pa-0">
            <v-layout style="height:100%" class column justify-space-between>
              <v-card flat tile>
                <v-card
                  class="subtitle-1 px-4 py-1 htd"
                  flat
                  v-if="item.comment_count == 0"
                  >Be the first to comment...</v-card
                >
                <v-card flat v-else>
                  <display-comments
                    :comments="comments"
                    :list="list"
                    :item="item"
                  ></display-comments>
                  <v-layout
                    class="my-3"
                    justify-center
                    v-if="
                      comments.length < item.comment_count && !loadingComments
                    "
                  >
                    <v-icon
                      @click="fetchMoreComments(10)"
                      size="1.8em"
                      color="grey darken-1"
                      class="ptd"
                      >mdi-plus-circle-outline</v-icon
                    >
                    <div
                      v-if="loadingComments || addingComment"
                      style="display:flex; justify-content:center"
                    >
                      <m-progress></m-progress>
                    </div>
                  </v-layout>
                </v-card>
                <!-- <div v-if="addingComment" style="display:flex; justify-content:center">
                  <v-progress-circular indeterminate :size="20" :width="3"></v-progress-circular>
                </div> -->
                <!-- <p v-for="n in 12">good</p> -->
              </v-card>
              <v-card-actions>
                <v-layout column reverse>
                  <v-flex>
                    <div style="position:relative;">
                      <comment-box
                        v-model="comment"
                        class="comment-box"
                        rows="1"
                        placeholder="Add Comment..."
                        :max-height="126"
                        @focused="setFocused"
                      />
                      <v-icon
                        size="1.2em"
                        @click="uploadComment()"
                        :class="
                          focused && comment.trim() != ''
                            ? 'accent--text'
                            : 'grey--text'
                        "
                        style="position:absolute; bottom:1em; right:0.8em"
                        :disabled="comment.trim() == ''"
                        >fa-paper-plane</v-icon
                      >
                    </div>
                  </v-flex>
                  <v-flex class="mr-2">
                    <v-layout class justify-end>
                      <a v-if="item.comment_count > 0" class="std underline"
                        >{{ item.comment_count }}
                        {{ item.comment_count > 1 ? "comments" : "comment" }}</a
                      >
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-card-actions>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import comment from "./comment";
import swalErrors from "../../public/my-modules/swalErrors";
import { setTimeout } from "timers";
import commentBox from "./CommentBox";
import DisplayComments from "./DisplayComments";

export default {
  components: {
    comment,
    commentBox,
    "display-comments": DisplayComments
  },
  props: {
    item: Object,
    list: Object,
    index: Number,
    list_voted: Boolean
  },
  data() {
    return {
      comment: "",
      comments: [],
      display_comments: true,
      loading: false,
      commentHeight: null,
      autoGrow: true,
      Rows: 1,
      info: {},
      favorited: false,
      focused: false,
      loadingComments: false,
      votedThis: { type: "undefined" },
      commentsFetched: false,
      infoFetched: false,
      addingComment: false,
      checkedVoted: false
    };
  },

  methods: {
    async uploadComment() {
      if (this.user_comment === "") {
        return;
      }
      this.addingComment = true;
      await this.$store
        .dispatch("upload_comment", {
          item: this.item,
          list: this.list,
          comment: this.comment
        })
        .then(comment => {
          this.addingComment = false;
          this.comments.push(comment);
          this.comment = "";
          this.item.comment_count++;
        })
        .catch(error => {
          this.addingComment = false;
        });
    },

    setFocused(bool) {
      this.focused = bool;
    },

    upvote() {
      if (this.votedThis !== false) {
        return;
      }
      this.$emit("voted");
      this.votedThis = { type: "upvote" };
      this.item.upvotes++;
      this.$store.dispatch("upvote", {
        item: this.item,
        list: this.list,
        list_voted: this.list_voted
      })
    },
    downvote() {
      if (this.votedThis !== false) {
        return;
      }
      this.$emit("voted");
      this.votedThis = { type: "downvote" };
      this.item.downvotes++;
      this.$store.dispatch("downvote", {
        item: this.item,
        list: this.list,
        list_voted: this.list_voted
      });
    },

    async fetchComments(limit) {
      this.loadingComments = true;
      this.$store
        .dispatch("fetch_comments", {
          item_id: this.item.id,
          list_id: this.list.id,
          limit: limit
        })
        .then(comments => {
          this.comments = comments;
          this.loadingComments = false;
        })
        .catch(error => {
          console.log("Error: ", error);
          this.loadingComments = false;
        });
    },

    async fetchMoreComments(limit) {
      this.loadingComments = true;
      this.$store
        .dispatch("fetch_comments", {
          item_id: this.item.id,
          list_id: this.list.id,
          limit: limit,
          lastDoc: this.comments[this.comments.length - 1]
        })
        .then(comments => {
          this.comments = this.comments.concat(comments);
          this.loadingComments = false;
        })
        .catch(error => {
          console.log("Error: ", error);
          this.loadingComments = false;
        });
    },

    goItem() {
      this.$router.push();
    },

    async fetchInfo() {
      this.$store
        .dispatch("fetch_item", this.item.info)
        .then(info => {
          this.info = info;
          info.image
            ? this.$emit("hasImage", { item: this.item.info, ...info.image })
            : null;
        })
        .then(() => {
          this.infoFetched = true;
        });
    },
    async checkVoted() {
      if (this.list_voted == undefined || this.checkedVoted) {
        return;
      }
      if (this.list_voted == false) {
        this.votedThis = false;
        this.checkedVoted = true;
        return;
      }
      this.votedThis = await this.$store.dispatch("check_item_voted", {
        list_id: this.list.id,
        item_id: this.item.id
      });
      this.checkedVoted = true;
    },
    setRank() {
      if (this.item.rank !== this.index) {
        this.$store.dispatch("set_item_rank", {
          list_id: this.list.id,
          item_id: this.item.id,
          rank: this.index
        });
      }
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
    },
    votePercentage() {
      return Math.round((this.item.votes / this.list.votes) * 100);
    },
    authenticated() {
      return this.$store.getters.getAuthenticated;
    },
    itemPath() {
      return {
        path: "/items/" + this.item.name,
        query: {
          id: this.info.id
        }
      };
    }
  },

  watch: {
    list_voted() {
      this.checkVoted();
    }
  },

  created: function() {
    this.fetchComments(5);
    this.checkVoted();
    if (this.item.is_link) {
      this.fetchInfo();
    }
    this.setRank();
  }
};
</script>

<style scoped>
@media (min-width: 600px) {
  #comment-border {
    /* border-left: 1px solid lightgray; */
  }
}

.clear-float {
  clear: both;
}
</style>
