<template>
  <div>
    <v-layout>
      <v-flex xs12 mt-3>
        <v-card class="pa-0">
          <v-card-title primary-title>
            <v-layout>
              <v-flex xs-2>
                <v-img :src="item.image" class="mb-2 mr-2" max-width="200px" contain></v-img>
              </v-flex>
              <v-flex xs-10>
                <div>
                  <h2 class="headline mb-0">{{item.title}} votes: {{votePercentage()}}%</h2>
                  <div>{{ item.about }}</div>
                </div>
              </v-flex>
            </v-layout>
          </v-card-title>

          <v-card-actions>
            <div id="bottom-nav">
              <v-icon @click="addVote()" color="primary">mdi-thumb-up</v-icon>
            </div>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

    <div id="comments">
      <div class="comments-header">
        <a style="float:left"
          v-if="comments[0] && comments[0].index!==1 && display_comments===true"
          class="links"
          @click="fetchComments(5, comments[0].created)"
        >Previous Comments</a>

        <a style="float:right" class="links" v-if="comments.length>0" @click="display_comments = !display_comments">
          <span v-if="display_comments==true">Hide comments</span>
          <span v-if="display_comments==false">Show comments</span>
        </a>
      </div>

      <div class="clear-float" v-for="(compComment, index) in comments" :key="index">
        <div v-if="display_comments">
          <comment :comment="compComment" :list_id="list_id" :item_id="item.id"></comment>
        </div>
      </div>
      <div id="comment_container">
        <v-textarea id="comment_box" v-model="user_comment"></v-textarea>
        <v-btn @click="addComment()">Add comment</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import comment from "./comment";
import swalErrors from "../../public/my-modules/swalErrors";

export default {
  components: {
    comment
  },
  props: {
    item: Object,
    list_id: String
  },
  data() {
    return {
      user_comment: "",
      comments: [],
      display_comments: true
    };
  },

  methods: {
    async addComment() {

      if(this.$store.state.authenticated){
        await this.$store
        .dispatch("add_comment", {
          item_id: this.item.id,
          list_id: this.list_id,
          comment: this.user_comment
        })
        .then(comment => {
          this.comments.push(comment);
        });
      }else{
        swalErrors.showAuthenticationError();
      }
    },

    addVote() {
      this.$store.dispatch("add_vote", {
        item_id: this.item.id,
        list_id: this.list_id
      });
    },

    votePercentage() {
      return Math.round((this.item.votes / this.$store.state.list.votes) * 100);
    },

    async fetchComments(num, lastTimestamp) {
      return await this.$store
        .dispatch("fetch_comments", {
          item_id: this.item.id,
          list_id: this.list_id,
          num: num,
          timestamp: lastTimestamp
        })
        .then(comments => {
          for (let i = 0; i < comments.length; i++) {
            //make first created comment appear first
            this.comments.unshift(comments[i]);
          }
        })
        .catch(error => {
          console.log("Error: ", error);
        });
    }
  },

  computed: {},

  mounted: function() {
    this.fetchComments(5, "now");
  }
};
</script>

<style>
#comments {
  background-color: white;
  padding: 1em 1em;
}

#comment_container {
}

#comment_box {
  width: 100%;
  background-color: var(--primary);
}

#bottom-nav {
  width: 100%;
  background-color: brown;
  height: 3em;
  display: flex;
  justify-content: center;
}

.clear-float{
  clear: both;
}

.comments-header{
  display: block;
  margin-bottom: 1em
}
</style>
