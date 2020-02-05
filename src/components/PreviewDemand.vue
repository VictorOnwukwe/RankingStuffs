<template>
  <v-card :class="{ loading: !fetched }" width="100%" :outlined="sub">
    <div v-if="fetched">
      <v-card-title class style>
        <v-layout column>
          <v-layout align-start>
            <v-flex>
              <router-link
                :to="'/demands/' + demand.id"
                class="text-capitalize no-deco oswald"
                :class="{ 'font-weight-medium ptd': !sub, 'link--text': sub }"
                style="font-size:0.85em"
              >
                {{ demand.title }}
              </router-link>
            </v-flex>
            <v-flex shrink>
              <v-menu
                :close-on-content-click="false"
                left
                min-width="90px"
                max-width="90px"
              >
                <template v-slot:activator="{ on }">
                  <v-icon @click="setWaiting()" class="ml-2" color="" v-on="on"
                    >mdi-dots-vertical</v-icon
                  >
                </template>
                <v-list class="pa-0">
                  <v-list-item @click="create()" class="pt-2 tile">
                    <v-layout column align-center>
                      <v-icon>$vuetify.icons.create</v-icon>
                      <span class="caption std">Create</span>
                    </v-layout>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item
                    v-if="!isCreator"
                    @click="toggleWaiting()"
                    class="tile"
                  >
                    <v-layout
                      justify-center
                      v-if="loading || waiting == undefined"
                    >
                      <m-progress></m-progress>
                    </v-layout>
                    <v-layout v-else column align-center>
                      <v-icon :color="waiting ? 'accent' : null">{{
                        waiting
                          ? "$vuetify.icons.leaveQueue"
                          : "$vuetify.icons.joinQueue"
                      }}</v-icon>
                      <span
                        class="caption"
                        :class="waiting ? 'accent--text' : 'std'"
                        >{{ waiting ? "Queueing" : "Queue" }}</span
                      >
                    </v-layout>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-flex>
          </v-layout>
          <div class="ptd oswald" style="font-size:0.6em">
            <span class="ptd">{{ created }}</span>
            <span class="ptd">
              |
              <span>{{ demand.waiters_count }}</span>
              {{ demand.waiters_count > 1 ? "people" : "person" }}
              waiting</span
            >
          </div>
        </v-layout>
      </v-card-title>
      <v-card-text class="subtitle-1 pt-1 pb-3" v-if="!sub">
        <v-layout v-if="creator">
          <dp class="mr-2" :src="creator.profile_pic"></dp>
          <username :user="creator"></username>
        </v-layout>
        <!-- <div
              v-if="demand.comment"
              class="ptd mt-2 pre-wrap"
              style="font-size:0.85em"
            >{{ demand.comment.slice(0, 200)
              }}{{ demand.comment.length > 200 ? "..." : ""
              }}<router-link
                :to="'/demands/' + demand.id"
                v-if="demand.comment.length > 200"
                class="no-deco"
                >more</router-link
              >
            </div> -->
      </v-card-text>
    </div>
    <v-dialog v-if="creator" v-model="showUser" max-width="400px">
      <preview-user :id="creator.id" @close="showUser = false"></preview-user>
    </v-dialog>
  </v-card>
</template>

<script>
let moment = require("moment");
export default {
  props: {
    demand: Object,
    sub: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      waiting: undefined,
      creator: null,
      showUser: false,
      fetched: false,
      loading: false
    };
  },
  methods: {
    create() {
      this.$router.push({
        path: "/create",
        query: { demanded: true, id: this.demand.id, title: this.demand.title }
      });
    },
    async setWaiting() {
      if (this.waiting !== undefined || this.isCreator) {
        return;
      }
      await this.$store
        .dispatch("checkWaiting", this.demand.id)
        .then(result => {
          this.waiting = result;
        });
    },
    toggleWaiting() {
      if (!this.$store.getters.authenticated) {
        this.$store.dispatch("set_login", true);
        return;
      }
      this.loading = true;
      if (this.waiting) {
        this.$store
          .dispatch("leave_demanders", this.demand)
          .then(() => {
            this.demand.waiters_count--;
            this.waiting = false;
            this.loading = false;
          })
          .catch(_ => {
            this.loading = false;
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
            this.loading = false;
          })
          .catch(_ => {
            this.loading = false;
            this.$store.dispatch("set_snackbar", {
              show: true,
              message: "Sorry. An error occured",
              type: "error"
            });
          });
      }
    },
    async fetchCreator() {
      await this.$store.dispatch("fetch_user", this.demand.user).then(user => {
        this.creator = user;
      });
    }
  },
  computed: {
    waitingMessage() {
      if (this.waiting) {
        if (this.demand.waiters_count > 1) {
          if (this.demand.waiters_count > 2) {
            return (
              "You and " +
              `${this.demand.waiters_count - 1}`.bold() +
              " other people are waiting for this list"
            );
          } else {
            return "You and 1 other person are waiting for this list";
          }
        } else {
          return "You are waiting for this list";
        }
      } else {
        if (this.demand.waiters_count === 1) {
          return "1".bold() + " person is waiting for this list";
        } else {
          return (
            `${this.demand.waiters_count}`.bold() +
            " people are waiting for this list"
          );
        }
      }
    },
    isCreator() {
      if (!this.$store.getters.authenticated) {
        return false;
      }
      return this.$store.getters.getUser.id === this.demand.user;
    },
    created() {
      return moment(this.demand.created.toDate()).fromNow();
    }
  },
  created() {
    this.fetchCreator().then(() => {
      this.fetched = true;
    });
  }
};
</script>
