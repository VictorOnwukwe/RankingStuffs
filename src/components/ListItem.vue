<template>
  <div id="main">
    <v-layout mt-2>
      <v-card class="primary" tile width="100%">
        <v-card-title class="pl-2 py-2 top-bar">
          <v-layout align-center>
            <v-flex shrink mr-2>
              <v-card
                flat
                elevation="10"
                :class="{'golden': index === 1, 'silver': index === 2, 'bronze': index === 3, 'plain': index > 3}"
                class="numeric-box"
                style="font-size:0.7em"
              >
                <span>{{index}}</span>
              </v-card>
            </v-flex>
            <v-flex>
              <h4
                class="title font-weight-bold"
                style="border-radius:.5em; line-height:1.1;margin-top:0em; cursor:pointer;"
                @click="goItem()"
              >{{item.name}}</h4>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex shrink class="">
                <v-icon v-if="!voted" class="primary-text-light">mdi-camera</v-icon>
                <v-layout
                  class=""
                  style="width:2.4375em; border-radius:.3em"
                  v-else
                  justify-center
                  elevation-3
                >
                <h4 style="font-weight:bold;display:inline-block;color:#E2E8F7">{{votePercentage()}}%</h4>
                </v-layout>
            </v-flex>
          </v-layout>
        </v-card-title>
        <v-layout wrap>
          <v-flex xs12 sm4 xl3>
            <v-card tile class="pr-0 primary" flat height="100%" min-height="2.7em" style>
              <v-layout v-if="item.about || item.image" column>
                <v-flex>
                  <v-card-text>
                    <v-img
                      v-model="info.image"
                      :src="info.image"
                      cover
                      width="100%"
                      class="mb-2"
                      style="border-radius:4px"
                      aspect-ratio="1.3"
                    ></v-img>
                    <div v-if="info.about" class="grey--text">
                      {{windowSmall? info.about.slice(0,250) : info.about.slice(0,150)}}
                      <div v-if="windowSmall">
                        <span v-if="info.about.length>250" class="brand--text">...read more</span>
                      </div>
                      <div v-else>
                        <span v-if="info.about.length>150" class="brand--text">...read more</span>
                      </div>
                    </div>
                  </v-card-text>
                </v-flex>
              </v-layout>
              <div style="position:absolute; bottom:0.5em; width:100%">
                <v-layout justify-center>
                  <v-flex>
                    <v-layout justify-center>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-icon color="grey darken-1" v-on="on">mdi-eye-circle</v-icon>
                        </template>
                        <span class="white--text">View Item</span>
                      </v-tooltip>
                    </v-layout>
                  </v-flex>
                  <v-flex>
                    <v-layout justify-center>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-icon v-on="on" color="grey darken-1">favorite</v-icon>
                        </template>
                        <span class="white--text">Add Item to Favorites</span>
                      </v-tooltip>
                    </v-layout>
                  </v-flex>
                  <v-flex>
                    <v-layout justify-center>
                      <v-tooltip bottom>
                        <template v-slot:activator="{on}">
                          <v-icon color="grey darken-1" v-on="on">add</v-icon>
                        </template>
                        <span>Follow Item</span>
                      </v-tooltip>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </div>
            </v-card>
          </v-flex>
          <v-flex xs12 sm8 xl9 id="comment-border">
            <v-divider class="hidden-sm-and-up"></v-divider>
            <v-card tile flat height="100%" class="primary">
              <v-card-text style="margin-bottom: 10em" class>
                <v-card class="subtitle-1 primary" flat tile v-if="comments.length == 0">Be the first to comment...</v-card>
                <v-card class="primary" flat tile v-else>
                  <div v-for="(comment, index) in comments" :key="index">
                    <comment id="comment" :comment="comment" :list="list" :item="item"></comment>
                    <v-divider v-if="comments.length>1"></v-divider>
                  </div>
                </v-card>
                <!-- <p v-for="n in 12">good</p> -->
              </v-card-text>
              <div style="width:100%; position:absolute; bottom:0; background-color:white">
                <v-card-actions class="primary">
                  <v-layout>
                    <v-flex xs10 offset-xs-1>
                      <v-layout class align-center>
                        <v-flex>
                          <v-layout>
                            <v-textarea outlined rows="1"></v-textarea>
                          </v-layout>
                        </v-flex>
                        <v-flex shrink>
                          <v-layout align-content-end>
                            <v-icon>comment</v-icon>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-card-actions>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
import comment from "./comment";
import swalErrors from "../../public/my-modules/swalErrors";
import { setTimeout } from 'timers';

export default {
  components: {
    comment
  },
  props: {
    item: Object,
    list: Object,
    index: Number,
    voted: Boolean
  },
  data() {
    return {
      user_comment: "",
      comments: [],
      display_comments: true,
      loading: false,
      commentHeight: null,
      autoGrow: true,
      Rows: 1,
      info: {
        about: "",
        image: ""
      }
    };
  },

  methods: {
    async addComment() {
      if (this.$store.state.authenticated) {
        await this.$store
          .dispatch("upload_comment", {
            item_id: this.item.id,
            list_id: this.list.id,
            comment: this.user_comment
          })
          .then(comment => {
            this.comments.push(comment);
          });
      } else {
        swalErrors.showAuthenticationError();
      }

      this.user_comment = "";
    },

    checkGrow() {
      console.log(document.querySelector("#comment-reply").scrollHeight > 100);
      if (document.querySelector("#comment-reply").scrollHeight > 100) {
        setTimeout(() => {
          {
            this.autoGrow = false;
          }
        }, 500);
      }
    },

    vote() {
      if (this.$store.state.authenticated) {
        if (this.voted) {
          this.$store.dispatch("remove_vote", {
            item_id: this.item.id,
            list_id: this.list.id
          });
        } else {
          this.$store.dispatch("add_vote", {
            item_id: this.item.id,
            list_id: this.list.id
          });
        }
      } else {
        swalErrors.showAuthenticationError();
      }

      setTimeout(() => {
        this.checkVote();
        console.log(this.voted);
      }, 1000);
    },

    votePercentage() {
      return Math.round((this.item.vote_count / this.list.vote_count) * 100);
    },

    async fetchComments(num, lastTimestamp) {
      this.loading = true;
      return await this.$store
        .dispatch("fetch_comments", {
          item_id: this.item.id,
          list_id: this.list.id,
          num: num,
          timestamp: lastTimestamp
        })
        .then(comments => {
          for (let i = 0; i < comments.length; i++) {
            //make first created comment appear first
            this.comments.unshift(comments[i]);
          }
          this.loading = false;
        })
        .catch(error => {
          console.log("Error: ", error);
          this.loading = false;
        });
    },

    goItem(){
      this.$router.push({path: "/items/" + this.item.name, query: {
        item: this.info
      }});
    },

    async fetchInfo(){
      this.$store.dispatch("fetch_item", this.item.info).then(info => {
            this.info = info;
      })
    }
  },

  computed: {
    windowSmall() {
      return screen.width < 600;
    },
    checkHeight() {
      setTimeout(() => {
        return document.getElementById("comment-reply").scrollHeight < 130;
      }, 3000);
    }
  },

  watch: {
    'info'(){
      
    }
  },

  mounted: function() {
    this.fetchComments(5, "now");
    this.fetchInfo();
  }
};
</script>

<style scoped>
#comments {
  background-color: white;
  padding: 1em 1em;
}

@media (min-width: 600px) {
  #comment-border {
    border-left: 1px solid lightgray;
  }
}

.text-ellipsis {
  display: block;
  display: -webkit-box;
  height: 80px;
  margin: 0 auto;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

#comment_box {
  width: 100%;
  background-color: var(--primary);
}

#bottom-nav {
  width: 100%;
  background-color: brown;
  height: 3em;
  display: flex;
  justify-content: center;
}

.clear-float {
  clear: both;
}

.comments-header {
  display: block;
  margin-bottom: 3em;
}

.image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.comment-box.v-text-field--outlined > .v-input__control > .v-input__slot {
  min-height: 0px;
}
.comment-box .v-input__control {
  /* background-color: lightblue; */
}
.comment-box .v-text-field__details {
  flex: 0;
  min-height: 0;
}
.comment-box .v-messages {
  min-height: 0;
}

.comment-box.v-text-field.v-text-field--enclosed .v-text-field__details {
  margin-bottom: 0;
}
</style>
