<template>
  <div>
    <m-btn v-if="btn" @click="showMenu()">Upload</m-btn>
    <v-icon v-if="icon" @click="showMenu()" size="2em" :color="type == 'addItem' ? 'grey' : 'accent'"
      >mdi-camera</v-icon
    >
    <v-dialog persistent v-model="uploadMenu" max-width="500px">
      <v-card class="pa-0">
        <v-card-title
              class="top-bar"
          style="position:sticky;z-index:2;top:0;background:#F4F4F4;border-bottom:1px solid grey; font-size:1em"
        >
          Select Image
          <v-spacer></v-spacer>
          <v-icon class="close" @click="(uploadMenu = false), close()"
            >mdi-close</v-icon
          >
        </v-card-title>
        <v-card-text class="mt-4">
          <v-layout>
            <v-text-field
              flat
              solo
              background-color="grey lighten-2"
              label="URL"
              placeholder="Enter URL"
              v-model="linkUrl"
              clearable
            ></v-text-field>
            <v-icon
              v-if="!fetchingImage"
              :disabled="!urlFetched"
              @click="showClipper()"
              :color="urlFetched ? 'green' : ''"
              style="margin-top:-0.7em;margin-left:0.2em"
              large
              >mdi-check-circle</v-icon
            >
            <m-progress v-else class="mt-4 ml-4"></m-progress>
          </v-layout>
          <div v-if="fetchingImage" class="caption warning--text mt-n6">
            Hold on. This may take a while...
          </div>
          <v-layout column align-center>
            <div class="mb-4">OR</div>
            <clipper-upload
              :accept="'image/*'"
              v-model="imgURL"
              @input="clipper = true"
            >
              <m-btn depressed>Upload</m-btn>
            </clipper-upload>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="clipper" max-width="600px">
      <v-card :loading="cropping">
        <v-card-title
              class="top-bar"
          style="position:sticky;z-index:2;top:0;background:#F4F4F4;border-bottom:1px solid grey; font-size:1em"
        >
          Edit Image
          <v-spacer></v-spacer>
          <v-icon
            class="close"
            @click="(clipper = false), (isLink = false), (imgURL = '')"
            >mdi-close</v-icon
          >
        </v-card-title>
        <v-card-text class="pa-2">
          <v-layout>
            <clipper-basic
              ref="clipper"
              :crossOrigin="'anonymous'"
              class="my-clipper pr-1"
              :src="imgURL"
              :width="50"
              :rotate="rotation"
              :initWidth="50"
              :initHeight="50"
              :ratio="type == 'profile' ? 1 : null"
              :bg-color="color"
              preview="my-preview"
            >
              <div class="mt-4 placeholder" slot="placeholder">No image</div>
            </clipper-basic>
            <clipper-preview
              name="my-preview"
              class="my-clipper my-preview pl-1"
              v-if="$vuetify.breakpoint.smAndUp"
            >
              <div class="placeholder" slot="placeholder">Preview Area</div>
            </clipper-preview>
          </v-layout>
          <v-layout class="my-3">
            <v-flex xs4>
              <v-layout column align-center>
                <v-icon @click="rotateRight()">mdi-rotate-right</v-icon>
                <div @click="rotateRight()" class="std caption pointer">
                  rotate-right
                </div>
              </v-layout>
            </v-flex>
            <v-flex xs4>
              <v-layout column align-center>
                <v-icon @click="crop()">mdi-crop</v-icon>
                <div @click="crop()" class="std caption pointer">Crop</div>
              </v-layout>
            </v-flex>
            <v-flex xs4>
              <v-layout column align-center>
                <v-icon @click="rotateLeft()">mdi-rotate-left</v-icon>
                <div @click="rotateLeft()" class="std caption pointer">
                  rotate-left
                </div>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex>
              <v-layout align-content-center justify-center>
                <label for="background">Background Color:&nbsp;</label>
                <input
                  class="ml-4 mr-1 mt-1"
                  type="radio"
                  id="black"
                  value="black"
                  v-model="color"
                />
                <label for="black">Black</label>
                <input
                  class="ml-4 mr-1 mt-1"
                  type="radio"
                  id="white"
                  value="white"
                  v-model="color"
                />
                <label for="white">White</label>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog max-width="600px" v-model="result">
      <v-card>
        <v-card-title
              class="top-bar"
          style="position:sticky;z-index:2;top:0;background:#F4F4F4;border-bottom:1px solid grey; font-size:1em"
        >
          {{ type == "addItem" ? "Save" : "Upload" }}
          <v-spacer></v-spacer>
          <v-icon class="close" @click="(result = false), (imgURL = '')"
            >mdi-close</v-icon
          >
        </v-card-title>
        <v-card-text>
          <v-layout justify-center class="mt-4">
            <v-img
              :min-width="'150px'"
              :max-width="$vuetify.breakpoint.xs ? '200px' : '250px'"
              :src="resultURL"
            ></v-img>
          </v-layout>
          <alert
            class="mt-4"
            :type="'success'"
            :value="successful"
            :message="successMessage"
            @act="uploadSuccess()"
          ></alert>
        </v-card-text>
        <v-card-actions>
          <m-btn :loading="uploading" @click="upload()">{{
            type == "addItem" ? "Save" : "Upload"
          }}</m-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Compressor from "compressorjs";
import { clipperPreview, clipperUpload, clipperBasic } from "vuejs-clipper";

function loadPcf(file, attr) {
  var atr = attr || "",
    id = (loadPcf.autoid = 1 + ~~loadPcf.autoid);
  // document.write("<img id=pcf" + id + " " + atr + " />");
  var xhr = new XMLHttpRequest();
  xhr.responseType = "arraybuffer"; // IE 10+ only, sorry.
  xhr.onload = function() {
    // I am loading gif for demo, you can load anything.
    var data = xhr.response;
    if (!data instanceof ArrayBuffer) return;
    var buf = new DataView(data),
      head = buf.getUint32(0),
      width = buf.getUint16(6, 1);
    if (head !== 1195984440) return console.log("Not a GIF: " + file); // 'GIF8' = 1195984440
    // Modify data, image width in this case, and push it to the <img> as gif.
    buf.setInt16(6, ~~(width / 2), 1);
    let image = URL.createObjectURL(
      new Blob([buf.buffer], { type: "image/gif" })
    );
  };
  xhr.open("GET", file);
  xhr.send();
}

export default {
  components: {
    "clipper-basic": clipperBasic,
    "clipper-preview": clipperPreview,
    "clipper-upload": clipperUpload,
  },
  props: {
    btn: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: Boolean,
      default: true,
    },
    actionColor: {
      type: String,
      default: "accent",
    },
    uploading: {
      type: Boolean,
      default: undefined,
    },
    successMessage: {
      type: String,
      default: "Upload Successful!",
    },
    type: {
      type: String,
      default: "profile",
    },
    successful: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      imgURL: "",
      uploadMenu: false,
      clipper: false,
      rotation: 0,
      color: "black",
      result: false,
      resultURL: "",
      blobImage: null,
      cropping: false,
      images: {},
      isLink: false,
      img: null,
      hasImage: false,
      urlFetched: false,
      linkUrl: "",
      linkImg: "",
      tempUrl: "",
      fetchingImage: false,
    };
  },
  methods: {
    async crop() {
      let canvas;
      let process = () => {
        this.cropping = true;
        canvas = this.$refs.clipper.clip();
        this.resultURL = canvas.toDataURL("image/jpeg", 1);
        this.uploadMenu = false;

        let img = this.getBlob(canvas.toDataURL("image/jpeg", 1));

        this.compress(img);

        this.cropping = false;
        this.result = true;
        this.clipper = false;
      };
      try {
        this.cropping = true;
        process();
      } catch (error) {
        this.$store.dispatch("set_snackbar", {
          show: true,
          type: "error",
          message: "Sorry. Invalid image",
        });
        this.cropping = false;
      }
    },
    async showClipper() {
      this.imgURL = this.linkImg;
      if (this.imageType(this.linkImg) == "gif") {
        let img = this.getBlob(this.linkImg);
        loadPcf(img);
        this.result = true;
        this.clipper = false;
        return;
      }
      this.tempUrl = this.linkUrl;
      this.linkUrl = "";
      this.isLink = true;
      this.clipper = true;
      this.cropping = false;
    },
    rotateLeft() {
      this.rotation -= 5;
    },
    rotateRight() {
      this.rotation += 5;
    },
    upload() {
      this.clipper = false;
      let data = {};
      this.isLink
        ? (data = { source: this.tempUrl })
        : (data = { source: "user" });
      if (this.type == "addItem") {
        this.$emit("save", { ...this.images, ...data });
        this.result = false;
      }
      this.$emit("upload", { ...this.images, ...data });
    },
    compress(img) {
      let minWidth, maxWidth;
      let that = this;

      if (this.type == "profile") {
        minWidth = 50;
        maxWidth = 500;
      } else if (this.type == "item" || this.type == "addItem") {
        minWidth = 250;
        maxWidth = 500;
      }
      new Compressor(img, {
        quality: 0.8,
        maxWidth: maxWidth,
        maxHeight: maxWidth,
        convertSize: 5000000,
        success(result) {
          that.images.high = result;
        },
        error(err) {},
      });
      new Compressor(img, {
        quality: 0.8,
        maxWidth: minWidth,
        maxHeight: minWidth,
        convertSize: 5000000,
        success(result) {
          that.images.low = result;
        },
        error(err) {},
      });
    },
    close() {
      this.linkUrl = "";
      this.imgURL = "";
      this.$emit("close");
    },
    uploadSuccess() {
      this.result = false;
      this.close();
    },
    b64toBlob(b64Data, contentType, sliceSize) {
      contentType = contentType || "";
      sliceSize = sliceSize || 512;

      var byteCharacters = atob(b64Data);
      var byteArrays = [];

      for (
        var offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
      }

      var blob = new Blob(byteArrays, { type: contentType });
      return blob;
    },
    getBlob(ImageURL) {
      // Split the base64 string in data and contentType
      let block = ImageURL.split(";");
      // Get the content type
      let contentType = block[0].split(":")[1]; // In this case "image/gif"
      // get the real base64 content of the file
      let realData = block[1].split(",")[1]; // In this case "iVBORw0KGg...."

      // Convert to blob
      let blob = this.b64toBlob(realData, contentType);
      return blob;
    },
    getSiteName(link) {
      let sliced = link.slice(link.indexOf("//") + 2);
      let result = sliced.slice(0, sliced.indexOf("/"));
      return result;
    },
    open() {
      this.uploadMenu = true;
    },
    showMenu() {
      if (!this.$store.getters.authenticated) {
        this.$store.dispatch("set_login", true);
        return;
      }
      this.uploadMenu = true;
    },
    async fetch() {
      if (!this.linkUrl || this.linkUrl.trim() === "") {
        return;
      }
      this.fetchingImage = true;
      let url = await fetch(
        "https://tvseriesjokesapi.herokuapp.com/api/v1/jokes/image?imageUrl=" +
          this.linkUrl
      );
      url
        .text()
        .then((text) => {
          this.linkImg = text;
          this.fetchingImage = false;
          this.urlFetched = true;
        })
        .catch((error) => {
          this.fetchingImage = false;
          console.log(error);
        });
    },
    imageType(link) {
      return link.slice(link.indexOf("/") + 1, link.indexOf(";"));
    },
  },
  watch: {
    linkUrl(val) {
      if (!val || val.trim() === "") {
        this.urlFetched = false;
        return;
      }
      this.fetch();
    },
  },
};
</script>

<style scoped>
.my-clipper {
  width: 100%;
  max-width: 400px;
}
@media (min-width: 600px) {
  .my-clipper {
    width: 50%;
  }
}
</style>
