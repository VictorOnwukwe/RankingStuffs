<template>
    <v-card tile class="" flat>
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
                <a @click="showUser=true" class="blue--text subtitle-2 font-weight-bold">{{comment.user.username}}</a>
                 {{comment.content}}
              </p>
            </div>
            <!-- <div style="display:flex" class="mt-n2">
              <div @click="toggleLike()" style="display:flex">
                <v-icon class="like-button" @click v-if="!liked" small>mdi-thumb-up</v-icon>
                <v-icon class="like-button" @click v-if="liked" color="blue" small>mdi-thumb-up</v-icon>
                <span v-if="comment.likes>0" class="ml-1">{{comment.likes}}</span>
              </div>
            </div> -->
          </div>
        </div>
        <!-- <div class="mt-2 pl-2">
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
        </div> -->
      </div>
    </v-card>
</template>

<script>
export default {
    props:{
        comment: Object
    }
}
</script>