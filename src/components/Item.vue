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
      <a
        v-if="comments[0] && comments[0].index!==1"
        class="links"
        @click="fetchComments(5, comments[0].created)"
      >Previous Comments...</a>

      <div>
        <a
          class="links"
          v-if="display_comments = true"
          @click="display_comments = !display_comments"
        >
          <span v-if="display_comments==true">Hide comments...</span>
          <span v-if="display_comments==false">Show comments...</span>
        </a>
      </div>

      <div v-for="(comment, index) in comments" :key="index" v-if="display_comments">
        <div style="margin:0.5em 1em">
          <v-avatar size="24" class="mr-2">
            <img :src="comment.user.profile_pic" />
          </v-avatar>
          <a class="links">{{comment.user.username}}</a>
          <div
            style="background-color:#F4F4F4; padding:0.5em; margin:0.5em; border-radius:0.2em"
          >{{comment.content}}</div>
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
export default {
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
      await this.$store.dispatch("add_comment", {
        item_id: this.item.id,
        list_id: this.list_id,
        comment: this.user_comment
      });

      this.comments.push(this.user_comment);
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

.links {
  color: var(--link);
  text-decoration: none;
}
.links:hover {
  text-decoration: underline;
}
</style>
