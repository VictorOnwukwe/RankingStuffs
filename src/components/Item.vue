<template>
  <v-layout>
    <v-flex class="mt">
      <v-card v-if="fetched" flat tile class="pa-4 mb-4 mx-auto">
        <v-layout
          @click="contribute = true"
          column
          class
          style="position:absolute; top:1.5em; right:1em;"
        >
          <v-icon size="1em" color="grey" class="pointer">fa-pencil-alt</v-icon>
          <span class="pointer" style="font-size:0.7em">Contribute</span>
        </v-layout>
        <v-layout column>
          <div max-width="900px" class="mb-8">
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
                :path="{ item: itemID }"
              ></img-prev>
              <v-img
                v-else
                :src="require('../assets/emptyimage.jpg')"
                flat
                width="100%"
                aspect-ratio="1"
              ></v-img>

              <upload-image
                style="position:absolute; bottom:8px; right:8px;"
                class
                v-if="!item.image"
                @upload="uploadImage"
                :uploading="uploading"
                >mdi-camera</upload-image
              >
            </v-card>
            <div>
              <h1 class="ptd text-capitalize font-weight-medium" style>
                {{ item.name }}
              </h1>
              <span class="subtitle-1 std font-weight-medium">{{
                item.category
              }}</span>
              <p
                class="subtitle-1 ptd my-8"
                style="white-space:pre-wrap; font-size:0.9em"
              >{{ item.about }}</p>
            </div>
            <div>
              <a v-for="(ref, index) in item.references" :key="index" :href="ref">{{ref}}<br/></a>
            </div>
          </div>
        </v-layout>
        <v-card-title
          class="text-capitalize top-bar pa-2"
          style="font-size:1em; font-weight:normal"
          v-if="featuredLists.length > 0"
          >Lists Featuring {{ item.name }}</v-card-title
        >
        <display-lists :ids="featuredLists" :sub="true"></display-lists>
      </v-card>
      <div v-else>Loading...</div>
      <v-dialog
        :fullscreen="$vuetify.breakpoint.xs"
        max-width="600px"
        v-model="contribute"
      >
        <v-card tile flat class="grey lighten-3">
          <v-card-title
            class="title font-weight-bold grey lighten-2"
            style="position:sticky;z-index:2;top:0;border-bottom:1px solid grey"
          >
            Contribute
            <v-spacer></v-spacer>
            <v-icon class="close" @click="contribute = false">mdi-close</v-icon>
          </v-card-title>
          <v-card-text class="mt-4">
            <p
              class="text-capitalize font-weight-medium grey--text text--darken-2 mt-4"
            >
              Category
            </p>
            <v-select
              solo
              flat
              v-model="category"
              :items="categories"
              color="brand"
              class="mt-n2"
            ></v-select>
            <p
              class="text-capitalize font-weight-medium grey--text text--darken-2"
            >
              About
            </p>
            <v-textarea
              color="brand"
              solo
              flat
              v-model="about"
              rows="20"
              no-resize
            ></v-textarea>
            <p
              class="text-capitalize font-weight-medium grey--text text--darken-2"
            >
              References / Links
            </p>
            <v-textarea
              color="brand"
              solo
              flat
              rows="6"
              no-resize
              label="Seperate with commas"
              v-model="references"
            ></v-textarea>
            <a v-for="(link, index) in referenceArray" :key="index"
              >{{ link }}<br
            /></a>
          </v-card-text>
          <v-card-actions>
            <v-btn :loading="updating" @click="update()" class="brand white--text">Submit</v-btn>
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
      contribute: false,
      references: "",
      referenceArray: [],
      updating: false
    };
  },
  methods: {
    uploadImage(data) {
      this.uploading = true;
      this.$store
        .dispatch("upload_item_image", {
          image: data.image,
          source: data.source,
          item: this.item
        })
        .then(() => {
          this.uploading = false;
        });
    },
    update() {
      this.updating = true;
      let upload = {};

      if (this.referenceArray !== []) {
        if (this.item.references) {
          upload = {
            references: [...this.referenceArray, ...this.item.references]
          };
        } else {
          upload = { references: this.referenceArray };
        }
      }

      if (this.image) {
        upload = { image: this.image, ...upload };
      }
      if (this.about) {
        upload = { about: this.about, ...upload };
      }
      if (this.category) {
        upload = { category: this.category, ...upload };
      }

      this.$store.dispatch("update_item", { update: upload, item: this.item }).then(() => {
        this.updating = false;
      })
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
    },
    updateLinks() {
      this.referenceArray = this.references.replace(/\s/g, "");
      this.referenceArray = this.referenceArray.split(",");
      if (this.referenceArray[this.referenceArray.length - 1] == "") {
        this.referenceArray.pop();
      }
    }
  },
  watch: {
    references() {
      this.updateLinks();
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
      return [
        "Politician",
        "Song",
        "Sport",
        "Movie",
        "Animal",
        "Country",
        "Album",
        "Soccer Player",
        "Basketball Player",
        "Youtuber",
        "Game",
        "Food",
        "Actor",
        "Actress",
        "Television Show",
        "Comedian",
        "Music Album",
        "Music Genre",
        "Movie Genre",
        "Cartoon",
        "Cartoon Character",
        "Book",
        "Book Genre",
        "Writer",
        "Rapper",
        "Singer",
        "Song Writer"
      ];
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
