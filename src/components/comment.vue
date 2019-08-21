<template>
  <div id="main">
    <v-card tile class="mt-2" flat>
      <div>
        <div id="comment" style="display:flex">
          <div>
            <v-avatar size="26" class="ma-2">
              <img :src="user.profile_pic" />
            </v-avatar>
          </div>
          <div>
            <div class="mt-2 mr-2">
              <p>
                <a @click="showUser=true" class="blue--text subtitle-2 font-weight-bold">{{user.username}}</a>
                - {{comment.content}}
              </p>
            </div>
            <div style="display:flex" class="mt-n2">
              <div @click="toggleLike()" style="display:flex">
                <v-icon class="like-button" @click v-if="!liked" small>mdi-thumb-up</v-icon>
                <v-icon class="like-button" @click v-if="liked" color="blue" small>mdi-thumb-up</v-icon>
                <span v-if="comment.likes>0" class="ml-1">{{comment.likes}}</span>
              </div>
              <div @click="replyInput=!replyInput">
                <v-icon @click small class="mx-2 reply-button">mdi-reply</v-icon>
              </div>

              <div v-if="comment.replies_count>0" @click="showReplies()">
                <a class="links" style="color:#757579">Replies({{comment.replies_count}})</a>
              </div>
            </div>
          </div>
        </div>
        <div id="replies-display" class="mt-2 ml-11 pl-2" v-if="repliesVisible">
          <div v-if="replies.length>0 && replies[0].index!=1">
            <a class="accent--text" @click="fetchReplies(5,replies[0].created)">Load more...</a>
          </div>

          <div v-if="loading" style="display:flex; justify-content:center">
            <v-btn depressed color="white">
              <v-progress-circular indeterminate :value="80" :size="20" :width="3"></v-progress-circular>
            </v-btn>
          </div>

          <Reply
            v-for="reply in replies"
            :key="reply.id"
            :path="{list_id: list_id, item_id: item_id, comment_id: comment.id}"
            :reply="reply"
          ></Reply>
        </div>
      </div>
    </v-card>

    <v-dialog v-model="showUser" max-width="300px">
      <PreviewUser :user="commenter" @closeDialog="showUser=false"></PreviewUser>
    </v-dialog>
  </div>
</template>

<script>
import swalErrors from "../../public/my-modules/swalErrors";
import autosize from "autosize";
import Reply from "./reply";
import PreviewUser from "./PreviewUser";

export default {
  components: {
    Reply,
    PreviewUser
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
      showUser: false
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
          });
      } else {
        swalErrors.showAuthenticationError();
      }
    },

    fetchCommenter(){
      this.$store.dispatch("fetch_user", this.comment.user).then(user => {
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
  background-color: hsl(207, 90%, 95%);
}
#replies-display {
  border-left: 1px solid grey;
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

.like-button {
  transition: all 0.05s linear;
}

.like-button:hover {
  transform: scale(1.1);
}

.like-button:active {
  transform: scale(0.9);
}

.reply-button {
  transition: all 0.05s linear;
}
.reply-button:hover {
  transform: scale(1.1);
}

.reply-button:active {
  transform: scale(0.9);
}
</style>

