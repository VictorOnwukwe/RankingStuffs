<template>
  <div>
    <v-img
      @click="previewImage()"
      :src="image.url.low"
      :width="width"
      :aspect-ratio="aspectRatio"
    ></v-img>
    <v-dialog v-model="preview" max-width="450px">
      <v-card tile>
        <v-layout class="close" style="">
          <v-spacer></v-spacer>
          <div class="close-button" style="">
            <v-icon class="close-btn" size="1.6em" @click="preview = false"
              >mdi-close</v-icon
            >
          </div>
        </v-layout>
        <div style="margin-top:-2em">
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
                  <div class="brand--text">{{ user.username }}</div>
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
              <!-- <div v-if="completeImage" class="">
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
                      {{ getSiteName(completeImage.source) }}[
                      <a
                        :href="completeImage.source"
                        class="no-deco underline link--text"
                        >view original</a
                      >]
                    </div>
                  </div>
                </v-layout>
              </div> -->
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
    width: Number | String,
    aspectRatio: Number,
    image: Object,
    path: {
      type: Object | Boolean,
      default: false
    }
  },
  data() {
    return {
      preview: false,
      loading: false,
      completeImage: {},
      user: {}
    };
  },
  methods: {
    getDetails() {
      this.loading = true;
      if (this.path) {
        this.$store
          .dispatch("fetch_item_image", {
            item_id: this.path.item,
            image_id: this.image.id
          })
          .then(result => {
            this.completeImage = result;
            return result.user;
          })
          .then(user => {
            this.fetchUser(user);
          })
          .then(() => {
            this.loading = false;
          }).catch(_ => {
            this.loading = false;
          })
      } else {
        this.completeImage = this.image;
        this.fetchUser(this.image.user);
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
    created() {
      return moment(this.completeImage.created.toDate()).format("MMMM Do YYYY");
    }
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
.close-button {
  background-color: rgba(0, 0, 0, 0.5);
  width: 2em;
  height: 2em;
  z-index: 4;
  display: flex;
  justify-content: center;
}
.close-btn {
  color: white;
}
.close-btn:hover {
  color: rgb(212, 12, 12);
}
.label {
  min-width: 6em;
}
</style>
