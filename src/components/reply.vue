<template>
  <div id="reply">
    <div id="container" class="my-2">
      <div>
        <v-avatar size="20" class="mr-2">
          <img :src="user.profile_pic" />
        </v-avatar>
      </div>

      <div>
        <p>
          <a @click="showUser=true" class="blue--text subtitle-2 font-weight-bold">{{user.username}}</a>
          - {{reply.content}}
        </p>
        <div @click="toggleLike()" class="mt-n4">
        <v-icon class="like-button" v-if="!liked" small @click>mdi-thumb-up</v-icon>
        <v-icon class="like-button" v-if="liked" small @click color="blue">mdi-thumb-up</v-icon>
        <span v-if="reply.likes>0" class="mx-1">{{reply.likes}}</span>
      </div>
      </div>
    </div>
    <v-dialog v-model="showUser" max-width="300px">
      <PreviewUser :user="replier" @closeDialog="showUser=false"></PreviewUser>
    </v-dialog>
  </div>
</template>

<script>
import { setTimeout } from "timers";
import swalErrors from "../../public/my-modules/swalErrors";
import PreviewUser from "./PreviewUser";
export default {
  props: {
    path: Object,
    reply: Object
  },

  data() {
    return {
      liked: false,
      showUser: false,
      replier
    };
  },

  methods: {
    toggleLike() {
      if (this.$store.getters.getAuthenticated) {
        let action;
        if (this.liked) {
          this.reply.likes--;
          action = "unlikeReply";
        } else {
          this.reply.likes++;
          action = "likeReply";
        }
        this.liked = !this.liked;

        this.$store.dispatch(action, {
          list_id: this.path.list_id,
          item_id: this.path.item_id,
          comment_id: this.path.comment_id,
          reply_id: this.reply.id
        });
      } else {
        swalErrors.showAuthenticationError();
      }
    },

    fetchReplier(){
      this.$store.dispatch("fetch_user", this.reply.user).then(user => {
        this.Replier = user;
      });
    },

    setLikedState() {
      if (this.reply.likers !== undefined) {
        if (this.reply.likers.includes(this.$store.getters.getUser.id)) {
          setTimeout(() => {
            this.liked = true;
          }, 50);
        }
      }
    }
  },

  mounted: function() {
    this.fetchReplier();
    setTimeout(() => {
      this.setLikedState();
    }, 1000);
  }
};
</script>

<style scoped>
#reply{
  padding: 0.3em;
}
#reply:hover{
  background-color: hsl(207, 90%, 95%);
}
#container {
  display: flex;
}
.like-button {
  transition: all 0.2s linear;
}

.like-button:hover {
  transform: scale(1.2);
}

.like-button:active {
  transform: scale(0.9);
}
</style>
