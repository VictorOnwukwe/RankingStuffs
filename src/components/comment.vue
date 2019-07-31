<template>
  <div>
    <v-divider></v-divider>
    <div style="margin:0.5em 1em">
      <v-avatar size="26" class="mr-2">
        <img :src="comment.user.profile_pic" />
      </v-avatar>
      <a class="links">{{comment.user.username}}</a>
      <textarea
        class="content-container"
      >
        {{comment.content}}
      </textarea>

      <div>
        <!-- <v-icon id="like-button" class="mx-3" small @click="likeComment()">mdi-thumb-up</v-icon> -->
        <div style="display:flex">
            <div @click="likeComment()">
                <a v-if="!liked" class="links">Like</a>
                <a v-if="liked" class="links">Unlike</a>
            </div>
            <div>
                <a class="links mx-3">Reply</a>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    comment: Object,
    list_id: String,
    item_id: String
  },

  data(){
      return{
          liked: false
      }
  },

  methods: {
    async likeComment() {

        let action;
        if(this.liked){
            action = "likeComment"
        }else{
            action = "dislikeComment"
        }

      await this.$store.dispatch(action, {
          list_id: this.list_id,
          item_id: this.item_id,
          comment_id: this.comment.id
      });
      
      this.liked = !this.liked;
    }
  }
};
</script>

<style scoped>

.content-container{
    background-color:#F4F4F4;
    padding:0.5em;
    margin:0.5em;
    border-radius:0.2em;
    height:auto;
    width:100%;
    resize: none;
}

</style>

