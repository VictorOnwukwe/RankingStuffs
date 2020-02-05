<template>
  <v-list-item class="pl-2 pr-0">
    <v-list-item-content>
      <v-list-item-title
        class="text-capitalize text-wrap"
        :style="{ fontSize: fontSize }"
      >
        <router-link :to="'/demands/' + demand.id" class="no-deco link--text">
          {{ demand.title }}</router-link
        ></v-list-item-title
      >
      <v-list-item-subtitle class="ptd"
        >{{ demand.waiters_count }}
        {{ demand.waiters_count < 2 ? " person" : " people" }} waiting for this
        list</v-list-item-subtitle
      >
      <v-list-item-subtitle>{{ created }}</v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-menu
        :close-on-content-click="false"
        min-width="90px"
        max-width="90px"
        left
        class="mt-n4"
      >
        <template v-slot:activator="{ on }">
          <v-icon
            @click.stop="fetchWaiting()"
            class="mr-2"
            color="grey"
            v-on="on"
            >mdi-dots-vertical</v-icon
          >
        </template>
        <v-list class="pa-0">
          <v-list-item @click="createDemand" class="pt-2 tile">
            <v-layout column align-center>
              <v-icon>$vuetify.icons.create</v-icon>
              <span class="caption std">Create</span>
            </v-layout>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item v-if="!isCreator" @click="toggleWaiting()" class="tile">
            <v-layout justify-center v-if="loading || waiting == undefined">
              <m-progress></m-progress>
            </v-layout>
            <v-layout v-else column align-center>
              <v-icon :color="waiting ? 'accent' : null">{{
                waiting
                  ? "$vuetify.icons.leaveQueue"
                  : "$vuetify.icons.joinQueue"
              }}</v-icon>
              <span class="caption" :class="waiting ? 'accent--text' : 'std'">{{
                waiting ? "Queueing" : "Queue"
              }}</span>
            </v-layout>
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
      waiting: undefined,
      loading: false,
      checked: false
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
      if (!this.authenticated) {
        this.$store.dispatch("set_login", true);
        return;
      }
      if (this.waiting == undefined) {
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
    async fetchWaiting() {
      if (this.checked || this.isProfile) {
        return;
      }
      this.checked = true;
      this.waiting = await this.$store.dispatch("checkWaiting", this.demand.id);
    }
  },
  computed: {
    waitingMessage() {
      return this.demand.waiters_count + " people waiting for this list";
      // if (this.demand.waiters_count > 1) {
      //   if (this.demand.waiters_count > 2) {
      //     if (this.isProfile) {
      //       return (
      //         "<b>" +
      //         (this.demand.waiters_count - 1) +
      //         "</b> other people are waiting for this list"
      //       );
      //     } else {
      //       if (this.waiting) {
      //         if (this.demand.waiters_count == 3) {
      //           return "You and <b>1</b> other person are also waiting for this list";
      //         } else {
      //           return (
      //             "You and <b>" +
      //             (this.demand.waiters_count - 2) +
      //             "</b> other people are also waiting for this list"
      //           );
      //         }
      //       } else {
      //         return (
      //           "<b>" +
      //           (this.demand.waiters_count - 1) +
      //           "</b> other people are waiting for this list"
      //         );
      //       }
      //     }
      //   } else {
      //     if (this.isProfile) {
      //       return "<b>1</b> other person is waiting for this list";
      //     } else {
      //       if (this.waiting) {
      //         return "You are also waiting for this list";
      //       } else {
      //         return "<b>1</b> other person is waiting for this list";
      //       }
      //     }
      //   }
      // } else {
      //   if (this.isProfile) {
      //     return "Only you are waiting for this list";
      //   } else {
      //     return `Only ${this.user.username} is waiting for this list`;
      //   }
      // }
    },
    created() {
      return moment(this.demand.created.toDate()).calendar();
    },
    isCreator() {
      return this.$store.getters.getUser.id === this.demand.user;
    },
    fontSize() {
      return this.$vuetify.breakpoint.xs ? "1.2em" : "1.3em";
    },
    authenticated() {
      return this.$store.getters.authenticated;
    }
  }
};
</script>
<style scoped>
*>*{
  line-height: 1.6em !important;
}
</style>
