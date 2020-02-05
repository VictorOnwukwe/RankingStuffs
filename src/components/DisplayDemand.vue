<template>
  <div>
    <v-card flat class="mt-4" v-if="demand.title">
      <div>
        <h1
          v-if="demand"
          style="font-size:1.8em; font-weight:normal;"
          class="ptd text-capitalize"
        >
          {{ demand.title }}
        </h1>
        <span class="std">{{ created }}</span>
        <v-layout v-if="demander" class="my-4" align-center>
          <dp class="mr-2" :src="demander.profile_pic"></dp>
          <username v-if="demander" :user="demander"></username>
        </v-layout>
        <p class="ptd pre-wrap spacious">{{ demand.comment }}</p>
        <v-layout align-center class="mt-4">
          <span class="std" v-html="waitingMessage"></span>
          <v-spacer></v-spacer>
          <m-btn fab outlined depressed small @click="create()">
            <v-icon>$vuetify.icons.create</v-icon>
          </m-btn>
          <m-btn
            small
            outlined
            depressed
            class="ml-2"
            :color="waiting ? 'accent' : 'grey'"
            v-if="!isCreator"
            fab
            :loading="toggling"
            @click="toggleWaiting()"
          >
            <v-icon class="">{{
              waiting ? "$vuetify.icons.leaveQueue" : "$vuetify.icons.joinQueue"
            }}</v-icon>
          </m-btn>
        </v-layout>

        <v-divider class="mb-4 mt-2"></v-divider>

        <div>
          <div v-if="demand.comments == 0" class="htd px-4 py-2">
            Be the first to comment
          </div>
          <v-layout v-else-if="fetching" justify-center>
            <m-progress></m-progress>
          </v-layout>
          <div v-else class="mt-6">
            <div v-for="comment in comments" :key="comment.id">
              <div class="ptd ml-2" style="font-size:0.9em">
                {{ comment.data().content }} -
                <username :user="comment.data().user"></username>
              </div>
              <v-divider class="grey lighten-4 my-2"></v-divider>
            </div>
          </div>

          <v-layout v-if="commenting" justify-center class="my-2">
            <m-progress></m-progress>
          </v-layout>

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

          <v-card-title
          class="ptd pl-0 font-weight-bold mt-6 mb-4"
          style="font-size: 1em"
          >Other Demands in {{ demand.category }} category</v-card-title
        >

          <display-demands
            :demands="otherDemands"
            :sub="true"
          ></display-demands>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import commentBox from "./CommentBox";
import DisplayDemands from "./DisplayDemands";
let moment = require("moment");
export default {
  components: {
    commentBox,
    DisplayDemands
  },
  data() {
    return {
      demand: {},
      comments: [],
      demander: null,
      comment: "",
      focused: false,
      waiting: undefined,
      toggling: false,
      commenting: false,
      fetching: false,
      userPreview: false,
      currentUser: null,
      otherDemands: []
    };
  },
  methods: {
    fetchDemand() {
      this.$store
        .dispatch("fetch_complete_demand", this.$route.params.id)
        .then(demand => {
          this.demand = { id: this.$route.params.id, ...demand };
          this.$store.dispatch("set_loading", false);
          this.fetchDemander().then(() => {
            this.setWaiting();
          });
          this.fetchComments();
          this.fetchOtherDemands();
        })
        .catch(_ => {
          this.dispatch("setSnackbar", {
            show: true,
            message: "sorry. An error occured",
            type: "error"
          });
          this.$store.dispatch("set_loading", false);
        });
    },
    async fetchOtherDemands() {
      await this.$store
        .dispatch("fetch_category_demands", {
          category: this.demand.category,
          limit: 10
        })
        .then(demands => {
          this.otherDemands = this.otherDemands.concat(demands.docs);
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
      this.commenting = true;
      this.$store
        .dispatch("upload_demand_comment", {
          id: this.$route.params.id,
          comment: this.comment
        })
        .then(comment => {
          this.comments.push(comment);
          this.comment = "";
          this.commenting = false;
        })
        .catch(_ => {
          this.dispatch("setSnackbar", {
            show: true,
            message: "sorry. An error occured",
            type: "error"
          });
          this.commenting = false;
        });
    },
    isVisitor(comment) {
      return comment.data().user.username.includes("visitor");
    },
    fetchComments() {
      this.fetching = true;
      this.$store
        .dispatch("fetch_demand_comments", {
          limit: 20,
          id: this.$route.params.id
        })
        .then(comments => {
          this.comments = this.comments.concat(comments);
          this.fetching = false;
        })
        .catch(_ => {
          this.dispatch("setSnackbar", {
            show: true,
            message: "sorry. An error occured",
            type: "error"
          });
        });
    },
    showUser(comment) {
      if (this.isVisitor(comment)) {
        return;
      }
      this.currentUser = comment.data().user;
      this.userPreview = true;
    },
    toggleWaiting() {
      if (!this.$store.getters.authenticated) {
        this.$store.dispatch("set_login", true);
        return;
      }
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
            this.toggling = false;
            this.$store.dispatch("set_snackbar", {
              show: true,
              message: "Sorry. An error occured",
              type: "error"
            });
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
            this.$store.dispatch("set_snackbar", {
              show: true,
              message: "Sorry. An error occured",
              type: "error"
            });
          });
      }
    },
    async setWaiting() {
      if (this.waiting !== undefined) {
        return;
      }
      if (this.isCreator) {
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
    },
    isCreator() {
      if (!this.$store.getters.authenticated) {
        return false;
      }
      return this.demand.user == this.$store.getters.getUser.id;
    }
  },
  created() {
    this.$store.dispatch("set_loading", true);
    this.fetchDemand();
  }
};
</script>
