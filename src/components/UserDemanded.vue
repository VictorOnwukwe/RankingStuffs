<template>
  <v-list-item class="pl-2 pr-0">
    <v-list-item-content>
      <v-list-item-title
        class="text-capitalize text-wrap"
        :class="!searched ? 'link--text' : null"
        :style="{ fontSize: fontSize }"
        >{{ demand.title }}</v-list-item-title
      >
      <v-list-item-subtitle
        v-if="!searched"
        class="ptd"
        v-html="waitingMessage"
      ></v-list-item-subtitle>
      <v-list-item-subtitle v-if="!searched">{{
        created
      }}</v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
        <v-menu left class="mt-n4">
          <template v-slot:activator="{ on }">
            <v-icon @click color="grey" v-on="on">mdi-dots-vertical</v-icon>
          </template>
          <v-list class="pa-0">
            <v-list-item @click="createDemand" class="tile">
              <v-icon>fa-plus</v-icon>
            </v-list-item>
            <v-list-item v-if="!isCreator" @click="toggleWaiting()" class="tile">
              <v-icon :color="waiting ? 'green' : null">fa-hand-holding</v-icon>
            </v-list-item>
          </v-list>
        </v-menu>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
let moment = require("moment");
export default {
  props: {
    demand: Object,
    user: Object,
    searched: {
      type: Boolean,
      default: false
    },
    isProfile: Boolean
  },
  data() {
    return {
      waiting: false,
      loading: false
    };
  },
  methods: {
    createDemand() {
      this.$router.push({
        path: "/create",
        query: { demanded: true, id: this.demand.id, title: this.demand.title }
      });
    },
    toggleWaiting() {
      this.loading = true;
      if (this.waiting) {
        this.$store
          .dispatch("leave_demanders", this.demand.id)
          .then(() => {
            this.demand.waiters_count--;
            this.waiting = false;
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
          });
      } else {
        this.$store
          .dispatch("join_demanders", this.demand.id)
          .then(() => {
            this.demand.waiters_count++;
            this.waiting = true;
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
          });
      }
    },
    async fetchWaiting() {
      if (this.isProfile) {
        this.waiting = true;
      } else {
        this.waiting = await this.$store.dispatch(
          "checkWaiting",
          this.demand.id
        );
      }
    }
  },
  computed: {
    waitingMessage() {
      if (this.demand.waiters_count > 1) {
        if (this.demand.waiters_count > 2) {
          if (this.isProfile) {
            return (
              "<b>" +
              (this.demand.waiters_count - 1) +
              "</b> other people are waiting for this list"
            );
          } else {
            if (this.waiting) {
              if (this.demand.waiters_count == 3) {
                return "You and <b>1</b> other person are also waiting for this list";
              } else {
                return (
                  "You and <b>" +
                  (this.demand.waiters_count - 2) +
                  "</b> other people are also waiting for this list"
                );
              }
            } else {
              return (
                "<b>" +
                (this.demand.waiters_count - 1) +
                "</b> other people are waiting for this list"
              );
            }
          }
        } else {
          if (this.isProfile) {
            return "<b>1</b> other person is waiting for this list";
          } else {
            if (this.waiting) {
              return "You are also waiting for this list";
            } else {
              return "<b>1</b> other person is waiting for this list";
            }
          }
        }
      } else {
        if (this.isProfile) {
          return "Only you are waiting for this list";
        } else {
          return `Only ${this.user.username} is waiting for this list`;
        }
      }
    },
    created() {
      return moment(this.demand.created.toDate()).calendar();
    },
    isCreator() {
      return this.$store.getters.getUser.id === this.demand.user;
    },
    fontSize() {
      return this.$vuetify.breakpoint.xs ? "1.3em" : "1.5em";
    }
  },
  mounted() {
    this.fetchWaiting();
  }
};
</script>
