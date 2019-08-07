<template>
  <div>
    <div class="my-2">
      <v-avatar size="20" class="mr-2">
        <img :src="reply.user.profile_pic" />
      </v-avatar>
      <a class="links"><strong>{{reply.user.username}}</strong></a>
      <div class="content-container">{{reply.content}}</div>
      <div @click="toggleLike()">
        <v-icon class="like-button" v-if="!liked" small @click="">mdi-thumb-up</v-icon>
        <v-icon class="like-button" v-if="liked" small @click="" color="blue">mdi-thumb-up</v-icon>
        <span v-if="reply.likes>0" class="mx-1">{{reply.likes}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { setTimeout } from 'timers';
import swalErrors from '../../public/my-modules/swalErrors'
export default {
  props: {
    path: Object,
    reply: Object
  },

  data() {
    return {
      liked: false
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
    setTimeout(() => {
        this.setLikedState()
    },1000)
  }
};
</script>

<style scoped>
.like-button{
  transition: all 0.2s linear;
}

.like-button:hover{
  transform: scale(1.2);
}

.like-button:active{
  transform: scale(0.9);
}
</style>
