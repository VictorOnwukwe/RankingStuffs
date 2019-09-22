<template>
  <div id="main">
    <v-hover v-slot:default="{ hover }">
      <v-card @click="goList()" tile class="primary" v-if="fetched" width="100%" :elevation="hover? 3 : 0">
        <v-layout>
          <v-flex shrink v-if="list.preview_image" pa-2 pr-0>
            <v-img :src="list.preview_image" :width="sub ? '80px' : '150px'" id="image" aspect-ratio="1"></v-img>
          </v-flex>
          <v-flex>
            <v-card class="primary" height="100%" flat>
              <v-card-title>
                <h2
                  class="title brand--text text-capitalize"
                  style="line-height: 1.2em; font-weight:normal"
                >{{list.title}}</h2>
              </v-card-title>
              <v-card-text>
                <v-layout class="mt-n3">
                  <v-rating
                    :value="list.rating"
                    color="yellow darken-3"
                    background-color="grey darken-1"
                    half-increments
                    :size="12"
                    dense
                    readonly
                  ></v-rating>
                  <p class="caption" style="margin-top: 0.1em">({{list.rating}})</p>
                </v-layout>
                <div>
                  <a @click.stop="showUser=true" class="mt-n3 subtitle-1 primary-text-dark">{{user.username}}</a>
                </div>

                <ol>
                  <li v-for="(title, i) in list.items" :key="i"></li>
                </ol>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
    </v-hover>
    <v-dialog v-if="list.user" v-model="showUser" max-width="300px">
      <preview-user @closeDialog="showUser=false" :user="user"></preview-user>
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
#main {
  display: flex;
}
</style>
