<template>
  <div id="main">
    <div style="overflow:hidden">
      <v-divider class="grey lighten-2 my-2" v-if="index != 0"></v-divider>
      <v-layout style="position:relative">
        <v-flex class="px-2" style="border-left: 2px solid rgba(0,0,0,.2)">
          <div id="comment" style="display:flex">
            <div class style="position:relative">
              <div @click="showReplies(3)" class="default-cursor pb-5">
                <div
                  style="font-size:0.9em"
                  class="ptd roboto spacious pre-wrap"
                >{{ !more ? comment.content.slice(0, 600) : comment.content
                  }}{{ comment.content.length > 600 ? "..." : " "
                  }}<span
                    @click="more = !more"
                    v-if="comment.content.length > 600"
                    class="link--text"
                    style="cursor:pointer"
                    >{{ !more ? "more" : "less" }}</span
                  ><span v-if="!comment.user.username.includes('visitor')"
                    >-&nbsp;</span
                  ><username :user="comment.user"></username>
                </div>
              </div>
              <v-layout class="" align-center>
                <div class="std" style="display:flex; min-width:3em;">
                  {{ created }}
                </div>
                <div
                  v-if="comment.likes"
                  style="display:flex; min-width:4.5em;"
                  class="std"
                >
                  {{ comment.likes }} {{ comment.likes > 1 ? "likes" : "like" }}
                </div>

                <div style="display:flex; min-width:4.5em;">
                  <v-icon
                    class="action-icon grey--text"
                    size="1.2em"
                    @click="showReplies(3)"
                    >mdi-message-reply-text</v-icon
                  >
                  <span
                    class="grey--text text--darken-2"
                    style="margin:0em 0 0 0.3em; font-size:0.9em"
                    >{{ comment.replies_count }}</span
                  >
                </div>
                <div>
                  <v-menu right>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        v-on="on"
                        size="1.2em"
                        @click="setLiked()"
                        style="margin-top:-0.25em"
                        >mdi-dots-horizontal</v-icon
                      >
                    </template>
                    <v-list class="pa-0">
                      <v-list-item class="" @click="toggleLike()">
                        <v-layout class="py-2" justify-center>
                          <v-icon
                            v-if="liked !== undefined"
                            :color="liked ? 'brand' : null"
                            >fa-thumbs-up</v-icon
                          >
                          <m-progress v-else></m-progress>
                        </v-layout>
                      </v-list-item>
                      <v-list-item
                        @click="
                          (showEdit = true), (newComment = comment.content)
                        "
                        v-if="isCommenter"
                        class="tile"
                      >
                        <v-layout class="py-2" justify-center>
                          <v-icon>fa-pencil-alt</v-icon>
                        </v-layout>
                      </v-list-item>
                      <v-list-item @click="showFlag = true" class="tile">
                        <v-layout class="py-2" justify-center>
                          <v-icon>fa-flag</v-icon>
                        </v-layout>
                      </v-list-item>
                      <v-list-item
                        @click="showDelete = true"
                        v-if="isCommenter"
                        class="tile"
                      >
                        <v-layout class="py-2" justify-center>
                          <v-icon>fa-times</v-icon>
                        </v-layout>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </v-layout>
            </div>
          </div>
          <div class="my-2 pl-2 shift" v-if="repliesVisible">
            <div class="mb-4 replies-display">
              <v-layout
                class="my-4"
                v-if="(comment.replies_count > replies.length) & !loading"
                justify-center
              >
                <v-icon
                  class="std"
                  @click="fetchMoreReplies(5)"
                  style="transform: scale(1.2)"
                  >$vuetify.icons.plus-circle</v-icon
                >
              </v-layout>

              <div
                v-if="loading"
                class="my-4"
                style="display:flex; justify-content:center"
              >
                <m-progress></m-progress>
              </div>
              <v-layout column reverse>
                <div v-for="(reply, index) in replies" :key="reply.id">
                  <Reply
                    :list="list"
                    :item="item"
                    :comment="comment"
                    :reply="{ id: reply.id, ...reply.data() }"
                    @reply="setReply"
                    :index="index"
                    @delete="deleteReply"
                  ></Reply>
                </div>
              </v-layout>
            </div>
            <div class="" style="position:relative">
              <v-layout>
                <v-spacer></v-spacer>
                <span class="std mr-2"
                  >{{ comment.replies_count ? comment.replies_count : "0" }}
                  {{ comment.replies_count == 1 ? "reply" : "replies" }}</span
                >
              </v-layout>
              <comment-box
                v-model="reply"
                :id="`reply-box-${comment.id}-${index}`"
                class="mr-2"
                rows="1"
                placeholder="Reply..."
                :max-height="120"
                @focused="setFocused"
              />
              <div style="position:absolute; bottom:1em; right:1em">
                <v-icon
                  v-show="!addingReply"
                  @click="replyComment()"
                  size="1.5em"
                  :class="
                    focused && reply.trim() != ''
                      ? 'accent--text'
                      : 'grey--text'
                  "
                  :disabled="reply.trim() == '' ? true : false"
                  >fa-paper-plane</v-icon
                >
                <m-progress
                  v-show="addingReply" :size="16"></m-progress>
              </div>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </div>
    <v-dialog persistent v-model="showEdit" max-width="500px">
      <v-card flat class="grey lighten-3">
        <v-card-title
          class="brand lighten-2 white--text"
          style="position:sticky;top:0;z-index:2;border-bottom:1px solid black"
        >
          Edit Comment
          <v-spacer></v-spacer>
          <v-icon class="close" @click="showEdit = false">mdi-close</v-icon>
        </v-card-title>
        <v-card-text
          class="pb-0 pt-4"
          :class="{ 'px-2': $vuetify.breakpoint.xs }"
        >
          <v-textarea
            auto-grow
            no-resize
            flat
            v-model="newComment"
            solo
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <m-btn
            :loading="editing"
            @click="editComment()"
            :disabled="newComment.trim() == '' || newComment == comment.content"
            >Edit</m-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <flag-comment
      v-if="showFlag"
      :type="'comment'"
      :path="{
        list: { id: list.id, title: list.title },
        item: { id: item.id, name: item.name },
        comment: { id: comment.id },
      }"
      :flaggedItem="comment"
      @close="showFlag = false"
      @success="flagSuccess()"
    ></flag-comment>
    <v-dialog v-model="showDelete" max-width="500px">
      <v-card>
        <v-card-title class="brand--text">Delete Comment</v-card-title>
        <v-card-text class="ptd"
          >Are you sure you want to delete this comment?</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <m-btn text @click="showDelete = false">Cancel</m-btn>
          <m-btn text :loading="deleting" @click="deleteComment()"
            >Delete</m-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="successful">
      {{ successMessage }}
      <v-spacer></v-spacer>
      <m-btn text @click="successful = false">OK</m-btn>
    </v-snackbar>
  </div>
</template>

<script>
import Reply from "./Reply";
// import PreviewComment from "./PreviewComment";
import CommentBox from "./CommentBox";
import { setTimeout } from "timers";
import convertMoment from "../my-modules/js/convertMoment";
import FlagComment from "./FlagComment";

export default {
  components: {
    Reply,
    CommentBox,
    FlagComment,
  },
  props: {
    comment: Object,
    list: Object,
    item: Object,
    index: Number,
  },

  data() {
    return {
      liked: undefined,
      reply: "",
      replyInput: false,
      replies: [],
      repliesVisible: false,
      loading: false,
      repliesShown: false,
      showUser: false,
      showComment: false,
      focused: false,
      addingReply: false,
      showMore: false,
      more: false,
      showEdit: false,
      newComment: "",
      editing: false,
      flagReason: "",
      showFlag: false,
      showDelete: false,
      otherReason: "",
      deleting: false,
      flagging: false,
      successful: false,
      successMessage: "",
    };
  },

  methods: {
    async toggleLike() {
      if (this.liked == undefined) {
        return;
      }
      let action;
      if (this.liked) {
        this.comment.likes--;
        action = "unlikeComment";
      } else {
        this.comment.likes == null
          ? (this.comment.likes = 1)
          : this.comment.likes++;
        action = "likeComment";
      }
      this.liked = !this.liked;

      this.$store.dispatch(action, {
        list_id: this.list.id,
        item_id: this.item.id,
        comment_id: this.comment.id,
      });
    },

    setReply(user) {
      this.showReplyBox = true;
      this.reply = "@" + user + " ";
      setTimeout(() => {
        document.querySelector("#reply-box" + this.index).focus();
      }, 50);
    },

    deleteReply(index) {
      this.replies.splice(index, 1);
      this.comment.replies_count--;
    },

    flagSuccess() {
      this.successMessage = "Comment Flagged Successfully";
      this.successful = true;
      this.showFlag = false;
    },

    deleteComment() {
      this.deleting = true;
      this.$store
        .dispatch("delete_comment", {
          list_id: this.list.id,
          item_id: this.item.id,
          comment_id: this.comment.id,
        })
        .then(() => {
          this.deleting = false;
          this.$emit("delete", this.index);
        })
        .catch((_) => {
          this.deleting = false;
          console.log(_);
        });
    },

    showBox() {
      this.showReplyBox = !this.showReplyBox;
      if (this.showReplyBox) {
        setTimeout(() => {
          document.querySelector(".reply-box").focus();
        }, 50);
      }
    },

    setFocused(bool) {
      this.focused = bool;
    },

    replyComment() {
      this.addingReply = true;
      this.$store
        .dispatch("upload_reply", {
          list_id: this.list.id,
          list_title: this.list.title,
          item_id: this.item.id,
          item_name: this.item.name,
          comment_id: this.comment.id,
          comment_content: this.comment.content,
          reply: this.reply,
          commenter: {
            id: this.comment.user.id,
            username: this.comment.user.username,
          },
        })
        .then((reply) => {
          this.addingReply = false;
          this.replies.push(reply);
          this.reply = "";
          this.comment.replies_count
            ? this.comment.replies_count++
            : (this.comment.replies_count = 1);
        })
        .then(() => {
          this.$store.dispatch("send_notification", {
            type: "reply",
            commenter: {
              id: this.comment.user.id,
              username: this.comment.user.username,
            },
            item: this.item,
            list: this.list,
            comment: this.comment,
          });
        })
        .catch((error) => {
          this.dispatch("setSnackbar", {
            show: true,
            message: "sorry. An error occured",
            type: "error",
          });
          this.addingReply = false;
        });
    },

    fetchReplies(limit) {
      this.loading = true;
      this.$store
        .dispatch("fetch_replies", {
          list_id: this.list.id,
          item_id: this.item.id,
          comment_id: this.comment.id,
          limit: limit,
        })
        .then((replies) => {
          this.replies = replies;
          this.loading = false;
        })
        .catch((_) => {
          this.loading = false;
          this.dispatch("setSnackbar", {
            show: true,
            message: "sorry. An error occured",
            type: "error",
          });
        });
    },

    fetchMoreReplies(limit) {
      this.loading = true;
      this.$store
        .dispatch("fetch_replies", {
          list_id: this.list.id,
          item_id: this.item.id,
          comment_id: this.comment.id,
          limit: limit,
          lastDoc: this.replies[this.replies.length - 1],
        })
        .then((replies) => {
          this.replies = this.replies.concat(replies);
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.dispatch("setSnackbar", {
            show: true,
            message: "sorry. An error occured",
            type: "error",
          });
        });
    },

    showReplies() {
      if (!this.repliesShown) {
        if (this.replies.length === this.comment.replies_count) {
          return;
        } else if (this.replies.length === 0) {
          this.fetchReplies(3);
        } else {
          this.fetchMoreReplies(5);
        }
        this.repliesShown = true;
      }
      this.repliesVisible = !this.repliesVisible;
    },
    async setLiked() {
      if (!this.$store.getters.semiAuthenticated) {
        this.liked = false;
      } else if (this.liked !== undefined) {
        return;
      }
      await this.$store
        .dispatch("comment_liked", {
          list_id: this.list.id,
          item_id: this.item.id,
          comment_id: this.comment.id,
        })
        .then((result) => {
          this.liked = result;
        });
    },
    editComment() {
      this.editing = true;
      this.$store
        .dispatch("edit_comment", {
          comment_id: this.comment.id,
          list_id: this.list.id,
          item_id: this.item.id,
          newContent: this.newComment,
        })
        .then(() => {
          this.comment.content = this.newComment;
          this.editing = false;
          this.showEdit = false;
        })
        .catch((_) => {
          this.editing = false;
        });
    },
  },

  computed: {
    created() {
      return convertMoment.getShortTime(this.comment.created);
    },
    isCommenter() {
      if (!this.$store.getters.authenticated) {
        return false;
      }
      return this.comment.user.id == this.$store.getters.getUser.id;
    },
  },

  created() {
    // this.setLiked();
  },
};
</script>

<style scoped>
.replies-display {
  /* box-shadow: -2px 0px 0px rgba(0, 0, 0, 0.2); */
  padding-left: 8px;
}
.shift {
  margin-left: 1em;
}
@media (min-width: 900px) {
  .shift {
    margin-left: 2em;
  }
}
#reply-box {
  position: relative;
}
</style>
