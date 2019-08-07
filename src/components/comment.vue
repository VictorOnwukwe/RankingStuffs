<template>
  <div>
    <div style="margin:0.5em 1em; height:auto">
      <v-avatar size="26" class="mr-2">
        <img :src="comment.user.profile_pic" />
      </v-avatar>
      <a class="links">
        <strong>{{comment.user.username}}</strong>
      </a>
      <div class="content-container">{{comment.content}}</div>

      <div>
        <!-- <v-icon id="like-button" class="mx-3" small @click="likeComment()">mdi-thumb-up</v-icon> -->
        <div style="display:flex">
          <div @click="toggleLike()">
            <v-icon class="like-button" @click v-if="!liked" small>mdi-thumb-up</v-icon>
            <v-icon class="like-button" @click v-if="liked" color="blue" small>mdi-thumb-up</v-icon>
            <span v-if="comment.likes>0" class="mx-1">{{comment.likes}}</span>
          </div>
          <div @click="replyInput=!replyInput">
            <v-icon @click small class="mx-2 reply-button">mdi-reply</v-icon>
          </div>

          <div v-if="comment.replies_count>0" @click="showReplies()">
            <a class="links" style="color:#757579">Replies({{comment.replies_count}})</a>
          </div>
        </div>
        <div v-if="repliesVisible" style="margin-left:2.5em">
          <div v-if="replies.length>0 && replies[0].index!=1">
            <a class="links" @click="fetchReplies(5,replies[0].created)">Load more...</a>
          </div>

          <div v-if="loading" style="display:flex; justify-content:center">
            <v-btn flat color="grey">
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
        <div v-if="replyInput || repliesVisible" id="reply-box">
          <textarea v-model="reply" id="reply-container"></textarea>
          <div id="action-buttons">
            <v-icon @click="replyComment()" size="20">mdi-send</v-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import swalErrors from "../../public/my-modules/swalErrors";
import autosize from "autosize";
import Reply from "./reply";

export default {
  components: {
    Reply
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
      repliesShown: false
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
    setTimeout(() => {
      this.setLikedState();
    }, 1000);
  }
};
</script>

<style scoped>
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

.like-button{
  transition: all 0.05s linear;
}

.like-button:hover{
  transform: scale(1.1);
}

.like-button:active{
  transform: scale(0.9);
}

.reply-button{
  transition: all 0.05s linear;
}
.reply-button:hover{
  transform: scale(1.1);
}

.reply-button:active{
  transform: scale(0.9);
}
</style>

