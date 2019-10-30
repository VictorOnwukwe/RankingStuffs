<template>
  <div id="reply">
    <div id="container" v-if="fetched">
      <div>
        <v-avatar v-if="replier.profile_pic" size="2em" class="mr-2 ml-1">
          <img :src="replier.profile_pic.low" />
        </v-avatar>
        <v-icon v-else size="2em" class="mr-2 ml-1" color="purple" style>fa-user-circle</v-icon>
      </div>

      <div>
        <div class="py-1 px-2 br ml-2" style="position:relative;background-color:#F4F4F4;">
          <v-icon
            color="#F4F4F4"
            size="0.9em"
            style="transform:rotate(270deg);position:absolute;left:-0.8em;top:0.5em"
          >mdi-triangle</v-icon>
          <div
            v-if="replier!=={}"
            @click="showUser=true"
            class="brand--text text--darken-2 subtitle-2 font-weight-bold text-capitalize"
          >
            {{replier.username}}&nbsp;
            <span class="secondary-text-dark">{{created}}</span>
          </div>
          <div class style="white-space:pre-wrap">{{reply.content}}</div>
        </div>
        <v-layout class="mt-2 mb-1 ml-2">
          <div class="px-1" style="min-width:4.5em">
            <v-icon
              size="1.125em"
              class="action-icon"
              @click="toggleLike()"
              :class="liked ? 'blue--text' : null"
            >mdi-thumb-up</v-icon>
            <span v-if="reply.likes>0" style="margin:0 1em;">{{reply.likes}}</span>
          </div>
          <div style="min-width:3em">
            <v-icon @click="sendReply()" size="1em" class="action-icon">fa-reply</v-icon>
          </div>
        </v-layout>
      </div>
    </div>
    <v-dialog v-model="showUser" max-width="300px">
      <preview-user :id="replier.id" @close="showUser=false"></preview-user>
    </v-dialog>
  </div>
</template>

<script>
import { setTimeout } from "timers";
import swalErrors from "../../public/my-modules/swalErrors";

let moment = require("moment");
export default {
  props: {
    path: Object,
    reply: Object
  },

  data() {
    return {
      liked: false,
      showUser: false,
      replier: {},
      fetched: false
    };
  },

  methods: {
    toggleLike() {
      if (this.$store.getters.getAuthenticated) {
        let action;
        if (this.liked) {
          this.reply.likes--;
          action = "unlikeReply";
        } else {
          this.reply.likes++;
          action = "likeReply";
        }
        this.liked = !this.liked;

        this.$store.dispatch(action, {
          list_id: this.path.list_id,
          item_id: this.path.item_id,
          comment_id: this.path.comment_id,
          reply_id: this.reply.id
        });
      } else {
        swalErrors.showAuthenticationError();
      }
    },

    async fetchReplier() {
      await this.$store.dispatch("fetch_user", this.reply.user).then(user => {
        this.replier = user;
      });
    },

    async setLikedState() {
      if (!this.$store.getters.semiAuthenticated) {
        return;
      }
      await this.$store
        .dispatch("reply_liked", {
          reply_id: this.reply.id,
          ...this.path
        })
        .then(liked => {
          this.liked = liked;
        });
    },

    sendReply() {
      this.$emit("reply", this.replier.username);
    }
  },

  computed: {
    created() {
      let result = moment(this.reply.created.toDate()).fromNow();

      if (result.includes("second")) {
        return (
          (result[0] !== "a" ? result.slice(0, result.indexOf(" ")) : "1") + "s"
        );
      } else if (result.includes("minute")) {
        return (
          (result[0] !== "a" ? result.slice(0, result.indexOf(" ")) : "1") + "m"
        );
      } else if (result.includes("hour")) {
        return (
          (result[0] !== "a" ? result.slice(0, result.indexOf(" ")) : "1") + "h"
        );
      } else if (result.includes("day")) {
        return (
          (result[0] !== "a" ? result.slice(0, result.indexOf(" ")) : "1") + "d"
        );
      } else if (result.includes("week")) {
        return (
          (result[0] !== "a" ? result.slice(0, result.indexOf(" ")) : "1") + "w"
        );
      } else if (result.includes("month")) {
        return (
          (result[0] !== "a" ? result.slice(0, result.indexOf(" ")) : "1") +
          "mo"
        );
      } else if (result.includes("year")) {
        return (
          (result[0] !== "a" ? result.slice(0, result.indexOf(" ")) : "1") + "y"
        );
      } else {
        return "null";
      }
    }
  },

  mounted: function() {
    Promise.all([this.fetchReplier(), this.setLikedState()]).then(() => {
      this.fetched = true;
    });
  }
};
</script>

<style scoped>
#reply {
  padding: 0.3em;
}
#reply:hover {
  /* background-color: hsl(207, 90%, 95%); */
  /* background-color: #f5f5f5; */
}
#container {
  display: flex;
}
</style>
