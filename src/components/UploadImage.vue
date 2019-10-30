<template>
  <div>
    <v-btn v-if="btn" @click="uploadMenu = true" dark class="brand darken-1">Upload</v-btn>
    <v-icon v-if="icon" @click="uploadMenu = true" size="2em" :color="actionColor">mdi-camera</v-icon>
    <v-dialog persistent v-model="uploadMenu" max-width="500px">
      <v-card class="pa-0">
        <v-card-title
          class="title font-weight-bold"
          style="position:sticky;z-index:2;top:0;background:#F4F4F4;border-bottom:1px solid grey"
        >
          Select Image
          <v-spacer></v-spacer>
          <v-icon class="close" @click="uploadMenu = false, close()">fa-times</v-icon>
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
            ></v-text-field>
            <v-icon
              :disabled="imgURL == ''"
              @click="isLink = true, clipper = true"
              :color="imgURL !== '' ? 'green' : ''"
              style="margin-top:-0.7em;margin-left:0.2em"
              large
            >mdi-check-circle</v-icon>
          </v-layout>
          <v-layout column align-center>
            <div class="mb-4">OR</div>
            <clipper-upload :accept="'image/*'" v-model="imgURL" @input="clipper = true">
              <v-btn color="brand darken-1" dark depressed>Upload</v-btn>
            </clipper-upload>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog persistent v-model="clipper" max-width="600px">
      <v-card :loading="cropping">
        <v-card-title
          class="title font-weight-bold"
          style="position:sticky;z-index:2;top:0;background:#F4F4F4;border-bottom:1px solid grey"
        >
          Edit Image
          <v-spacer></v-spacer>
          <v-icon class="close" @click="clipper = false, close()">fa-times</v-icon>
        </v-card-title>
        <v-card-text class="pa-2">
          <v-layout>
            <clipper-basic
              ref="clipper"
              class="my-clipper pr-1"
              :src="imgURL"
              :width="50"
              :ratio="1"
              :rotate="rotation"
              :initWidth="50"
              :initHeight="50"
              :bg-color="color"
              preview="my-preview"
            >
              <div class="mt-4 placeholder" slot="placeholder">No image</div>
            </clipper-basic>
            <clipper-preview name="my-preview" class="my-clipper my-preview pl-1">
              <div class="placeholder" slot="placeholder">preview area</div>
            </clipper-preview>
          </v-layout>
          <v-layout class="my-3">
            <v-flex xs4>
              <v-layout column align-center>
                <v-icon @click="rotateRight()">mdi-rotate-right</v-icon>
                <div @click="rotateRight()" class="secondary-text-dark caption pointer">rotate-right</div>
              </v-layout>
            </v-flex>
            <v-flex xs4>
              <v-layout column align-center>
                <v-icon @click="crop()">mdi-crop</v-icon>
                <div @click="crop()" class="secondary-text-dark caption pointer">Crop</div>
              </v-layout>
            </v-flex>
            <v-flex xs4>
              <v-layout column align-center>
                <v-icon @click="rotateLeft()">mdi-rotate-left</v-icon>
                <div @click="rotateLeft()" class="secondary-text-dark caption pointer">rotate-left</div>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex>
              <v-layout align-content-center justify-center>
                <label for="background">Background Color:&nbsp;</label>
                <input class="ml-4 mr-1 mt-1" type="radio" id="black" value="black" v-model="color" />
                <label for="black">Black</label>
                <input class="ml-4 mr-1 mt-1" type="radio" id="white" value="white" v-model="color" />
                <label for="white">White</label>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog max-width="500px" v-model="result">
      <v-card>
        <v-card-text class="pa-2">
          <v-img :src="resultURL"></v-img>
          <alert
            class="mt-4"
            :type="'success'"
            :value="uploading == false"
            :message="successMessage"
            @act="uploadSuccess()"
          ></alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="result = false" outlined color="brand darken-1">Cancel</v-btn>
          <v-btn :loading="uploading" @click="upload()" dark color="brand darken-1">Upload</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
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
    "clipper-fixed": clipperFixed
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
      isLink: false
    };
  },
  methods: {
    async crop() {
      this.cropping = true;
      let canvas = await this.$refs.clipper.clip();
      console.log(canvas);
      if (!this.isLink) {
        this.resultURL = canvas.toDataURL("image/jpeg", 1);
        this.uploadMenu = false;
        this.images.low = this.getBlob(canvas.toDataURL("image/jpeg", 0.2));
        this.images.high = this.getBlob(canvas.toDataURL("image/jpeg", 1));
      } else {
        this.resultURL = canvas.toDataURL("image/jpeg", 1);
        console.log("result", this.resultURL);
        this.images.low = canvas.getBlob();
        this.images.high = canvas.blobImage();
      }
      this.cropping = false;
      this.result = true;
    },
    rotateLeft() {
      this.rotation -= 5;
    },
    rotateRight() {
      this.rotation += 5;
    },
    upload() {
      this.clipper = false;
      this.$emit("upload", this.images);
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
      console.log(blob);
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
    }
  }
};
</script>

<style scoped>
.my-clipper {
  width: 50%;
}
</style>