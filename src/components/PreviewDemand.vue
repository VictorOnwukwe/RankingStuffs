<template>
  <div class="main">
    <v-hover v-slot:default="{ hover }">
      <v-card
        :min-height="random(120, 60)"
        :class="{ loading: !fetched }"
        width="100%"
        class="card"
      >
        <div v-if="fetched">
          <v-card-title class style>
            <v-layout column>
              <v-layout align-start>
                <v-flex>
                  <router-link
                    :to="'/demands/' + demand.id"
                    class="ptd text-capitalize no-deco font-weight-bold"
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
                      <v-icon
                        @click="setWaiting()"
                        class="ml-2"
                        color=""
                        v-on="on"
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
              <div style="clear:both"></div>
              <div class="subtitle-1 ptd">
                <span class="std">{{ created }}</span>
                <span class="std"
                  >,
                  <span class="font-weight-bold">{{
                    demand.waiters_count
                  }}</span>
                  {{ demand.waiters_count > 1 ? "people" : "person" }}
                  waiting</span
                >
              </div>
            </v-layout>
          </v-card-title>
          <v-card-text class="subtitle-1 pt-1 pb-0">
            <v-layout v-if="creator">
              <v-avatar size="2em" class="mr-2" style="border-radius:5px">
                <img
                  v-if="creator.profile_pic"
                  :src="creator.profile_pic.low"
                />
                <img v-else :src="require('../assets/nophoto.jpg')" alt="" />
              </v-avatar>
              <username :user="creator"></username>
            </v-layout>
            <p style="white-space:pre-wrap" class="ptd mt-2">{{ demand.comment }}</p>
          </v-card-text>
        </div>
      </v-card>
    </v-hover>
    <v-dialog v-if="creator" v-model="showUser" max-width="400px">
      <preview-user :id="creator.id" @close="showUser = false"></preview-user>
    </v-dialog>
  </div>
</template>

<script>
let moment = require("moment");
export default {
  props: {
    demand: Object
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
      this.loading = true;
      if (this.waiting) {
        this.$store
          .dispatch("leave_demanders", this.demand)
          .then(() => {
            this.demand.waiters_count--;
            this.waiting = false;
            this.loading = false;
          })
          .catch(error => {
            console.log(error);
            this.loading = false;
          });
      } else {
        this.$store
          .dispatch("join_demanders", this.demand)
          .then(() => {
            this.demand.waiters_count++;
            this.waiting = true;
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            console.log(error);
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
      return moment(this.demand.created.toDate()).calendar();
    }
  },
  created() {
    this.fetchCreator().then(() => {
      this.fetched = true;
    });
  }
};
</script>

<style scoped>
@import url("../../public/my-modules/animations.css");
.main {
  display: flex;
}
.card {
  transition: all 0.3s ease-in-out;
}
.clear {
  clear: both;
}
</style>
