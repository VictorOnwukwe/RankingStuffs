<template>
  <v-card flat :min-height="random(120, 60)" class="main">
    <v-hover v-slot:default="{ hover }">
      <v-card :class="{ loading: !fetched }" width="100%">
        <v-card-text v-if="fetched" class="pa-3">
          <v-layout>
            <v-flex shrink pr-2>
              <m-img
                :src="list.preview_image ? list.preview_image.url.low : false"
                :minWidth="'100px'"
                :maxWidth="'130px'"
                :width="sub ? '10vw' : '20vw'"
                :aspectRatio="'1'"
              ></m-img>
            </v-flex>
            <v-flex>
              <v-card height="100%" flat>
                <v-card-title class="pa-0">
                  <router-link
                    :to="'/lists/' + list.id"
                    class="text-capitalize no-deco brighten-1"
                    :class="{ 'font-weight-bold ptd': !sub, 'link--text': sub }"
                    style="font-size:0.8em"
                    @click="goList()"
                  >
                    {{ list.title }}
                  </router-link>
                </v-card-title>
                <div class="pa-0" v-if="!sub">
                  <rating
                    :rating="list.rating"
                    :ratersCount="list.raters_count"
                  ></rating>
                  <v-layout>
                    <div>
                      <span class="ptd font-weight-medium">
                        {{ list.votes }}</span
                      >
                      <span class="std">&nbsp;votes,&nbsp;</span>
                    </div>
                    <div>
                      <span class="ptd font-weight-medium">{{
                        list.item_count
                      }}</span>
                      <span class="std">&nbsp;items</span>
                    </div>
                  </v-layout>
                  <v-layout v-if="!list.description && !sub" class="mt-2">
                    <v-flex shrink class="mr-1">
                      <v-avatar tile size="1.8em" style="border-radius:5px">
                        <v-img
                          v-if="user.profile_pic"
                          :src="user.profile_pic.low"
                        ></v-img>
                        <v-img
                          v-else
                          :src="require('../assets/nophoto.jpg')"
                        ></v-img>
                      </v-avatar>
                    </v-flex>
                    <v-flex shrink>
                      <username :user="user"></username>
                    </v-flex>
                  </v-layout>
                </div>
              </v-card>
            </v-flex>
          </v-layout>
          <div v-if="list.description && !sub" class="mt-3">
            <v-layout class="mt-2">
              <v-flex shrink>
                <v-avatar size="1.8em" style="border-radius:5px">
                  <img v-if="user.profile_pic" :src="user.profile_pic.low" />
                  <img v-else :src="require('../assets/nophoto.jpg')" />
                </v-avatar>
              </v-flex>
              <v-flex shrink>
                <a
                  @click.stop="showUser = true"
                  class="subtitle-1 brand--text font-weight- ml-2"
                  >{{ user.username }}</a
                ></v-flex
              >
            </v-layout>
            <div v-if="list.description" class="ptd">
              {{ !more ? list.description.slice(0, 200) : list.description }}
              <span
                @click="more = !more"
                class="link--text pointer"
                v-if="list.description.length > 200"
                >...{{ !more ? "see more" : "see less" }}</span
              >
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-hover>

    <v-dialog v-if="list.user" v-model="showUser" max-width="400px">
      <preview-user @close="showUser = false" :id="user.id"></preview-user>
    </v-dialog>
  </v-card>
</template>

<script>
let moment = require("moment");

export default {
  props: {
    List: Object,
    sub: Boolean,
    id: {
      type: String | Boolean,
      default: false
    }
  },
  data() {
    return {
      user: {},
      flatten: true,
      showUser: false,
      fetched: false,
      more: false,
      list: {}
    };
  },
  methods: {
    goList() {
      // this.$store.dispatch("set_current_list", this.list);
    },
    async fetchUser() {
      await this.$store.dispatch("fetch_user", this.list.user).then(user => {
        this.user = user;
      });
    }
  },
  computed: {
    creationDate() {
      let time = moment(this.list.created.toDate()).fromNow();
      return time.slice(0, time.indexOf(" ") + 2).replace(/\s/g, "");
    }
  },
  created: function() {
    if (this.id) {
      this.$store
        .dispatch("fetch_list", this.id)
        .then(list => {
          this.list = list;
        })
        .then(() => {
          this.fetched = true;
          this.fetchUser();
        });
    } else {
      this.list = this.List;
      this.fetchUser();
      this.fetched = true;
    }
  }
};
</script>

<style scoped>
@import url("../../public/my-modules/animations.css");
.main {
  display: flex;
}
</style>
