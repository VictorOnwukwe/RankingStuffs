<template>
  <v-list-item class="pr-0">
    <v-list-item-content>
      <v-list-item-title wrap class="text-capitalize brand--text">{{demand.title}}</v-list-item-title>
      <v-list-item-subtitle>{{created}}</v-list-item-subtitle>
      <v-list-item-subtitle class="primary-text-dark" v-html="waitingMessage"></v-list-item-subtitle>
      <v-list-item-subtitle>
        <v-layout>
          <v-spacer></v-spacer>
          <v-hover v-slot:default="{ hover }">
            <v-list-item-action-text
              class="subtitle-2 pink--text pointer"
              @click="toggleWaiting()"
              v-if="!isProfile"
            >{{!waiting ? 'Queue' : hover ? 'Leave' : 'Queueing' }}</v-list-item-action-text>
          </v-hover>
          <v-list-item-action-text
            class="subtitle-2 green--text ml-4 pointer"
            @click="createDemand"
          >Create</v-list-item-action-text>
        </v-layout>
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
let moment = require("moment");
export default {
  props: {
    demand: Object,
    isProfile: Boolean,
    user: Object
  },
  data() {
    return {
      waiting: false
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
      if (this.waiting) {
        this.$store.dispatch("leave_demanders", this.demand.id).then(() => {
          this.demand.waiters_count--;
          this.waiting = false;
        });
      } else {
        this.$store.dispatch("join_demanders", this.demand.id).then(() => {
          this.demand.waiters_count++;
          this.waiting = true;
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
              (this.demand.waiters_count -
              1) +
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
                (this.demand.waiters_count -
                1) +
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
    }
  },
  mounted() {
    this.fetchWaiting();
  }
};
</script>