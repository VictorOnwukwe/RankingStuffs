<template>
  <div id="main">
    <v-hover v-slot:default="{ hover }">
      <v-card @click="goList()" :class="!fetched ? 'loading' : null" tile width="100%" :elevation="hover? 4 : 1">
        <v-layout v-if="fetched">
          <v-flex shrink v-if="list.preview_image" pa-2 pr-0>
            <v-img :src="list.preview_image.url.low" min-width="80px" max-width="130px" :width="sub ? '10vw' : '20vw'" id="image" aspect-ratio="1"></v-img>
          </v-flex>
          <v-flex>
            <v-card height="100%" flat>
              <v-card-title class="pl-2">
                <h2
                  class="title brand--text text-capitalize"
                  style="font-weight:normal"
                >{{list.title}}</h2>
              </v-card-title>
              <v-card-text class="pl-2">
                <v-layout class="mt-n3">
                  <rating
                    :value="list.rating"
                    :size="'0.9em'"
                  ></rating>
                  <span class="caption primary-text-dark" style="margin-top: 0.1em">({{list.rating}})</span>
                </v-layout>
                  <a @click.stop="showUser=true" class="mt-n3 subtitle-1 primary-text-dark">{{user.username}}</a>

                <div v-if="list.description">{{list.description}}</div>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </v-hover>
    <v-dialog v-if="list.user" v-model="showUser" max-width="300px">
      <preview-user @close="showUser=false" :id="user.id"></preview-user>
    </v-dialog>
  </div>
</template>

<script>
let moment = require("moment");

export default {
  props: {
    list: Object,
    sub: Boolean
  },
  data() {
    return {
      user: {},
      flatten: true,
      showUser: false,
      fetched: false
    };
  },
  methods: {
    goList() {
      this.$router.push({ path: "/lists/" + this.list.id });
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
    this.fetchUser().then(() => {
      this.fetched = true;
    });
  }
};
</script>

<style scoped>
@import url("../../public/my-modules/animations.css");
#main {
  display: flex;
}
</style>
