<template>
  <div id="main">
    <v-card v-if="fetched" tile class flat>
      <div>
        <div id="comment" style="display:flex">
          <div>
            <v-avatar size="2em" class style="margin:0.5em 1em">
              <img :src="commenter.profile_pic" />
            </v-avatar>
          </div>
          <div class="mt-1" style="position:relative">
            <div class="primary py-1 px-2 br mr-1">
              <v-icon color="primary" size="1em" style="transform:rotate(270deg);position:absolute;left:-0.8em;top:0.7em">mdi-triangle</v-icon>
            <p
              @click="showUser=true"
              class="primary-text-dark subtitle-2 font-weight-black text-capitalize"
              v-if="commenter.username"
            >
              {{commenter.username}}&nbsp;
              <span
                class="secondary-text-dark"
              >{{created}}</span>
            </p>

            <p style="white-space:pre-wrap; font-size:16px;" class="mt-n4">{{comment.content.slice(0,300)}}<span
                @click="showComment=true"
                v-if="comment.content.length>300"
                class="brand--text"
                style="cursor:pointer"
              >...read more</span></p>
            </div>  
            <v-layout>
              <div style="display:flex; min-width:3.3em;">
                <v-icon
                  class="like-button"
                  @click="toggleLike()"
                  :color="liked ? 'blue' : null"
                  size="1.125em"
                >mdi-thumb-up</v-icon>
                <span
                  v-if="comment.likes>0"
                  class="grey--text text--darken-2"
                  style="margin:0 0.3em; font-size:0.9em"
                >{{comment.likes}}</span>
              </div>
              <div @click="replyInput=!replyInput" style="min-width:3.3em">
                <v-icon @click="showBox()" size="1.125em" class="action-icon">mdi-reply</v-icon>
              </div>

              <div style="cursor:pointer" @click="showReplies(5)">
                <v-icon style="cursor:pointer" size="1.125em">mdi-message-reply-text</v-icon>
                <a
                  class="grey--text text--darken-2"
                  style="margin:0 0.3em; font-size:0.9em"
                >{{comment.replies_count}}</a>
              </div>
            </v-layout>
          </div>
        </div>
        <div
          id="replies-display"
          class="my-2 pl-2"
          style="margin-left:2.7em"
          v-if="repliesVisible || showReplyBox"
        >
          <div v-if="repliesVisible" class="mb-4">
            <v-layout v-if="comment.replies_count > replies.length & !loading" justify-center>
              <v-icon
                class="primary-text-dark"
                @click="fetchReplies(5,replies[0].created)"
              >mdi-plus-circle-outline</v-icon>
            </v-layout>

            <div v-if="loading" style="display:flex; justify-content:center">
              <v-btn text>
                <v-progress-circular indeterminate :value="80" :size="20" :width="3"></v-progress-circular>
              </v-btn>
            </div>

            <div v-for="(reply, index) in replies" :key="index">
              <Reply
                :path="{list_id: list.id, item_id: item.id, comment_id: comment.id}"
                :reply="reply"
                @reply="setReply"
              ></Reply>
            </div>
          </div>
          <div v-if="showReplyBox" class="mr-4" style="position:relative">
            <comment-box
              v-model="reply"
              class="reply-box mr-2"
              rows="1"
              placeholder="Reply..."
              :max-height="120"
              @focused="setFocused"
            />
            <v-icon
              @click="replyComment()"
              size="1.5em"
              style="position:absolute; right:0.5em; bottom:0.5em"
              :class="focused? 'brand--text' : null"
            >mdi-send</v-icon>
          </div>
        </div>
      </div>
    </v-card>

    <v-dialog v-model="showUser" max-width="300px">
      <PreviewUser :user="commenter" @closeDialog="showUser=false"></PreviewUser>
    </v-dialog>

    <v-dialog v-model="showComment" max-width="500px">
      <PreviewComment :comment="comment"></PreviewComment>
    </v-dialog>
  </div>
</template>

<script>
import swalErrors from "../../public/my-modules/swalErrors";
import autosize from "autosize";
import Reply from "./Reply";
import PreviewUser from "./PreviewUser";
import PreviewComment from "./PreviewComment";
import CommentBox from "./CommentBox";
import { setTimeout } from "timers";
import convertMoment from "../../public/my-modules/convertMoment";
let moment = require("moment");

export default {
  components: {
    Reply,
    PreviewUser,
    PreviewComment,
    CommentBox
  },
  props: {
    comment: Object,
    list: Object,
    item: Object
  },

  data() {
    return {
      liked: false,
      reply: "",
      replyInput: false,
      replies: [],
      repliesVisible: false,
      loading: false,
      repliesShown: false,
      commenter: {},
      showUser: false,
      showComment: false,
      showReplyBox: false,
      fetched: false,
      focused: false
    };
  },

  methods: {
    async toggleLike() {
      if (this.$store.getters.getAuthenticated) {
        let action;
        if (this.liked) {
          this.comment.likes--;
          action = "unlikeComment";
        } else {
          this.comment.likes++;
          action = "likeComment";
        }
        this.liked = !this.liked;

        this.$store.dispatch(action, {
          list_id: this.list.id,
          item_id: this.item.id,
          comment_id: this.comment.id
        });
      } else {
        swalErrors.showAuthenticationError();
      }
    },

    setReply(user) {
        this.showReplyBox = true;
        this.reply = "@" + user + " ";
        setTimeout(() => {
          document.querySelector(".reply-box").focus();
        }, 50);
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
      if (this.$store.getters.getAuthenticated) {
        this.$store
          .dispatch("upload_reply", {
            list_id: this.list.id,
            item_id: this.item.id,
            comment_id: this.comment.id,
            reply: this.reply
          })
          .then(reply => {
            this.replies.push(reply);
            this.comment.replies_count++;
          })
          .then(() => {
            this.$store.dispatch("send_notification", {
              type: "reply",
              user: this.commenter,
              item: this.item,
              list: this.list,
              comment: this.comment
            });
          });
      } else {
        swalErrors.showAuthenticationError();
      }
    },

    async fetchCommenter() {
      await this.$store.dispatch("fetch_user", this.comment.user).then(user => {
        this.commenter = user;
      });
    },

    fetchReplies(num, timestamp) {
      this.loading = true;
      this.$store
        .dispatch("fetchReplies", {
          list_id: this.list.id,
          item_id: this.item.id,
          comment_id: this.comment.id,
          num: num,
          timestamp: timestamp
        })
        .then(replies => {
          for (let i = 0; i < replies.length; i++) {
            //make first created comment appear first
            this.replies.unshift(replies[i]);
          }
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },

    showReplies(num) {
      if (!this.repliesShown) {
        if (this.replies.length === this.comment.replies_count) {
          null;
        } else if (this.replies.length === 0) {
          this.fetchReplies(num, "now");
        } else {
          this.fetchReplies(num, this.replies[0].created);
        }
        this.repliesShown = true;
      }
      if(this.repliesVisible){this.showReplyBox = false; this.reply = ""}
      this.repliesVisible = !this.repliesVisible;
    },
    async setLiked() {
      await this.$store
        .dispatch("comment_liked", {
          list_id: this.list.id,
          item_id: this.item.id,
          comment_id: this.comment.id
        })
        .then(result => {
          this.liked = result;
        });
    }
  },

  computed: {
    created() {
      return convertMoment.getShortTime(this.comment.created);
    }
  },

  mounted: function() {
    Promise.all([this.fetchCommenter(), this.setLiked()]).then(() => {
      this.fetched = true;
    });
  }
};
</script>

<style scoped>
#comment:hover {
  /* background-color: hsl(207, 90%, 95%); */
  /* background-color: #f5f5f5; */
}
#replies-display {
  /* border-left: 1px solid lightgrey; */
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
</style>

