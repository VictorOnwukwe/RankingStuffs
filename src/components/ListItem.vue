<template>
  <div id="main">
    <v-card class="mt-2" outlined>
      <v-card-title class="px-2 py-2 top-bar">
        <v-layout align-center>
          <v-flex shrink mr-2>
            <div
              :class="{'golden': index === 1, 'silver': index === 2, 'bronze white--text': index === 3, 'plain': index > 3}"
              class="numeric-box"
              style="font-size:0.7em"
            >
              <span>{{index}}</span>
            </div>
          </v-flex>
          <v-flex>
            <a
              class="title font-weight-black text-capitalize grey--text text--darken-3"
              style="border-radius:.5em;margin-top:0em; cursor:pointer;"
              @click.stop="goItem()"
            >{{item.name}}</a>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex shrink class>
            <v-layout column justify-center align-center v-if="!voted">
              <v-icon @click="vote()" class="action-icon" color="grey" size="1.3em">fa-vote-yea</v-icon>
              <span class="subtitle-2 grey--text" style="margin-top: -0.5em">vote</span>
            </v-layout>
            <v-layout v-else>
              <v-icon v-if="votedThis" color="green" size="1.3em">fa-vote-yea</v-icon>
              <v-layout class style="width:2.4375em; border-radius:.3em" justify-center>
                <h4 class="grey--text" style="font-weight:normal;display:inline-block">{{votePercentage}}%</h4>
              </v-layout>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card-title>
      <!-- <v-divider></v-divider> -->
      <v-layout wrap>
        <v-flex xs12 sm4>
          <v-layout column style="height:100%">
              <v-card-text v-if="info.image || info.about" class="pa-1">
                <div style="float:left; margin:0 1em 0.2em 0" v-if="info.image">
                  <img-prev
                    v-model="info.image"
                    :image="info.image"
                    :width="windowSmall? 120 : 160"
                    :aspect-ratio="1"
                    :path="{item: info.id}"
                  ></img-prev>
                </div>
                <p v-if="info.about" class="secondary-text-dark subtitle-2 pa-0" style="pre-wrap">
                  {{info.about.slice(0,300)}}
                  <a
                    v-if="info.about.length>300"
                    class="brand--text underline"
                    @click.stop="goItem()"
                  >...read more</a>
                </p>
              </v-card-text>
          </v-layout>
        </v-flex>
        <v-flex xs12 sm8 id="comment-border">
          <v-divider class="hidden-sm-and-up"></v-divider>
          <v-card flat height="100%" class="pa-0">
            <v-layout style="height:100%" class column justify-space-between>
              <v-card flat tile>
                <v-card
                  class="subtitle-1 px-4 py-1 hint-text-dark"
                  flat
                  v-if="item.comment_count == 0"
                >Be the first to comment...</v-card>
                <v-card flat v-else>
                  <v-layout class="my-2" justify-center>
                    <v-icon
                      v-if="comments.length < item.comment_count && !loadingComments"
                      @click="fetchComments(5, comments[0].created)"
                      size="1.8em"
                      class="primary-text-dark"
                    >mdi-plus-circle-outline</v-icon>
                    <div v-if="loadingComments" style="display:flex; justify-content:center">
                      <v-progress-circular indeterminate :size="20" :width="3"></v-progress-circular>
                    </div>
                  </v-layout>
                  <display-comments :comments="comments" :list="list" :item="item"></display-comments>
                </v-card>
                <div v-if="addingComment" style="display:flex; justify-content:center">
                  <v-progress-circular indeterminate :size="20" :width="3"></v-progress-circular>
                </div>
                <!-- <p v-for="n in 12">good</p> -->
              </v-card>
              <v-card-actions>
                <v-layout column reverse>
                  <v-flex>
                    <div style="position:relative;">
                      <comment-box
                        v-model="comment"
                        class="comment-box"
                        rows="1"
                        placeholder="Add Comment..."
                        :max-height="126"
                        @focused="setFocused"
                      />
                      <v-icon
                        size="1.2em"
                        @click="uploadComment()"
                        :class="focused ? 'brand--text' : 'grey--text'"
                        style="position:absolute; bottom:1em; right:0.8em"
                      >fa-paper-plane</v-icon>
                    </div>
                  </v-flex>
                  <v-flex class="mr-2">
                    <v-layout class justify-end>
                      <a
                        v-if="item.comment_count>0"
                        class="secondary-text-dark underline"
                      >{{item.comment_count}} {{item.comment_count > 1 ? 'comments' : 'comment'}}</a>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-card-actions>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import comment from "./comment";
import swalErrors from "../../public/my-modules/swalErrors";
import { setTimeout } from "timers";
import commentBox from "./CommentBox";
import DisplayComments from "./DisplayComments";

export default {
  components: {
    comment,
    commentBox,
    "display-comments": DisplayComments
  },
  props: {
    item: Object,
    list: Object,
    index: Number,
    voted: Boolean
  },
  data() {
    return {
      comment: "",
      comments: [],
      display_comments: true,
      loading: false,
      commentHeight: null,
      autoGrow: true,
      Rows: 1,
      info: {},
      favorited: false,
      focused: false,
      loadingComments: false,
      votedThis: false,
      commentsFetched: false,
      infoFetched: false,
      addingComment: false
    };
  },

  methods: {
    async uploadComment() {
      if (this.user_comment === "") {
        return;
      }
      this.addingComment = true;
      await this.$store
        .dispatch("upload_comment", {
          item_id: this.item.id,
          item_name: this.item.name,
          list_id: this.list.id,
          list_title: this.list.title,
          comment: this.comment
        })
        .then(comment => {
          this.addingComment = false;
          this.comment = "";
          this.comments.push(comment);
          this.item.comment_count++;
        })
        .catch(error => {
          this.addingComment = false;
        });
    },

    setFocused(bool) {
      this.focused = bool;
    },

    vote() {
      this.$emit("voted");
      this.$store.dispatch("add_vote", {
        item_id: this.item.id,
        item_name: this.item.name,
        list_title: this.list.title,
        list_id: this.list.id
      });
    },

    async fetchComments(num, lastTimestamp) {
      this.loadingComments = true;
      return await this.$store
        .dispatch("fetch_comments", {
          item_id: this.item.id,
          list_id: this.list.id,
          num: num,
          timestamp: lastTimestamp
        })
        .then(comments => {
          for (let i = 0; i < comments.length; i++) {
            this.comments.unshift(comments[i]);
          }
          this.loadingComments = false;
        })
        .catch(error => {
          console.log("Error: ", error);
          this.loadingComments = false;
        });
    },

    goItem() {
      this.$router.push({
        path: "/items/" + this.item.name,
        query: {
          id: this.info.id
        }
      });
    },

    async fetchInfo() {
      this.$store
        .dispatch("fetch_item", this.item.info)
        .then(info => {
          this.info = info;
          info.image ? this.$emit("hasImage", info.image) : null;
        })
        .then(() => {
          this.infoFetched = true;
        });
    },
    async checkVoted() {
      await this.$store
        .dispatch("check_item_voted", {
          item_id: this.item.id,
          list_id: this.list.id
        })
        .then(result => {
          this.votedThis = result;
        });
    }
  },

  computed: {
    windowSmall() {
      return screen.width < 600;
    },
    checkHeight() {
      setTimeout(() => {
        return document.getElementById("comment-reply").scrollHeight < 130;
      }, 3000);
    },
    votePercentage() {
      return Math.round((this.item.votes / this.list.votes) * 100);
    },
    authenticated() {
      return this.$store.getters.getAuthenticated;
    }
  },

  watch: {
    voted() {
      this.checkVoted();
    }
  },

  mounted: function() {
    this.fetchComments(5, "now");
    this.fetchInfo();
  }
};
</script>

<style scoped>
@media (min-width: 600px) {
  #comment-border {
    border-left: 1px solid lightgray;
  }
}

.clear-float {
  clear: both;
}
</style>
