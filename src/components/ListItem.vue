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
                  :size="downvoted ? '1.4em' : '1.8em'"
                  @click="upvote()"
                  :class="{
                    'green--text': votedThis.type == 'upvote' || isCreator,
                    'grey--text': votedThis.type !== 'upvote' && !isCreator
                  }"
                  :disabled="!checkedVoted"
                  :style="{
                    cursor:
                      votedThis !== false || isCreator ? 'default' : 'pointer'
                  }"
                  >{{
                    votedThis.type == "upvote" || isCreator
                      ? "mdi-arrow-up-bold-box"
                      : "mdi-arrow-up-bold-box-outline"
                  }}</v-icon
                >
                <span class="caption std mt-n1">{{ item.upvotes }}</span>
              </v-layout>
              <v-layout column align-center>
                <v-icon
                  :size="upvoted || isCreator ? '1.4em' : '1.8em'"
                  @click="downvote()"
                  :disabled="!checkedVoted"
                  :style="{
                    cursor:
                      votedThis !== false || isCreator ? 'default' : 'pointer'
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
      <v-layout
        :column="info.about || $vuetify.breakpoint.smAndDown ? true : false"
        class="mt-2"
      >
        <v-flex shrink v-if="info.image || info.about || item.image">
          <v-layout column style="height:100%">
            <v-card-text class="py-0">
              <div
                style="margin:0 0.5em 0.1em 0; float:left"
                v-if="info.image || item.image"
              >
                <img-prev
                  class="mr-2"
                  v-if="info.image"
                  :image="info.image"
                  :high="true"
                  :width="$vuetify.breakpoint.xs ? 150 : 200"
                  :aspect-ratio="1"
                  :path="{ item: info.id }"
                  :radius="'5px'"
                  :name="item.name.replace(/ /g, '')"
                ></img-prev>
                <img-prev
                  class="mr-2"
                  v-else-if="item.image"
                  :image="item.image"
                  :width="$vuetify.breakpoint.xs ? 150 : 200"
                  :radius="'5px'"
                  :high="true"
                ></img-prev>
              </div>
              <p v-if="info.about" class="std pa-0" style="pre-wrap;">
                {{ info.about.slice(0, 500) }}
                <router-link
                  v-if="info.about.length > 500"
                  class="link--text underline no-deco"
                  :to="'/items/' + item.id"
                  >...read more</router-link
                >
              </p>
            </v-card-text>
          </v-layout>
        </v-flex>
        <v-flex id="comment-border">
          <v-card flat height="100%" class="pa-0">
            <v-layout style="height:100%" class column justify-space-between>
              <v-card flat tile>
                <div v-if="item.note" class="pre-wrap spacious mb-4 ml-2" style="font-style:italic">{{item.note}}-&nbsp;<username v-if="creator" :user="creator"></username></div>
                <v-layout
                  justify-center
                  v-if="loadingComments || addingComment"
                  class="my-4"
                >
                  <m-progress></m-progress>
                </v-layout>
                <v-card
                  class="subtitle-1 px-4 py-1 htd"
                  flat
                  v-else-if="item.comment_count == 0 && (votedThis.type=='upvote' || votedThis.type=='downvote')"
                  >Be the first to comment...</v-card
                >
                <v-card flat v-else>
                  <display-comments
                    :class="{'mt-4': info.about}"
                    :comments="comments"
                    :list="list"
                    :item="item"
                  ></display-comments>
                  <v-layout
                    class="my-3"
                    justify-center
                    v-if="
                      comments.length < item.comment_count &&
                        comments.length > 0
                    "
                  >
                    <v-icon
                      @click="fetchMoreComments(10)"
                      size="1.8em"
                      color="grey darken-1"
                      class="ptd"
                      >mdi-plus-circle-outline</v-icon
                    >
                  </v-layout>
                </v-card>
              </v-card>
              <v-card-actions v-if="votedThis.type=='upvote' || votedThis.type=='downvote' || isCreator">
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
                      <span v-if="item.comment_count > 0" class="std"
                        >{{ item.comment_count }}
                        {{
                          item.comment_count > 1 ? "comments" : "comment"
                        }}</span
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
    rItem: Object,
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
      checkedVoted: false,
      item: {},
      creator: null
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
        .catch(_ => {
          this.$store.dispatch("setSnackbar", {
            show: true,
            message: "sorry. An error occured",
            type: "error"
          });
          this.addingComment = false;
        });
    },

    setFocused(bool) {
      this.focused = bool;
    },

    upvote() {
      if (this.votedThis !== false || this.isCreator) {
        return;
      }
      this.$emit("voted");
      this.votedThis = { type: "upvote" };
      this.item.upvotes++;
      this.$store.dispatch("upvote", {
        item: this.item,
        list: this.list,
        list_voted: this.list_voted
      });
    },
    downvote() {
      if (this.votedThis !== false || this.isCreator) {
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
          this.loadingComments = false;
          this.$store.dispatch("set_snackbar", {
            show: true,
            message: "Sorry. An error occured while fetching comments",
            type: "error"
          });
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
          this.loadingComments = false;
          this.$store.dispatch("set_snackbar", {
            show: true,
            message: "Sorry. An error occured while fetching comments",
            type: "error"
          });
        });
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
    },
    fetchCreator(){
      this.$store.dispatch("fetch_user", this.item.user).then(user => {
        this.creator = user;
      })
    }
  },

  computed: {
    windowSmall() {
      return screen.width < 600;
    },
    authenticated() {
      return this.$store.getters.authenticated;
    },
    itemPath() {
      return {
        path: "/items/" + this.info.id
      };
    },
    isCreator() {
      if (!this.authenticated) {
        return false;
      }
      return this.$store.getters.getUser.id == this.item.user;
    },
    upvoted(){
      if(!this.votedThis){
        return;
      }
      return this.votedThis.type === "upvote";
    },
    downvoted(){
      if(!this.votedThis){
        return;
      }
      return this.votedThis.type === "downvote";
    }
  },

  watch: {
    list_voted() {
      this.checkVoted();
    }
  },

  created: function() {
    this.item = this.rItem;
    this.fetchComments(5);
    this.checkVoted();
    if (this.item.is_link) {
      this.fetchInfo();
    } else if (this.item.image) {
      this.$emit("hasImage", this.item.image);
    }
    if(this.item.note){
      this.fetchCreator();
    }
    this.setRank();
  }
};
</script>
