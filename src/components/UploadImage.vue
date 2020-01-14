<template>
  <div>
    <m-btn v-if="btn" @click="uploadMenu = true">Upload</m-btn>
    <v-icon
      v-if="icon"
      @click="uploadMenu = true"
      size="2em"
      :color="actionColor"
      >mdi-camera</v-icon
    >
    <v-dialog persistent v-model="uploadMenu" max-width="500px">
      <v-card class="pa-0">
        <v-card-title
          class="title font-weight-bold brand lighten-2 white--text"
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
              v-model="imgURL"
              clearable
            ></v-text-field>
            <v-icon
              :disabled="imgURL == ''"
              @click="(isLink = true), (clipper = true)"
              :color="imgURL !== '' ? 'green' : ''"
              style="margin-top:-0.7em;margin-left:0.2em"
              large
              >mdi-check-circle</v-icon
            >
          </v-layout>
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
          class="title font-weight-bold brand lighten-2 white--text"
        >
          Edit Image
          <v-spacer></v-spacer>
          <v-icon
            class="close"
            @click="(clipper = false), (isLink = false), (imgURL = ''), close()"
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
          class="title font-weight-bold brand lighten-2 white--text"
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
              :max-width="'250px'"
              :src="resultURL"
            ></v-img>
          </v-layout>
          <alert
            class="mt-4"
            :type="'success'"
            :value="uploading == false"
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
import imageCompressor from "vue-image-compressor";
import ImageUploader from "vue-image-upload-resize";
import Compressor from "compressorjs";
import {
  clipperPreview,
  clipperUpload,
  clipperBasic,
  clipperFixed
} from "vuejs-clipper";

export default {
  components: {
    "clipper-basic": clipperBasic,
    "clipper-preview": clipperPreview,
    "clipper-upload": clipperUpload,
    "clipper-fixed": clipperFixed,
    imageCompressor,
    ImageUploader
  },
  props: {
    btn: {
      type: Boolean,
      default: false
    },
    icon: {
      type: Boolean,
      default: true
    },
    actionColor: {
      type: String,
      default: "accent"
    },
    uploading: {
      type: Boolean,
      default: undefined
    },
    successMessage: {
      type: String,
      default: "Upload Successful!"
    },
    type: {
      type: String,
      default: "profile"
    }
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
      imgLink: "",
      isLink: false,
      img: null,
      hasImage: false
    };
  },
  methods: {
    async crop() {
      this.cropping = true;
      let canvas = await this.$refs.clipper.clip();
      this.resultURL = canvas.toDataURL("image/jpeg", 1);
      this.uploadMenu = false;

      let img = this.getBlob(canvas.toDataURL("image/jpeg", 1));
      let that = this;
      let minWidth, maxWidth;

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
        error(err) {
          console.log(err.message);
        }
      });
      new Compressor(img, {
        quality: 0.8,
        maxWidth: minWidth,
        maxHeight: minWidth,
        convertSize: 5000000,
        success(result) {
          that.images.low = result;
        },
        error(err) {
          console.log(err.message);
        }
      });
      this.cropping = false;
      this.result = true;
      this.clipper = false;
    },
    rotateLeft() {
      this.rotation -= 5;
    },
    rotateRight() {
      this.rotation += 5;
    },
    upload() {
      this.clipper = false;
      if (this.type == "addItem") {
        this.$emit("save", this.images);
        this.result = false;
      }
      let data = {};
      this.isLink
        ? (data = { source: this.imgURL })
        : (data = { source: "user" });
      this.$emit("upload", { image: this.images, ...data });
    },
    close() {
      this.$emit("close");
    },
    uploadSuccess() {
      this.result = false;
      this.close();
      this.$router.go();
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
    ext() {
      console.log(this.imgURL);
    },
    getSiteName(link) {
      let sliced = link.slice(link.indexOf("//") + 2);
      let result = sliced.slice(0, sliced.indexOf("/"));
      return result;
    },
    open() {
      this.uploadMenu = true;
    }
  },
  created() {}
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
