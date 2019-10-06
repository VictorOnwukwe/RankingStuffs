<template>
  <div>
    <v-img @click="previewImage()" :src="image.url" :width="width" :aspect-ratio="aspectRatio"></v-img>
    <v-dialog v-model="preview" max-width="350px">
      <v-card tile>
        <v-img width="100%" :src="image.url" contain></v-img>
        <v-card-text class="mt-3">
          <div v-if="loading" class="text-center ma-12">
            <v-progress-circular indeterminate rotate small color="light-blue"></v-progress-circular>
          </div>
          <div v-else>
            <p class="font-weight-medium">
              Added By:
              <span class="brand--text">{{user.username}}</span>
            </p>
            <p class="font-weight-medium">
              Source:
              <span class="brand--text">{{completeImage.source}}</span>
            </p>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    width: Number | String,
    aspectRatio: Number,
    image: Object,
    path: Object
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
        });
    },
    fetchUser(id) {
      this.$store.dispatch("fetch_user", id).then(result => {
        this.user = result;
      });
    },
    previewImage() {
      this.preview = true;
      this.getDetails();
    }
  },
  computed: {
    url() {
      let base64data;
      let URL = new FileReader();
      URL.readAsDataURL(this.image.src);
      URL.onloadend = function() {
        base64data = reader.result;
        console.log(base64data);
      };
      return base64data;
    },
  }
};
</script>
<style scoped>
p {
  line-height: 1;
}
</style>