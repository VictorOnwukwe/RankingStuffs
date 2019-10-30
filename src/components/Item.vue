<template>
  <v-layout>
    <v-flex xs12 md10 offset-md1>
      <v-card v-if="fetched" outlined tile class="pa-4 mb-4 mx-auto" max-width="1000px">
        <v-layout
          @click="contribute = true"
          column
          class
          style="position:absolute; top:1.5em; right:1em;"
        >
          <v-icon size="1em" color="grey">fa-pencil-alt</v-icon>
          <span class="pointer" style="font-size:0.7em">Contribute</span>
        </v-layout>
        <v-layout column>
          <div max-width="900px">
            <v-card
              tile
              flat
              outlined
              width="30vw"
              max-width="350px"
              min-width="100px"
              class="pa-4 mb-4 mr-4"
              style="float:left"
            >
              <img-prev
                v-if="item.image"
                :image="item.image"
                :width="'100%'"
                :aspectRatio="1"
                :path="{item: itemID}"
              ></img-prev>
              <v-img v-else :src="emptyphoto" flat width="100%" aspect-ratio="1"></v-img>

              <upload-image
                style="position:absolute; bottom:8px; right:8px;"
                class
                v-if="!item.image"
                @upload="uploadImage"
                :uploading="uploading"
              >mdi-camera</upload-image>
            </v-card>
            <div>
              <h1 class="primary-text-dark text-capitalize font-weight-medium" style>{{item.name}}</h1>
              <span class="subtitle-1 secondary-text-dark font-weight-bold">{{item.category}}</span>
              <p
                class="subtitle-1 primary-text-dark mt-2"
                style="white-space:pre-wrap; font-size:0.9em"
              >{{item.about}}</p>
            </div>
          </div>
        </v-layout>
        <v-card-title
          class="text-capitalize top-bar pa-2"
          style="font-size:1em; font-weight:normal"
          v-if="featuredLists.length > 0"
        >Lists Featuring {{item.name}}</v-card-title>
        <display-lists :lists="featuredLists" :sub="true"></display-lists>
      </v-card>
      <div v-else>Loading...</div>
      <v-dialog max-width="600px" v-model="contribute">
        <v-card tile flat class="grey lighten-3">
          <v-card-title
            class="title font-weight-bold"
            style="position:sticky;z-index:2;top:0;background:#F4F4F4;border-bottom:1px solid grey"
          >
            Contribute
            <v-spacer></v-spacer>
            <v-icon class="close" @click="contribute = false">mdi-close</v-icon>
          </v-card-title>
          <v-card-text class="mt-4">
            <p class="text-capitalize font-weight-medium grey--text text--darken-2 mt-4">Category</p>
            <v-select v-model="category" :items="categories" color="brand" class="mt-n6"></v-select>
            <p class="text-capitalize font-weight-medium grey--text text--darken-2">About</p>
            <v-textarea color="brand" solo flat v-model="about" rows="20" no-resize></v-textarea>
            <p
              class="text-capitalize font-weight-medium grey--text text--darken-2"
            >Notes: Links, Citations, references, why you altered/added some info</p>
            <v-textarea
              color="brand"
              solo
              flat
              rows="6"
              no-resize
              label="References"
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="update()" class="brand white--text">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import UploadImage from "./UploadImage";

export default {
  components: {
    "upload-image": UploadImage
  },
  data() {
    return {
      item: {},
      name: "",
      category: "",
      about: "",
      fetched: false,
      featuredLists: [],
      uploading: null,
      contribute: false
    };
  },
  methods: {
    toggle(element) {
      document.querySelector("." + element).classList.toggle("hide");
      setTimeout(() => {
        this.$vuetify.goTo(document.getElementById("contribution"), {
          offset: 60
        });
      }, 200);
    },
    uploadImage(image) {
      this.uploading = true;
      this.$store
        .dispatch("upload_item_image", {
          image: image,
          item: this.item
        })
        .then(() => {
          this.uploading = false;
        });
    },
    update() {
      let upload = {};

      if (this.image) {
        upload = { image: this.image, ...upload };
      }
      if (this.about) {
        upload = { about: this.about, ...upload };
      }
      if (this.category) {
        upload = { category: this.category, ...upload };
      }

      this.$store.dispatch("update_item", { update: upload, item: this.item });
    },
    fetchItem() {
      this.$store
        .dispatch("fetch_item", this.itemID)
        .then(item => {
          this.item = item;
          this.fetched = true;
          this.about = this.item.about;
        })
        .then(() => {
          this.fetchFeaturedLists();
        });
    },
    fetchFeaturedLists() {
      this.$store.dispatch("fetch_item_featured", this.item.id).then(lists => {
        this.featuredLists = lists;
      });
    }
  },
  computed: {
    itemID() {
      return this.$route.query.id;
    },
    wrap() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return true;
          break;
        default:
          false;
      }
    },
    categories() {
      return ["Person", "Song", "Sport", "Movie", "Animal", "Country", "Album"];
    },
    emptyphoto() {
      return this.$store.getters.noPhoto;
    }
  },
  async created() {
    this.fetchItem();
  }
};
</script>

<style scoped>
.hide {
  display: none;
}
</style>