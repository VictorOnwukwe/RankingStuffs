<template>
  <div>
    <div class="img">
      <v-img
        @click="previewImage()"
        :src="srcUrl"
        :lazy-src="image.url.low"
        :width="width"
        :aspect-ratio="aspectRatio"
        :style="{ borderRadius: radius }"
        :min-width="minWidth"
        :max-width="maxWidth"
        class="pointer"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </div>
    <v-dialog v-model="preview" max-width="450px">
      <v-card tile>
        <v-layout class="close" style="">
          <v-spacer></v-spacer>
            <v-icon class="close-btn" size="1.6em" @click="preview = false"
              >mdi-close</v-icon
            >
        </v-layout>
        <div style="margin-top:">
          <v-img
            width="100%"
            :src="image.url.high"
            :lazy-src="image.url.low"
            contain
          ></v-img>
          <v-card-text class="mt-3">
            <div v-if="loading" class="text-center ma-6">
              <m-progress></m-progress>
            </div>
            <div v-else>
              <div class="">
                <v-layout>
                  <div class="label">
                    Added By:
                  </div>
                  <div class="link--text">{{ user.username }}</div>
                </v-layout>
              </div>
              <div>
                <v-layout>
                  <div class=" label">
                    Added On:
                  </div>
                  <div v-if="completeImage.created" class="std">
                    {{ created }}
                  </div>
                </v-layout>
              </div>
              <div v-if="completeImage" class="">
                <v-layout>
                  <div class="label">
                    Source:
                  </div>
                  <div v-if="completeImage.source">
                    <div
                      v-if="completeImage.source == 'user'"
                      class="brand--text"
                    >
                      {{ completeImage.source }}
                    </div>
                    <div v-else>
                      {{ getSiteName(completeImage.source) }}&nbsp;[<a
                        :href="completeImage.source"
                        target="_blank"
                        class="no-deco underline link--text"
                        >view original</a
                      >]
                    </div>
                  </div>
                </v-layout>
              </div>
            </div>
          </v-card-text>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
let moment = require("moment");
export default {
  props: {
    width: {
      type: Number | String,
      default: "200px"
    },
    maxWidth: {
      type: Number | String,
      default: "100%"
    },
    minWidth: {
      type: Number | String,
      default: "0"
    },
    aspectRatio: {
      type: Number,
      default: 1
    },
    image: Object,
    path: {
      type: Object | Boolean,
      default: false
    },
    high: {
      type: Boolean,
      default: false
    },
    radius: {
      type: String,
      default: "5px"
    }
  },
  data() {
    return {
      preview: false,
      loading: false,
      completeImage: {},
      user: {},
      observer: null,
      intersected: false
    };
  },
  methods: {
    getDetails() {
      this.loading = true;
      if (this.path) {
        this.completeImage = this.image;
        this.fetchUser(this.image.user.id);
        this.loading = false;
      } else {
        this.completeImage = this.image;
        this.fetchUser(this.image.user.id);
        this.loading = false;
      }
    },
    fetchUser(id) {
      this.$store.dispatch("fetch_user", id).then(result => {
        this.user = result;
      });
    },
    previewImage() {
      this.preview = true;
      this.getDetails();
    },
    getSiteName(link) {
      let sliced = link.slice(link.indexOf("//") + 2);
      let result = sliced.slice(0, sliced.indexOf("/"));
      return result;
    }
  },
  computed: {
    inter() {
      return this.intersected;
    },
    created() {
      return moment(this.completeImage.created.toDate()).format("MMMM Do YYYY");
    },
    srcUrl() {
      return this.intersected ? this.image.url.high : "";
    }
  },
  mounted() {
    this.observer = new IntersectionObserver(entries => {
      const image = entries[0];
      if (image.isIntersecting) {
        this.intersected = true;
        this.observer.disconnect();
      }
    });

    this.observer.observe(this.$el);
  },
  destroyed() {
    this.observer.disconnect();
  }
};
</script>
<style scoped>
p {
  line-height: 1.1;
}
.close {
  position: sticky;
  top: 0;
  background-color: rgba(0, 0, 0, 0);
  right: 0;
  transform: translateY(0%);
  z-index: 4;
}
.close-btn {
  color: white;
  position: absolute;
  z-index: 2;
  right: 4px;
  top: 4px;
  background-color: rgba(0,0,0,0.4);
  border-radius: 50%;
  padding: 0.25em
}
.close-btn:hover {
  color: rgb(212, 12, 12);
}
.label {
  min-width: 6em;
}
.blur {
  filter: blur(2px);
}
.unblur {
  filter: blur(0);
}
.img {
  border-radius: 5px;
}
.img:hover {
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.3);
}
</style>
