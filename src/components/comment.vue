<template>
  <div id="main">
    <v-card tile class flat style="overflow:hidden">
      <v-divider class="grey lighten-4 my-1"></v-divider>
      <v-layout style="position:relative">
        <v-flex class="px-2">
          <div id="comment" style="display:flex">
            <div class style="position:relative">
              <div class>
                <div style="white-space:pre-wrap;" class="ptd">{{ !more ? comment.content.slice(0, 600) : comment.content
                  }}{{ comment.content.length > 600 ? "..." : " "
                  }}<span
                    @click="more = !more"
                    v-if="comment.content.length > 600"
                    class="link--text"
                    style="cursor:pointer"
                    >{{ !more ? "more" : "less" }}</span
                  ><span
                    class="brand--text text--lighten-1 brighten pointer"
                    v-if="comment.content.length < 600 || more"
                    @click="
                      comment.user.username.includes('visitor')
                        ? null
                        : (showUser = true)
                    "
                    >-&nbsp;{{
                      comment.user.username.includes("visitor")
                        ? ""
                        : comment.user.username
                    }}</span
                  >
                </div>
              </div>
              <v-layout class="mt-2 mb-1" align-center>
                <div class="std" style="display:flex; min-width:4.5em;">
                  {{ created }}
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
                <v-icon class="std" @click="fetchMoreReplies(5)"
                  >mdi-plus-circle-outline</v-icon
                >
              </v-layout>

              <div v-if="loading" style="display:flex; justify-content:center">
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
              <div
                v-if="addingReply"
                style="display:flex; justify-content:center"
              >
                <m-progress></m-progress>
              </div>
            </div>
            <div class="" style="position:relative">
              <v-layout>
                <v-spacer></v-spacer>
                <a class="std underline"
                  >{{ comment.replies_count ? comment.replies_count : "0" }}
                  {{ comment.replies_count == 1 ? "reply" : "replies" }}</a
                >
              </v-layout>
              <comment-box
                v-model="reply"
                :id="'reply-box' + index"
                class="mr-2"
                rows="1"
                placeholder="Reply..."
                :max-height="120"
                @focused="setFocused"
              />
              <v-icon
                @click="replyComment()"
                size="1.2em"
                :class="
                  focused && comment != '' ? 'accent--text' : 'grey--text'
                "
                style="position:absolute; bottom:1em; right:0.8em"
                :disabled="comment == '' ? true : false"
                >fa-paper-plane</v-icon
              >
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-card>

    <v-dialog v-model="showUser" max-width="400px">
      <PreviewUser
        :id="comment.user.id"
        @close="showUser = false"
      ></PreviewUser>
    </v-dialog>
    <v-dialog persistent v-model="showEdit" max-width="500px">
      <v-card flat class="grey lighten-3">
        <v-card-title
          class="brand lighten-2 white--text"
          style="position:sticky;top:0;z-index:2;border-bottom:1px solid black"
        >
          Edit Comment
          <v-spacer></v-spacer>
          <v-icon color="white" @click="showEdit = false">mdi-close</v-icon>
        </v-card-title>
        <v-card-text class="pb-0 pt-4">
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
            :disabled="newComment == '' || newComment == comment.content"
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
        comment: { id: comment.id }
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
import PreviewUser from "./PreviewUser";
import PreviewComment from "./PreviewComment";
import CommentBox from "./CommentBox";
import { setTimeout } from "timers";
import convertMoment from "../../public/my-modules/convertMoment";
import FlagComment from "./FlagComment";
let moment = require("moment");

export default {
  components: {
    Reply,
    PreviewUser,
    PreviewComment,
    CommentBox,
    FlagComment
  },
  props: {
    comment: Object,
    list: Object,
    item: Object,
    index: Number
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
      successMessage: ""
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
        comment_id: this.comment.id
      });
    },

    toggleMore() {
      this.showMore = !this.showMore;
      document.querySelector(".menu").classList.toggle("rotate");
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
          comment_id: this.comment.id
        })
        .then(() => {
          this.deleting = false;
          this.$emit("delete", this.index);
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
            username: this.comment.user.username
          }
        })
        .then(reply => {
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
              username: this.comment.user.username
            },
            item: this.item,
            list: this.list,
            comment: this.comment
          });
        })
        .catch(error => {
          console.log(error);
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
          limit: limit
        })
        .then(replies => {
          this.replies = replies;
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
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
          lastDoc: this.replies[this.replies.length - 1]
        })
        .then(replies => {
          this.replies = this.replies.concat(replies);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },

    showReplies(num) {
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
          comment_id: this.comment.id
        })
        .then(result => {
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
          newContent: this.newComment
        })
        .then(() => {
          this.comment.content = this.newComment;
          this.editing = false;
          this.showEdit = false;
        });
    }
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
    }
  },

  created() {
    // this.setLiked();
  }
};
</script>

<style scoped>
#comment:hover {
  /* background-color: hsl(207, 90%, 95%); */
  /* background-color: #f5f5f5; */
}
.replies-display {
  border-left: 2px solid var(--accent);
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
.content-container {
  overflow-wrap: break-word;
  margin-left: 1.5em;
  padding: 0.5em;
  white-space: pre-wrap;
}

#reply-container {
  background-color: #f4f4f4;
  width: 100%;
}

#reply-box {
  position: relative;
}

#action-buttons {
  padding: 0.5em;
  position: absolute;
  right: 0;
  bottom: 0;
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
  }
}
</style>
