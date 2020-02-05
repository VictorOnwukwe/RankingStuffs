<template>
      <v-card :outlined="sub" :class="{ loading: !fetched }" width="100%">
        <v-card-text v-if="fetched" class="pa-3">
          <v-layout>
            <v-flex shrink pr-2>
              <m-img
                :src="list.preview_image ? list.preview_image.url.low : false"
                :minWidth="'100px'"
                :maxWidth="'120px'"
                :width="sub ? '10vw' : '20vw'"
                :aspectRatio="'1'"
              ></m-img>
            </v-flex>
            <v-flex>
              <v-card height="100%" flat>
                <v-card-title class="pa-0">
                  <router-link
                    :to="'/lists/' + list.id"
                    class="text-capitalize no-deco brighten-1 oswald"
                    :class="{ 'font-weight-medium ptd': !sub, 'link--text': sub }"
                    style="font-size:0.8em"
                  >
                    {{ list.title }}
                  </router-link>
                </v-card-title>
                <div class="pa-0 mt-1" v-if="!sub">
                  <rating
                    :rating="list.rating"
                    :ratersCount="list.raters_count"
                  ></rating>
                  <span>
                    <span class="">
                      <span class="ptd font-weight-medium">
                        {{ list.votes }}</span
                      >
                      <span class="ptd">&nbsp;votes&nbsp;|&nbsp;</span>
                    </span>
                    <span>
                      <span class="ptd font-weight-medium">{{
                        list.item_count
                      }}</span>
                      <span class="ptd">&nbsp;items</span>
                    </span>
                  </span>
                  <v-layout class="mt-2">
                    <v-flex shrink>
                      <dp class="mr-2" v-if="user" :src="user.profile_pic"></dp>
                    </v-flex>
                    <v-flex shrink>
                      <username v-if="user" :user="user"></username>
                    </v-flex>
                  </v-layout>
                </div>
              </v-card>
            </v-flex>
          </v-layout>
          <!-- <div v-if="list.description && !sub" class="mt-3">
            <v-layout class="mt-2">
              <v-flex shrink>
                <dp class="mr-2" v-if="user" :src="user.profile_pic"></dp>
              </v-flex>
              <v-flex shrink>
                <username v-if="user" :user="user"></username
              ></v-flex>
            </v-layout>
            <div v-if="list.description" class="ptd">{{ !more ? list.description.slice(0, 200) : list.description }}
              <span
                @click="more = !more"
                class="brand--text pointer"
                v-if="list.description.length > 200"
                >...{{ !more ? "see more" : "see less" }}</span
              >
            </div> -->
          </div>
        </v-card-text>
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
      user: null,
      flatten: true,
      showUser: false,
      fetched: false,
      more: false,
      list: {}
    };
  },
  methods: {
    async fetchUser() {
      await this.$store
        .dispatch("fetch_user", this.list.creator.id)
        .then(user => {
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
