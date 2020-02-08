<template>
  <v-layout>
    <v-flex class="mt">
      <v-card v-if="fetched" flat tile class="mb-4">
        <v-layout column>
          <div max-width="" class="mb-8">
            <div style="float:right;position:relative" class="ml-4 mb-4">
              <img-prev
                v-if="item.image"
                :image="item.image"
                :width="'30vw'"
                :aspectRatio="1"
                :maxWidth="'300px'"
                :minWidth="'150px'"
                :high="true"
                :path="{ item: itemID }"
              ></img-prev>
              <v-img
                v-else
                :src="require('../assets/emptyimage.jpg')"
                flat
                min-width="150px"
                max-width="300px"
                width="30vw"
                aspect-ratio="1"
              ></v-img>

              <upload-image
                style="position:absolute; bottom:12px; left:12px;"
                :type="'item'"
                class
                :successMessage="'Your image has been submitted successfully. Thanks for your contribution'"
                v-if="!item.image"
                @upload="uploadImage"
                :uploading="uploading"
                >mdi-camera</upload-image
              >
            </div>
            <div>
              <v-layout column>
                <h1
                  class="ptd text-capitalize font-weight-medium mr-4"
                  :style="{
                    fontSize: $vuetify.breakpoint.xs ? '1.5em' : '2em'
                  }"
                >
                  {{ item.name }}
                </h1>
                <span class="subtitle-1 std font-weight-medium">{{
                  item.category
                }}</span>
              </v-layout>
              <p
                class="subtitle-1 ptd my-8"
                style="white-space:pre-wrap; font-size:0.9em"
              >{{ item.about }}</p>
            </div>
            <div>
              <a
                v-for="(ref, index) in item.references"
                :key="index"
                :href="ref"
                >{{ ref }}<br
              /></a>
            </div>
          </div>
        </v-layout>
        <v-hover v-slot:default="{ hover }">
          <v-btn color="accent" outlined @click="initContribute()">
            <v-layout align-center>
              <v-icon size="2em" class="mr-2" color="">fa-plus</v-icon>
              <span>Contribute</span>
            </v-layout>
          </v-btn>
        </v-hover>
        <v-card-title
          class="ptd pl-0 font-weight-bold text-capitalize"
          style="font-size: 1em; margin-top:4em;"
          >Lists Featuring {{ item.name }}</v-card-title
        >
        <lists-preview :IDs="featuredLists" :item="item"></lists-preview>
      </v-card>
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

            <alert
              :type="'success'"
              :value="updated"
              :message="successMessage"
              @act="updateSuccess()"
            ></alert>
          </v-card-text>
          <v-card-actions>
            <m-btn :loading="updating" @click="update()">Submit</m-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import UploadImage from "./UploadImage";
import ItemLists from "./ItemLists";
export default {
  components: {
    "upload-image": UploadImage,
    "lists-preview": ItemLists
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
      updating: false,
      updated: false
    };
  },
  methods: {
    uploadImage(obj) {
      this.uploading = true;
      let data = {};
      let reader = new FileReader();
      reader.readAsDataURL(obj.high);
      reader.onloadend = () => {
        this.displayImg = reader.result;
        data.high = reader.result;
      };
      setTimeout(() => {
        reader.readAsDataURL(obj.low);
        reader.onloadend = () => {
          data.low = reader.result;
          this.$store
            .dispatch("upload_pending_item_image", {
              image: {
                ...data,
                source: obj.source,
                user: {
                  id: this.$store.getters.getUser.id,
                  username: this.$store.getters.getUser.username
                }
              },
              item: this.item
            })
            .then(image => {
              this.uploading = false;
            })
            .catch(_ => {
              this.$store.dispatch("set_snackbar", {
                show: true,
                message: "sorry. An error occured",
                type: "error"
              });
              this.uploading = false;
            });
        };
      }, 500);
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

      this.$store
        .dispatch("upload_pending_item_info", { update: upload, item: this.item, user: {
                  id: this.$store.getters.getUser.id,
                  username: this.$store.getters.getUser.username
                } })
        .then(() => {
          this.updating = false;
          this.updated = true;
        })
        .catch(_ => {
          this.$store.dispatch("set_snackbar", {
            show: true,
            type: "error",
            message: "Sorry. An error occured"
          });
          this.updating = false;
        });
    },
    initContribute() {
      if (!this.$store.getters.authenticated) {
        this.$store.dispatch("set_login", true);
        return;
      }
      this.contribute = true;
    },
    updateSuccess() {
      this.contribute = false;
      this.$router.go(1);
    },
    fetchItem() {
      this.$store
        .dispatch("fetch_item", this.itemID)
        .then(item => {
          this.item = item;
          this.fetched = true;
          this.about = this.item.about;
          this.$store.dispatch("set_loading", false);
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
      return this.$route.params.id;
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
        "Song",
        "Sport",
        "Movie",
        "Animal",
        "Country",
        "Tennis Player",
        "Golf Player",
        "Album",
        "Soccer Player",
        "Soccer Team",
        "Basketball Team",
        "City",
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
        "Song Writer",
        "Sportsperson",
        "Animal",
        "Model",
        "Cricket Player",
        "Cricket Team"
      ].sort();
    },
    emptyphoto() {
      return this.$store.getters.noPhoto;
    },
    successMessage() {
      return "Item submitted successfully. Thanks for your contribution";
    }
  },
  created() {
    this.$store.dispatch("set_loading", true);
    this.fetchItem();
  }
};
</script>
