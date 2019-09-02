<template>
  <div id="main">
    <v-card tile class flat>
      <div>
        <div id="comment" style="display:flex">
          <div>
            <v-avatar size="26" class="ma-2">
              <img :src="comment.user.profile_pic" />
            </v-avatar>
          </div>
          <div>
            <div class="mt-2 mr-2">
              <p>
                <a
                  @click="showUser=true"
                  class="blue--text subtitle-2 font-weight-bold"
                >{{comment.user.username}}</a>
                {{comment.content.slice(0,50)}}
                <span
                  @click="showComment=true"
                  v-if="comment.content.length>50"
                  class="brand--text"
                  style="cursor:pointer"
                >...read more</span>
              </p>
            </div>
            <div style="display:flex" class="mt-n2">
              <div @click="toggleLike()" style="display:flex">
                <v-icon class="like-button" @click v-if="!liked" color="grey" small>mdi-thumb-up</v-icon>
                <v-icon class="like-button" @click v-if="liked" color="blue" small>mdi-thumb-up</v-icon>
                <span v-if="comment.likes>0" class="ml-1">{{comment.likes}}</span>
              </div>
              <div @click="replyInput=!replyInput">
                <v-icon
                  @click="showReplyBox=!showReplyBox"
                  small
                  class="mx-2 reply-button"
                  color="grey"
                >mdi-reply</v-icon>
              </div>

              <div v-if="comment.replies_count>0" @click="showReplies()">
                <a class="links" style="color:#757579">Replies({{comment.replies_count}})</a>
              </div>
            </div>
          </div>
        </div>
        <div id="replies-display" class="my-2 ml-11 pl-2" v-if="repliesVisible || showReplyBox">
          <div v-if="repliesVisible">
            <div v-if="comment.replies_count > replies.length">
              <a class="accent--text" @click="fetchReplies(5,replies[0].created)">Load more...</a>
            </div>

            <div v-if="loading" style="display:flex; justify-content:center">
              <v-btn depressed color="white">
                <v-progress-circular indeterminate :value="80" :size="20" :width="3"></v-progress-circular>
              </v-btn>
            </div>

            <div v-for="(reply, index) in replies" :key="reply.id">
              <Reply
                :path="{list_id: list_id, item_id: item_id, comment_id: comment.id}"
                :reply="reply"
              ></Reply>
              <v-divider v-if="index!=replies.length - 1"></v-divider>
            </div>
          </div>
          <v-card>
            <v-textarea v-model="reply" outlined rows="1" auto-grow rounded></v-textarea>
            <v-btn @click="replyComment()">Send</v-btn>
          </v-card>
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

export default {
  components: {
    Reply,
    PreviewUser,
    PreviewComment
  },
  props: {
    comment: Object,
    list_id: String,
    item_id: String
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
      showReplyBox: false
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
          list_id: this.list_id,
          item_id: this.item_id,
          comment_id: this.comment.id
        });
      } else {
        swalErrors.showAuthenticationError();
      }
    },

    replyComment() {
      if (this.$store.getters.getAuthenticated) {
        this.$store
          .dispatch("upload_reply", {
            list_id: this.list_id,
            item_id: this.item_id,
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
              user: this.comment.user,
              item: this.item,
              list: this.list,
              comment: this.comment
            });
          });
      } else {
        swalErrors.showAuthenticationError();
      }
    },

    fetchCommenter() {
      this.$store.dispatch("fetch_user", this.comment.user.id).then(user => {
        this.commenter = user;
      });
    },

    fetchReplies(num, timestamp) {
      this.loading = true;
      this.$store
        .dispatch("fetchReplies", {
          list_id: this.list_id,
          item_id: this.item_id,
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

    showReplies() {
      if (!this.repliesShown) {
        if (this.replies.length === 0) {
          this.fetchReplies(5, "now");
        } else {
          this.fetchReplies(5, this.replies[0].created);
        }
        this.repliesShown = true;
      }

      this.repliesVisible = !this.repliesVisible;
    },
    setLikedState() {
      if (this.comment.likers !== undefined) {
        if (this.comment.likers.includes(this.$store.getters.getUser.id)) {
          setTimeout(() => {
            this.liked = true;
          }, 100);
        }
      }
    }
  },

  mounted: function() {
    this.fetchCommenter();
    setTimeout(() => {
      this.setLikedState();
    }, 1000);
  }
};
</script>

<style scoped>
#comment:hover {
  /* background-color: hsl(207, 90%, 95%); */
  background-color: #f5f5f5;
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

