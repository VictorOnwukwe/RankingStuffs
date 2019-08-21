<template>
  <div id="main">
    <v-layout mt-12>
      <v-card tile width="100%">
        <v-layout row-reverse>
          <v-flex shrink pa-2>
            <v-card max-width="250px" class="pr-0" flat height="100%" style>
              <v-layout column>
                <v-flex shrink>
                  <v-card-title class="pl-0">
                    <v-layout>
                      <v-flex shrink mr-2>
                        <div class="numeric-box" style="font-size:0.7em"><span>{{index}}</span></div>
                      </v-flex>
                      <v-flex>
                        <a class="title blue--text">{{item.title}}</a>
                      </v-flex>
                    </v-layout>
                  </v-card-title>
                </v-flex>
                <v-flex>
                  <v-card-text>
                    <v-img
                      :src="item.image"
                      width="150px"
                      class="mb-2"
                      style="border-radius:4px"
                      aspect-ratio="1"
                    ></v-img>
                    <div
                      class="grey--text"
                    >{{item.about}} he has been of great use in the Nigerian movie industry. From generation to generation</div>
                  </v-card-text>
                </v-flex>
              </v-layout>
            </v-card>
          </v-flex>
          <v-divider vertical></v-divider>
          <v-flex>
            <v-card tile flat height="100%">
              <v-card-text>
                <div></div>
                <div v-if="comments.length == 0" class="mt-3">Be the first to comment...</div>
                <div v-else>
                  <comment
                    v-for="(comment, index) in comments"
                    :key="index"
                    :comment="comment"
                    :list_id="list.id"
                    :item_id="item.id"
                  ></comment>
                </div>
              </v-card-text>
            </v-card>

            <!-- <div id="comments">
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
                  <span v-if="display_comments==true" class="blue--text">Hide comments</span>
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
            </div>-->
          </v-flex>
        </v-layout>
        <v-bottom-navigation tile grow depressed>
          <v-btn value="recent">
            <span>Recent</span>
            <v-icon>history</v-icon>
          </v-btn>

          <v-btn value="favorites">
            <span>Favorite</span>
            <v-icon>favorite</v-icon>
          </v-btn>

          <v-btn value="nearby">
            <span>Nearby</span>
            <v-icon>place</v-icon>
          </v-btn>
        </v-bottom-navigation>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
import comment from "./comment";
import swalErrors from "../../public/my-modules/swalErrors";
import { setTimeout } from "timers";

export default {
  components: {
    comment
  },
  props: {
    item: Object,
    list: Object,
    index: Number
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
      }, 1000);
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

  computed: {
    aboutTruncated() {
      let element = document.querySelector(".text-ellipsis");
      return (
        element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth
      );
    }
  },

  mounted: function() {
    this.fetchComments(5, "now");
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

.text-ellipsis {
  display: block;
  display: -webkit-box;
  height: 80px;
  margin: 0 auto;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
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

.image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>
