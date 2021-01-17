<template>
  <div id="main">
    <v-card tile class="" flat>
      <div style="position:relative">
        <v-divider class="grey lighten-2 mt-4 mb-2"></v-divider>
        <div
          style="position:absolute; right:1.7em;top:-1.1em"
          class="std white subtitle-2 pa-1 font-weight-bold"
          v-if="list.votable"
        >
          vote
        </div>
      </div>
      <v-card-title class="px-2 py-2">
        <v-layout align-start>
          <v-flex shrink mr-2>
            <div
              :class="{
                golden: index === 1,
                silver: index === 2,
                'bronze white--text': index === 3,
                plain: index > 3,
              }"
              class="numeric-box"
              style="font-size:0.5em"
            >
              <span>{{ index }}</span>
            </div>
          </v-flex>
          <v-flex mr-3>
            <router-link
              v-if="item.is_link"
              class="font-weight-medium text-capitalize ptd no-deco"
              style="font-size:1em;line-height:1 !important;"
              :to="itemPath"
              >{{ revisedName }}</router-link
            >
            <span
              v-else
              class="font-weight-medium text-capitalize ptd no-deco"
              style="font-size:1em;line-height:1 !important;"
              >{{ revisedName }}</span
            >
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex v-if="list.votable" shrink class>
            <v-layout>
              <v-layout column align-center :class="'mr-2'">
                <v-icon
                  class="upvote-icon"
                  @click="upvote()"
                  :class="{
                    'green--text': votedThis.type == 'upvote' || isCreator,
                    'grey--text': votedThis.type !== 'upvote' && !isCreator,
                  }"
                  :disabled="
                    !checkedVoted || votedThis.type == 'downvote' || isAdmin
                  "
                  :style="{
                    cursor:
                      votedThis !== false || isCreator ? 'default' : 'pointer',
                    transform: $vuetify.breakpoint.xs
                      ? 'scale(1.4)'
                      : 'scale(1.6)',
                  }"
                  >{{
                    votedThis.type == "upvote" || isCreator
                      ? "$vuetify.icons.arrowUp"
                      : "$vuetify.icons.arrowUpOutline"
                  }}</v-icon
                >
                <span
                  v-if="votedThis || isCreator || isAdmin"
                  class="caption ptd mt-1"
                  >{{ item.upvotes }}</span
                >
              </v-layout>
              <v-layout
                column
                align-center
                :class="$vuetify.breakpoint.xs ? 'ml-1' : 'ml-3'"
              >
                <v-icon
                  class="downvote-icon"
                  @click="downvote()"
                  :disabled="
                    !checkedVoted || votedThis.type == 'upvote' || isAdmin
                  "
                  :style="{
                    cursor:
                      votedThis !== false || isCreator ? 'default' : 'pointer',
                    transform: $vuetify.breakpoint.xs
                      ? 'scale(1.4)'
                      : 'scale(1.6)',
                  }"
                  :class="{
                    'red--text': votedThis.type == 'downvote',
                    'grey--text': votedThis.type !== 'downvote',
                  }"
                  >{{
                    votedThis.type == "downvote"
                      ? "$vuetify.icons.arrowDown"
                      : "$vuetify.icons.arrowDownOutline"
                  }}</v-icon
                >
                <span
                  v-if="votedThis || isCreator || isAdmin"
                  class="caption ptd mt-1"
                  >{{ item.downvotes }}</span
                >
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
                style="margin:0 0.5em 0.5em 0; float:left"
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
              <p v-if="info.about" class="std pa-0" style="pre-wrap;">{{ info.about.slice(0, 500) }}
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
                <div
                  v-if="item.note"
                  class="pre-wrap spacious my-4 ml-2"
                  style="font-family: 'Noticia Text', serif;"
                >{{ item.note }} - <username
                    v-if="creator"
                    :user="creator"
                  ></username>
                </div>
              </v-card>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout class="mt-4">
        <v-flex>
          <div v-if="item.comment_count > 0">
            <div style="display:flex">
              <div
                @click="showComments = !showComments"
                class="grey lighten-4 py-1 pointer my-2 ml-auto br"
              >
                <span
                  class="std grey--text text--darken-1 ml-2 font-weight-medium"
                >
                  <v-icon size="1.5em" color="grey darken-1">mdi-comment</v-icon
                  >&nbsp; {{ item.comment_count }}
                  {{ item.comment_count == 1 ? "comment" : "comments" }}
                </span>
                <span>
                  <v-icon size="2em" color="grey darken-1" class="">{{
                    showComments ? "mdi-chevron-up" : "mdi-chevron-down"
                  }}</v-icon></span
                >
              </div>
            </div>
            <div
              v-if="showComments"
              class="comments mt-4 px-3 py-4"
              style="background-color:rgba(0,0,0,0.02);"
            >
              <display-comments
                :class="{ 'mt-8': info.about }"
                :comments="comments"
                :list="list"
                :item="item"
                @deleted="item.comment_count--"
              ></display-comments>
              <v-layout justify-center v-if="loadingComments" class="my-4">
                <m-progress></m-progress>
              </v-layout>
              <v-layout
                class="my-3"
                justify-center
                v-if="
                  comments.length < item.comment_count &&
                    comments.length > 0 &&
                    !loadingComments
                "
              >
                <v-icon
                  @click="fetchMoreComments(10)"
                  size="1.8em"
                  color="grey darken-1"
                  style="transform: scale(1.5)"
                  class="ptd"
                  >$vuetify.icons.plus-circle</v-icon
                >
              </v-layout>
            </div>
          </div>
        </v-flex>
      </v-layout>
      <v-card-actions v-if="showComments">
        <v-layout column reverse>
          <v-flex>
            <div style="position:relative">
              <comment-box
                v-model="comment"
                class="comment-box"
                rows="3"
                :placeholder="
                  commentable
                    ? item.comment_count == 0
                      ? 'Start the conversation...'
                      : 'Join the conversation...'
                    : 'Cast your vote to add a comment'
                "
                :disabled="!commentable"
                :max-height="126"
                @focused="setFocused"
                :id="'comment-box' + index"
              />
              <div style="position:absolute; bottom:1em; right:1em">
                <v-icon
                  v-show="!addingComment"
                  size="1.5em"
                  @click="uploadComment()"
                  :class="
                    focused && comment.trim() != ''
                      ? 'accent--text'
                      : 'grey--text'
                  "
                  :disabled="comment.trim() == ''"
                  >fa-paper-plane</v-icon
                >
                <m-progress
                  v-show="addingComment" :size="16"></m-progress>
              </div>
            </div>
          </v-flex>
          <v-flex class="mr-2">
            <v-layout class justify-end>
              <span v-if="item.comment_count > 0" class="std"
                >{{ item.comment_count }}
                {{ item.comment_count > 1 ? "comments" : "comment" }}</span
              >
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import commentBox from "./CommentBox";
import DisplayComments from "./DisplayComments";

export default {
  components: {
    commentBox,
    "display-comments": DisplayComments,
  },
  props: {
    rItem: Object,
    list: Object,
    index: Number,
    list_voted: Boolean,
  },
  data() {
    return {
      comment: "",
      comments: [],
      showComments: true,
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
      creator: null,
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
          comment: this.comment,
        })
        .then((comment) => {
          this.addingComment = false;
          this.comments.push(comment);
          this.comment = "";
          this.item.comment_count++;
        })
        .catch((_) => {
          this.$store.dispatch("setSnackbar", {
            show: true,
            message: "sorry. An error occured",
            type: "error",
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
      // else if (!this.verified) {
      //   this.$store.dispatch("set_snackbar", {
      //     show: true,
      //     message: "Sorry. Your email has not been verified.",
      //     type: "error",
      //   });
      //   return;
      // }
      this.$emit("voted");
      this.votedThis = { type: "upvote" };
      this.item.upvotes++;
      this.$store
        .dispatch("upvote", {
          item: this.item,
          list: this.list,
          list_voted: this.list_voted,
        })
        .then(() => {
          // document.querySelector("#comment-box" + this.index).focus();
        });
    },
    downvote() {
      if (this.votedThis !== false || this.isCreator) {
        return;
      }
      // else if (!this.verified) {
      //   this.$store.dispatch("set_snackbar", {
      //     show: true,
      //     message: "Sorry. Your email has not been verified.",
      //     type: "error",
      //   });
      //   return;
      // }
      this.$emit("voted");
      this.votedThis = { type: "downvote" };
      this.item.downvotes++;
      this.$store
        .dispatch("downvote", {
          item: this.item,
          list: this.list,
          list_voted: this.list_voted,
        })
        .then(() => {
          // document.querySelector("#comment-box" + this.index).focus();
        });
    },

    async fetchComments(limit) {
      this.loadingComments = true;
      this.$store
        .dispatch("fetch_comments", {
          item_id: this.item.id,
          list_id: this.list.id,
          limit: limit,
        })
        .then((comments) => {
          this.comments = comments;
          this.loadingComments = false;
        })
        .catch((error) => {
          this.loadingComments = false;
          this.$store.dispatch("set_snackbar", {
            show: true,
            message: "Sorry. An error occured while fetching comments",
            type: "error",
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
          lastDoc: this.comments[this.comments.length - 1],
        })
        .then((comments) => {
          this.comments = this.comments.concat(comments);
          this.loadingComments = false;
        })
        .catch((error) => {
          this.loadingComments = false;
          this.$store.dispatch("set_snackbar", {
            show: true,
            message: "Sorry. An error occured while fetching comments",
            type: "error",
          });
        });
    },

    async fetchInfo() {
      this.$store
        .dispatch("fetch_item", this.item.info)
        .then((info) => {
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
      this.$store
        .dispatch("check_item_voted", {
          list_id: this.list.id,
          item_id: this.item.id,
        })
        .then((voted) => {
          this.votedThis = voted;
          this.checkedVoted = true;
        });
    },
    setRank() {
      if (this.item.rank !== this.index) {
        this.$store.dispatch("set_item_rank", {
          list_id: this.list.id,
          item_id: this.item.id,
          rank: this.index,
        });
      }
    },
    fetchCreator() {
      this.$store.dispatch("fetch_user", this.item.user).then((user) => {
        this.creator = user;
      });
    },
  },

  computed: {
    windowSmall() {
      return screen.width < 600;
    },
    commentable() {
      return (
        this.votedThis.type == "upvote" ||
        this.votedThis.type == "downvote" ||
        this.isCreator ||
        this.list.type == "factual"
      );
    },
    authenticated() {
      return this.$store.getters.authenticated;
    },
    itemPath() {
      return {
        path: "/items/" + this.info.id,
      };
    },
    isCreator() {
      if (!this.authenticated) {
        return false;
      }
      return this.$store.getters.getUser.id == this.item.user;
    },
    upvoted() {
      if (!this.votedThis) {
        return;
      }
      return this.votedThis.type === "upvote";
    },
    downvoted() {
      if (!this.votedThis) {
        return;
      }
      return this.votedThis.type === "downvote";
    },
    verified() {
      return this.$store.getters.emailVerified;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
    revisedName() {
      let lastIndex = this.item.name.lastIndexOf("(");
      let type = this.item.name.slice(lastIndex + 1, this.item.name.length - 1);
      if (this.list.category.toLowerCase().includes(type.toLowerCase()))
        return this.item.name.slice(0, lastIndex).trim();
      return this.item.name;
    },
  },

  watch: {
    list_voted() {
      this.checkVoted();
    },
  },

  created: function() {
    this.item = this.rItem;
    this.fetchComments(10);
    this.checkVoted();
    if (this.item.is_link) {
      this.fetchInfo();
    } else if (this.item.image) {
      this.$emit("hasImage", this.item.image);
    }
    if (this.item.note) {
      this.fetchCreator();
    }
    this.setRank();
  },
};
</script>
<style scoped>
.upvote-icon:hover {
  color: #4caf50 !important;
  transition: transform 0.2s ease-in;
}
.downvote-icon:hover {
  color: #f44336 !important;
  transition: transform 0.2s ease-in;
}
.comments {
  max-height: 50vh;
  overflow-y: auto;
}
</style>
