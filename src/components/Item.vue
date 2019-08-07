<template>
  <div>
    <v-layout>
      <v-flex xs12 mt-3>
        <v-card class="pa-0">
          <v-card-title primary-title>
            <v-layout>
              <v-flex xs-2>
                <img :src="item.image" class="image mb-2 mr-2">
              </v-flex>
              <v-flex xs-10>
                <div>
                  <h2
                    class="headline mb-0"
                    style="font-size:0.5em"
                  >{{item.title}} votes: {{votePercentage()}}%</h2>
                  <div style="font-size: 0.9em">{{ item.about }}</div>
                </div>
              </v-flex>
            </v-layout>
          </v-card-title>

          <v-card-actions>
            <div id="bottom-nav">
              <v-icon v-if="!voted" @click="toggleVote()" color="primary">mdi-thumb-up</v-icon>
            </div>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

    <div id="comments">
      <div class="comments-header">
        <a
          style="float:left"
          v-if="comments[0] && comments[0].index!==1 && display_comments===true"
          class="links"
          @click="fetchComments(5, comments[0].created)"
        >Load more...</a>

        <a
          style="float:right"
          class="links"
          v-if="comments.length>0"
          @click="display_comments = !display_comments"
        >
          <span v-if="display_comments==true">Hide comments</span>
          <span v-if="display_comments==false">Show comments</span>
        </a>
      </div>

      <div v-if="loading" style="display:flex; justify-content:center">
        <v-btn flat color="grey">
          <v-progress-circular indeterminate :value="80" :size="25" :width="3"></v-progress-circular>
        </v-btn>
      </div>

      <div v-for="(compComment, index) in comments" :key="index">
        <div v-if="display_comments">
          <comment :comment="compComment" :list_id="list.id" :item_id="item.id"></comment>
        </div>
      </div>
      <div id="comment_container">
        <textarea id="comment_box" v-model="user_comment" rows="2"></textarea>
        <v-btn @click="addComment()">Add comment</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import comment from "./comment";
import swalErrors from "../../public/my-modules/swalErrors";
import { setTimeout } from 'timers';

export default {
  components: {
    comment
  },
  props: {
    item: Object,
    list: Object
  },
  data() {
    return {
      user_comment: "",
      comments: [],
      display_comments: true,
      voted: null,
      loading: false
    };
  },

  methods: {
    async addComment() {
      if (this.$store.state.authenticated) {
        await this.$store
          .dispatch("upload_comment", {
            item_id: this.item.id,
            list_id: this.list.id,
            comment: this.user_comment
          })
          .then(comment => {
            this.comments.push(comment);
          });
      } else {
        swalErrors.showAuthenticationError();
      }
    },

    toggleVote() {

      if (this.$store.state.authenticated) {
        if (this.voted) {
          this.$store.dispatch("remove_vote", {
            item_id: this.item.id,
            list_id: this.list.id
          });
        } else {
          this.$store.dispatch("add_vote", {
            item_id: this.item.id,
            list_id: this.list.id
          });
        }
      } else {
        swalErrors.showAuthenticationError();
      }

      setTimeout(() => {
        this.checkVote();
        console.log(this.voted);
      },1000);

    },

    votePercentage() {
      return Math.round((this.item.votes / this.list.votes) * 100);
    },

    async fetchComments(num, lastTimestamp) {
      this.loading = true;
      return await this.$store
        .dispatch("fetch_comments", {
          item_id: this.item.id,
          list_id: this.list.id,
          num: num,
          timestamp: lastTimestamp
        })
        .then(comments => {
          for (let i = 0; i < comments.length; i++) {
            //make first created comment appear first
            this.comments.unshift(comments[i]);
          }
          this.loading = false;
        })
        .catch(error => {
          console.log("Error: ", error);
          this.loading = false;
        });
    },

    checkVote() {
      if (this.list.voters.includes(this.$store.state.user.id)) {
        this.voted = true;
      } else {
        this.voted = false;
      }
    }
  },

  computed: {},

  mounted: function() {
    this.fetchComments(1, "now");
    this.checkVote();
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

.clear-float {
  clear: both;
}

.comments-header {
  display: block;
  margin-bottom: 3em;
}

.image{
  width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>
