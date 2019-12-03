<template>
  <div id="reply">
    <div id="container">
      <div>
        <v-divider class="grey lighten-4 my-1"></v-divider>
      </div>
      <v-layout>
        <v-flex class="pl-2">
          <div style="white-space:pre-wrap;" class="ptd">{{ !more ? reply.content.slice(0, 600) : reply.content
            }}{{ reply.content.length > 600 ? "..." : " "
            }}<span
              @click="more = !more"
              v-if="reply.content.length > 600"
              class="link--text"
              style="cursor:pointer"
              >{{ !more ? "more" : "less" }}</span
            ><span
              v-if="reply.content.length <= 600 || more"
              class="brand--text text--darken-1 pointer"
              @click="
                reply.user.username.includes('visitor')
                  ? null
                  : (showUser = true)
              "
              >-&nbsp;{{
                reply.user.username.includes("visitor")
                  ? "visitor"
                  : reply.user.username
              }}</span
            >
          </div>
          <v-layout class="mt-2 mb-1" align-center>
            <div class="std" style="display:flex; min-width:4.5em;">
              {{ created }}
            </div>
            <div style="display:flex; min-width:4.5em;">
              <v-icon
                class="like-button action-icon"
                @click="toggleLike()"
                :color="liked ? 'blue' : null"
                size="1.2em"
                >mdi-thumb-up</v-icon
              >
              <span
                v-if="reply.likes > 0"
                class="grey--text text--darken-2"
                style="margin:-0.1em 0 0 0.3em; font-size:0.9em"
                >{{ reply.likes }}</span
              >
            </div>

            <div
              style="display:flex; min-width:4.5em;"
              class="pointer"
              @click="sendReply()"
            >
              <v-icon style="cursor:pointer" class="action-icon" size="1.2em"
                >mdi-reply</v-icon
              >
            </div>
            <div>
              <v-menu left>
                <template v-slot:activator="{ on }">
                  <v-icon v-on="on" size="1.2em" style="margin-top:-0.15em"
                    >mdi-dots-vertical</v-icon
                  >
                </template>
                <v-list class="px-0">
                  <v-list-item
                    @click="(showEdit = true), (newReply = reply.content)"
                    v-if="isReplier"
                    class="tile"
                  >
                    <v-layout class="py-2" justify-center>
                      <v-icon>fa-pencil-alt</v-icon>
                    </v-layout>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>fa-flag</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </v-layout>
        </v-flex>
        <!-- <v-flex shrink>
          
        </v-flex> -->
      </v-layout>
    </div>
    <v-dialog v-model="showUser" max-width="400px">
      <preview-user
        :id="reply.user.id"
        @close="showUser = false"
      ></preview-user>
    </v-dialog>

    <v-dialog persistent v-model="showEdit" max-width="500px">
      <v-card flat class="grey lighten-3">
        <v-card-title
          class="grey lighten-2"
          style="position:sticky;top:0;z-index:2;border-bottom:1px solid black"
        >
          Edit Reply
          <v-spacer></v-spacer>
          <v-icon class="close" @click="showEdit = false">mdi-close</v-icon>
        </v-card-title>
        <v-card-text class="pb-0 pt-4">
          <v-textarea
            auto-grow
            no-resize
            flat
            v-model="newReply"
            solo
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn
            :loading="editing"
            color="brand white--text"
            @click="editReply()"
            :disabled="newReply == '' || newReply == reply.content"
            >Edit</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { setTimeout } from "timers";
import swalErrors from "../../public/my-modules/swalErrors";

let moment = require("moment");
export default {
  props: {
    list: Object,
    item: Object,
    comment: Object,
    reply: Object
  },

  data() {
    return {
      liked: false,
      showUser: false,
      more: false,
      showEdit: false,
      newReply: "",
      editing: false
    };
  },

  methods: {
    toggleLike() {
      let action;
      if (this.liked) {
        this.reply.likes--;
        action = "unlikeReply";
      } else {
        this.reply.likes == null ? (this.reply.likes = 1) : this.reply.likes++;
        action = "likeReply";
      }
      this.liked = !this.liked;

      this.$store.dispatch(action, {
        list_id: this.list.id,
        item_id: this.item.id,
        comment_id: this.comment.id,
        reply_id: this.reply.id
      });
    },

    async setLiked() {
      if (!this.$store.getters.semiAuthenticated) {
        return;
      }
      await this.$store
        .dispatch("reply_liked", {
          reply_id: this.reply.id,
          list_id: this.list.id,
          item_id: this.item.id,
          comment_id: this.comment.id
        })
        .then(liked => {
          this.liked = liked;
        });
    },

    sendReply() {
      this.$emit("reply", this.reply.user.username);
    },
    editReply() {
      this.editing = true;
      this.$store
        .dispatch("edit_reply", {
          list_id: this.list.id,
          item_id: this.item.id,
          comment_id: this.comment.id,
          reply_id: this.reply.id,
          newReply: this.newReply
        })
        .then(() => {
          this.editing = false;
          this.showEdit = false;
          this.reply.content = this.newReply;
        });
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
    },
    isReplier() {
      return this.reply.user.id == this.$store.getters.getUser.id;
    }
  },

  created() {
    this.setLiked();
  }
};
</script>

<style scoped>
#reply {
  /* padding: 0.3em; */
}
#reply:hover {
  /* background-color: hsl(207, 90%, 95%); */
  /* background-color: #f5f5f5; */
}
#container {
  /* display: flex; */
}
</style>
