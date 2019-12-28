<template>
  <div>
    <v-card flat class="mt-4" v-if="fetched">
      <div
        :class="{
          'px-2': $vuetify.breakpoint.xs,
          'pa-4': $vuetify.breakpoint.smAndUp
        }"
      >
        <h1
          v-if="demand"
          style="font-size:1.8em; font-weight:normal;"
          class="ptd text-capitalize"
        >
          {{ demand.title }}
        </h1>
        <span class="std">{{ created }}</span>
        <v-layout v-if="demander" class="my-4" align-center>
          <dp
            class="mr-2"
            v-if="demander.profile_pic"
            :src="demander.profile_pic.low"
          ></dp>
          <a
            @click="showUser = true"
            class="brand--text font-weight-medium pointer"
            >{{ demander.username }}</a
          >
        </v-layout>
        <p class="ptd">{{ demand.comment }}</p>
        <v-layout align-center class="mt-4">
          <span class="std" v-html="waitingMessage"></span>
          <v-spacer></v-spacer>
          <m-btn fab depressed small class="mr-2 elevation-3" @click="create()">
            <v-icon>mdi-plus</v-icon>
          </m-btn>
          <m-btn small outlined class="elevation-3" fab :loading="toggling" @click="toggleWaiting()">
            <v-icon class="mt-n3">fa-hand-holding</v-icon>
          </m-btn>
        </v-layout>

        <v-divider class="mb-4 mt-2 accent"></v-divider>

        <div class="">
          <div v-if="demand.comments == 0" class="htd px-4 py-2">
            Be the first to comment
          </div>
          <div v-else>
            <div v-for="comment in comments" :key="comment.id">
              <v-divider class="grey lighten-4 my-1"></v-divider>
              <div class="ptd ml-2">
                {{ comment.data().content }} -
                <span class="pointer brand--text brighten">{{
                  comment.data().user.username
                }}</span>
              </div>
            </div>
          </div>
          <v-divider
            v-if="comments.length > 0"
            class="grey lighten-4 mt-1"
          ></v-divider>

          <v-layout column reverse class="mt-4">
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
                  :class="comment != '' ? 'accent--text' : 'grey--text'"
                  style="position:absolute; bottom:1em; right:0.8em"
                  :disabled="comment == ''"
                  >fa-paper-plane</v-icon
                >
              </div>
            </v-flex>
            <v-flex class="mr-2">
              <v-layout class justify-end>
                <span class="std">
                  {{ demand.comment_count ? demand.comment_count : "0" }}
                  {{ demand.comment_count > 1 ? "comments" : "comment" }}
                </span>
              </v-layout>
            </v-flex>
          </v-layout>
        </div>
      </div>
      <!-- <v-row class="px-3 mt-2">
        <m-btn fab small class="mr-2">
          <v-icon>mdi-plus</v-icon>
        </m-btn>
        <m-btn small fab :loading="toggling" @click="toggleWaiting()">
          <v-icon>fa-hand-holding</v-icon>
        </m-btn>
      </v-row> -->
    </v-card>
  </div>
</template>

<script>
import commentBox from "./CommentBox";
import DisplayComments from "./DisplayComments";
let moment = require("moment");
export default {
  components: {
    DisplayComments,
    commentBox
  },
  data() {
    return {
      demand: {},
      comments: [],
      fetched: false,
      demander: {},
      comment: "",
      focused: false,
      waiting: undefined,
      toggling: false
    };
  },
  methods: {
    fetchComments() {
      this.$store.dispatch("fetch_demand_comments").then(comments => {
        this.comments = comments;
      });
    },
    fetchDemand() {
      this.$store
        .dispatch("fetch_complete_demand", this.$route.params.id)
        .then(demand => {
          this.demand = { id: this.$route.params.id, ...demand };
          this.fetchDemander().then(() => {
            this.fetched = true;
            this.setWaiting();
          });
          this.fetchComments();
          // console.log(demand);
        });
    },
    async fetchDemander() {
      await this.$store.dispatch("fetch_user", this.demand.user).then(user => {
        this.demander = user;
      });
    },
    setFocused(val) {
      this.focused = val;
    },
    uploadComment() {
      this.$store
        .dispatch("upload_demand_comment", {
          id: this.$route.params.id,
          comment: this.comment
        })
        .then(() => {});
    },
    fetchComments() {
      this.$store
        .dispatch("fetch_demand_comments", {
          limit: 20,
          id: this.$route.params.id
        })
        .then(comments => {
          this.comments = this.comments.concat(comments);
        });
    },
    toggleWaiting() {
      this.toggling = true;
      if (this.waiting) {
        this.$store
          .dispatch("leave_demanders", this.demand)
          .then(() => {
            this.demand.waiters_count--;
            this.waiting = false;
            this.toggling = false;
          })
          .catch(error => {
            console.log(error);
            this.toggling = false;
          });
      } else {
        this.$store
          .dispatch("join_demanders", this.demand)
          .then(() => {
            this.demand.waiters_count++;
            this.waiting = true;
            this.toggling = false;
          })
          .catch(error => {
            this.toggling = false;
            console.log(error);
          });
      }
    },
    async setWaiting() {
      if (this.waiting !== undefined) {
        return;
      }
      if(this.demand.user == this.$store.getters.getUser.id){
        this.waiting = true;
        return;
      }
      await this.$store
        .dispatch("checkWaiting", this.$route.params.id)
        .then(result => {
          this.waiting = result;
        });
    },
    create() {
      this.$router.push({
        path: "/create",
        query: { demanded: true, id: this.demand.id, title: this.demand.title }
      });
    }
  },
  computed: {
    created() {
      return moment(this.demand.created.toDate()).format("MMMM Do, YYYY");
    },
    waitingMessage() {
      if (this.waiting) {
        if (this.demand.waiters_count > 1) {
          if (this.demand.waiters_count > 2) {
            return `You and <b>${this.demand.waiters_count -
              1}</b>  other people are waiting for this list`;
          } else {
            return `You and <b>1</b> other person are waiting for this list`;
          }
        } else {
          return "Only <b>you</b> are waiting for this list";
        }
      } else {
        if (this.demand.waiters_count === 1) {
          return `<b>1</b> person is waiting for this list`;
        } else {
          return `<b>${this.demand.waiters_count}</b> people are waiting for this list`;
        }
      }
    }
  },
  created() {
    this.fetchDemand();
  }
};
</script>
