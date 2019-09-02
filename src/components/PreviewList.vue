<template>
  <div id="main">
    <v-card tile :flat="flatten" @mouseover="flatten=false" @mouseleave="flatten=true" width="100%">
      <v-layout>
        <v-flex shrink v-if="list.preview_image" pa-2>
          <v-img :src="list.preview_image" width="100" id="image" aspect-ratio="1"></v-img>
        </v-flex>
        <v-flex>
          <v-card tile height="100%" flat>
            <v-card-title @click="goList()" class="title brand--text text--darken-2">{{list.title}}</v-card-title>
            <v-card-text>
              <div>
                <p @click="showUser=true" class="mt-n3 subtitle-1 link--text">{{user.username}}</p>
              </div>
              <v-layout class="mt-n5">
                <v-rating
                  :value="3"
                  color="yellow darken-3"
                  background-color="grey darken-1"
                  half-increments
                  :size="12"
                  dense
                  readonly
                ></v-rating>
                <p class="caption" style="margin-top: 0.2em">- 200 reviews</p>
              </v-layout>

              <ol>
                <li v-for="(title, i) in list.items" :key="i"></li>
              </ol>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card>
    <v-dialog v-if="list.user" v-model="showUser" max-width="300px">
      <PreviewUser @closeDialog="showUser=false" :user="user"></PreviewUser>
    </v-dialog>
  </div>
</template>

<script>
let moment = require("moment");
import PreviewUser from "./PreviewUser";

export default {
  components: {
    PreviewUser
  },
  props: {
    list: Object
  },
  data() {
    return {
      user: {},
      flatten: true,
      showUser: false
    };
  },
  methods: {
    goList() {
      this.$router.push({ path: "/lists/" + this.list.id });
    },
    fetchUser() {
      this.$store.dispatch("fetch_user", this.list.user).then(user => {
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
    if (this.list.user) {
      this.fetchUser();
    }
  }
};
</script>

<style scoped>
#image {
  border-radius: 0.3em;
}
img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 0.2em;
}
#image-display {
  margin-right: 1em;
}
#list-title {
  font-size: 1.5em;
}
.clear-float {
  clear: both;
}
#main {
  padding: 1em;
  border-radius: 0.2em;
  display: flex;
}
</style>
