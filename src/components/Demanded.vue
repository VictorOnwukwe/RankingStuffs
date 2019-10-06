<template>
  <div class="main">
    <v-hover v-slot:default="{ hover }">
      <v-card :min-height="random(120, 60)" :class="!fetched ? 'loading' : null" tile :elevation="hover ? 4 : 1">
        <v-layout v-if="fetched">
          <v-flex>
            <div>
              <v-card-title class style>
                <v-layout column>
                  <h2 class="title text-capitalize brand--text" style="font-weight:normal">{{demand.title}}</h2>
                  <div class="subtitle-2 primary-text-dark mt-2" v-html="waitingMessage"></div>
                </v-layout>
              </v-card-title>
              <v-card-text style="margin-bottom:1.5em" class="subtitle-1">
                <div v-if="creator && !demand.anonymous">
                  <v-avatar size="2em" class="mr-2 mb-2">
                    <v-img :src="creator.profile_pic"></v-img>
                  </v-avatar>
                  <a
                    class="secondary-text-dark font-weight-bold"
                    @click="showUser = true"
                  >{{creator.username}}</a>
                </div>
                <p style="white-space:pre-wrap" class="secondary-text-dark">{{demand.comment}}</p>
              </v-card-text>
              <v-layout v-if="hover" style="position:absolute; bottom:16px; right:16px">
                <v-hover v-slot:default="{ hover }">
                  <v-btn
                    @click="toggleWaiting()"
                    class="pointer"
                    small
                    :loading="loading"
                    color="brand"
                    outlined
                  >{{!waiting ? 'Queue' : hover ? 'Leave' : 'Queueing' }}</v-btn>
                </v-hover>
                <!-- <v-btn v-else small color="brand" outlined>Queueing</v-btn> -->
                <v-btn @click="create()" class="pointer ml-2" depressed color="brand white--text" small>Create</v-btn>
              </v-layout>
            </div>
          </v-flex>
        </v-layout>
      </v-card>
    </v-hover>
    <v-dialog v-if="creator" v-model="showUser" max-width="300px">
      <preview-user :id="creator.id" @close="showUser = false"></preview-user>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    demand: Object
  },
  data() {
    return {
      waiting: false,
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
      await this.$store.dispatch("checkWaiting", this.demand.id).then(result => {
        this.waiting = result;
      });
    },
    toggleWaiting() {
      this.loading = true;
      if (this.waiting) {
        this.$store.dispatch("leave_demanders", this.demand.id).then(() => {
          this.demand.waiters_count--;
          this.waiting = false;
          this.loading = false;
        });
      } else {
        this.$store.dispatch("join_demanders", this.demand.id).then(() => {
          this.demand.waiters_count++;
          this.waiting = true;
          this.loading = false;
        });
      }
    },
    async fetchCreator() {
      if(this.demand.anonymous){
        return;
      }
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
              `${(this.demand.waiters_count - 1)}`.bold() +
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
            `${this.demand.waiters_count}`.bold() + " people are waiting for this list"
          );
        }
      }
    }
  },
  created() {
    Promise.all([this.setWaiting(), this.fetchCreator()]).then(() => {
      this.fetched = true;
    })
  }
};
</script>

<style scoped>
@import url("../../public/my-modules/animations.css");
</style>