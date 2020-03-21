<template>
  <div id="reply">
    <div id="container">
      <div>
        <v-divider class="grey lighten-4 my-1"></v-divider>
      </div>
      <v-layout align-center>
        <v-flex class="pl-2">
          <div style="font-size:1em" class="ptd pre-wrap roboto spacious">{{ !more ? reply.content.slice(0, 600) : reply.content
            }}{{ reply.content.length > 600 ? "..." : " "
            }}<span
              @click="more = !more"
              v-if="reply.content.length > 600"
              class="link--text"
              style="cursor:pointer"
              >{{ !more ? "more" : "less" }}</span
            ><span v-if="!reply.user.username.includes('visitor')">-&nbsp;</span><username :user="reply.user"></username>
          </div>
          <v-layout class="mt-5 mb-1" align-center>
            <div class="std" style="display:flex; min-width:3em;">
              {{ created }}
            </div>
                <div v-if="reply.likes" style="display:flex; min-width:4.5em;" class="std">
                  {{reply.likes}} {{ reply.likes > 1 ? "likes" : "like" }}
                </div>

            <div
              style="display:flex; min-width:4.5em;"
              class="pointer"
              @click="sendReply()"
            >
              <v-icon
                style="cursor:pointer"
                class="action-icon grey--text"
                size="1.2em"
                >mdi-reply</v-icon
              >
            </div>
            <div>
              <v-menu right>
                <template v-slot:activator="{ on }">
                  <v-icon
                    v-on="on"
                    @click="setLiked()"
                    size="1.2em"
                    style="margin-top:-0.15em"
                    >mdi-dots-horizontal</v-icon
                  >
                </template>
                <v-list class="pa-0">
                  <v-list-item class="" @click="toggleLike()">
                    <v-layout class="py-2" justify-center>
                      <v-icon
                        v-if="liked !== undefined"
                        :color="liked ? 'brand' : null"
                        >fa-thumbs-up</v-icon
                      >
                      <m-progress v-else></m-progress>
                    </v-layout>
                  </v-list-item>
                  <v-list-item
                    @click="(showEdit = true), (newReply = reply.content)"
                    v-if="isReplier"
                    class="tile"
                  >
                    <v-layout class="py-2" justify-center>
                      <v-icon>fa-pencil-alt</v-icon>
                    </v-layout>
                  </v-list-item>
                  <v-list-item @click="showFlag = true" class="tile">
                    <v-layout class="py-2" justify-center>
                      <v-icon>fa-flag</v-icon>
                    </v-layout>
                  </v-list-item>
                  <v-list-item
                    @click="showDelete = true"
                    v-if="isReplier"
                    class="tile"
                  >
                    <v-layout class="py-2" justify-center>
                      <v-icon>fa-times</v-icon>
                    </v-layout>
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
          class="brand lighten-2 white--text"
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
          <m-btn
            :loading="editing"
            @click="editReply()"
            :disabled="newReply.trim() == '' || newReply == reply.content"
            >Edit</m-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <flag-comment
      v-if="showFlag"
      :type="'reply'"
      :path="{
        list_id: list.id,
        item_id: item.id,
        comment_id: comment.id,
        reply_id: reply.id
      }"
      :flaggedItem="reply"
      @close="showFlag = false"
      @success="flagSuccess()"
    ></flag-comment>
    <v-dialog v-model="showDelete" max-width="500px">
      <v-card>
        <v-card-title class="brand--text">Delete Reply</v-card-title>
        <v-card-text class="ptd"
          >Are you sure you want to delete this reply?</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <m-btn text @click="showDelete = false">Cancel</m-btn>
          <m-btn text :loading="deleting" @click="deleteReply()">Delete</m-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="successful">
      {{ successMessage }}
      <v-spacer></v-spacer>
      <m-btn text @click="successful = false">OK</m-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { setTimeout } from "timers";
import swalErrors from "../../public/my-modules/swalErrors";
import FlagComment from "./FlagComment";

let moment = require("moment");
export default {
  components: {
    FlagComment
  },
  props: {
    list: Object,
    item: Object,
    comment: Object,
    reply: Object,
    index: Number
  },

  data() {
    return {
      liked: undefined,
      showUser: false,
      more: false,
      showEdit: false,
      newReply: "",
      editing: false,
      showFlag: false,
      showDelete: false,
      deleting: false,
      successful: false,
      successMessage: ""
    };
  },

  methods: {
    toggleLike() {
      let action;
      if (this.liked == undefined) {
        return;
      }
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

    flagSuccess() {
      this.successMessage = "Reply Flagged Successfully.";
      this.successful = true;
      this.showFlag = false;
    },

    async setLiked() {
      if (!this.$store.getters.semiAuthenticated) {
        this.liked = false;
      } else if (this.liked !== undefined) {
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
        }).catch(_ => {
          this.$store.dispatch("setSnackbar", {show: true,
            message: "sorry. An error occured",
            type: "error"})
            this.editing = false;
        })
    },
    deleteReply() {
      this.deleting = true;
      this.$store
        .dispatch("delete_reply", {
          reply_id: this.reply.id,
          list_id: this.list.id,
          item_id: this.item.id,
          comment_id: this.comment.id
        })
        .then(() => {
          this.deleting = false;
          this.$emit("delete", this.index);
        }).catch(_ => {
          this.deleting = false;
        })
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
      if (!this.$store.getters.authenticated) {
        return false;
      }
      return this.reply.user.id == this.$store.getters.getUser.id;
    }
  }
};
</script>
