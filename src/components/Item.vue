<template>
<div>
  <v-card v-if="fetched" tile class="pa-4 mb-4 mx-auto primary" max-width="900px">
    <v-icon
      @click="toggle('contribute')"
      style="position:absolute; top:1em; right:1em;"
      class=""
      color="accent"
    >
      mdi-pencil
    </v-icon>
    <v-layout column>
      <v-layout :column="wrap" max-width="900px">
        <v-flex class="mb-4 mr-4" shrink>
          <v-card width="200px">
            <v-img
              v-if="item.image"
              :src="item.image.src"
              style="border-radius:0.3em"
              width="200px"
              aspect-ratio="1"
            ></v-img>
            <v-card v-else flat width="200px" height="200px" class="grey lighten-2">
              <v-card-text
                v-if="mainUrl === ''"
                class="hint-1"
              >No media. Be the first to add an image for this Item...</v-card-text>
              <v-img v-else :src="mainUrl" width="200px" aspect-ratio="1"></v-img>
            </v-card>
            <v-icon
              @click="pickMain()"
              style="position:absolute; bottom:8px; right:8px;"
              class=""
              v-if="!item.image"
              size="30"
              color="accent"
            >
              mdi-camera
            </v-icon>

            <v-icon
              @click="uploadImage()"
              style="position:absolute; bottom:8px; left:8px;"
              class=""
              v-if="mainUrl !== ''"
              size="30"
              color="accent"
            >
              mdi-send-circle
            </v-icon>

            <v-icon
              @click="mainUrl = ''"
              style="position:absolute; bottom:8px; left:85px; border-radius:50%"
              class=""
              v-if="mainUrl !== ''"
              size="30"
              color="accent"
            >
              mdi-close-circle
            </v-icon>
            <input
              ref="imgSelect1"
              style="display:none"
              @change="onMainSelect"
              type="file"
              accept="images/*"
            />
          </v-card>
        </v-flex>
        <v-flex>
            <v-layout align-center class="pr-10">
              <h2
                class="primary-text-dark"
                style="font-weight:normal; line-height: 1.2em; font-size:1.5em"
              >{{item.name}}</h2>
            </v-layout>
            <v-layout v-if="item.category" align-center class="mt-n1">
              <span class="subtitle-2 secondary-text-dark">{{item.category}}</span>
            </v-layout>
            <v-layout>
              <p
                class="subtitle-1 primary-text-dark mt-2"
                style="line-height:1.2"
              >{{item.about}}</p>
            </v-layout>
        </v-flex>
      </v-layout>
      <v-layout wrap align-start class>
        <v-flex xs12 class="mb-8 hide">
          <v-layout>
            <a class="primary-text-dark">More Images</a>
            <v-card></v-card>
          </v-layout>
        </v-flex>
        <v-flex xs12 sm10 offset-sm1 class="contribute hide">
          <v-card tile class="grey lighten-4">
            <v-card-title>Contribute</v-card-title>
            <v-card-text class="mt-4">
              <v-layout class="hide" column align-start>
                <input ref="imgSelect2" style="display:none" type="file" @change="onFileSelect" />
                <v-layout>
                  <v-btn @click="pickFile()">Add Image</v-btn>
                  <v-btn @click="imageUrl = ''" class="mx-4">Remove</v-btn>
                </v-layout>
                <v-img
                  v-if="imageUrl!==''"
                  class="mt-4 br"
                  width="150px"
                  aspect-ratio="1"
                  :src="this.imageUrl"
                ></v-img>
              </v-layout>
              <v-text-field outlined v-model="category" color="brand" label="Category" class="mt-4"></v-text-field>
              <v-textarea
                class="mt-n3"
                color="brand"
                outlined
                v-model="about"
                rows="6"
                no-resize
                label="About"
              ></v-textarea>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="update()" class="brand">Submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-card>
  <div v-else>Loading...</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      item: {},
      name: "Eminem",
      category: "",
      about: "",
      image: null,
      imageUrl: "",
      mainImage: "",
      mainUrl: "",
      fetched: false
    };
  },
  methods: {
    pickFile() {
      this.$refs.imgSelect2.click();
    },
    onFileSelect(event) {
      const files = event.target.files;
      let fileName = files[0].name;
      if (fileName.lastIndexOf(".") <= 0) {
        return alert("Invalid File Selected...");
      }

      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.imageUrl = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.image = files[0];
      console.log(this.image);
    },
    pickMain() {
      this.$refs.imgSelect1.click();
    },
    onMainSelect() {
      const files = event.target.files;
      let fileName = files[0].name;
      if (fileName.lastIndexOf(".") <= 0) {
        return alert("Invalid File Selected...");
      }

      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.mainUrl = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.mainImage = files[0];
    },
    toggle(element) {
      document.querySelector("." + element).classList.toggle("hide");
    },
    uploadImage() {
      this.$store.dispatch("upload_item_image", {
        image: this.mainImage,
        item: this.item
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

      this.$store.dispatch("update_item", {update: upload, item: this.item});
    },
    fetchItem() {
      this.$store.dispatch("fetch_item", this.itemID).then(item => {
        console.log(item);
        this.item = item;
        this.fetched = true;
      });
    }
  },
  computed: {
    itemID() {
      return this.$route.query.item.id;
    },
    wrap() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return true;
          break;
        default:
          false;
      }
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