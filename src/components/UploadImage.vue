<template>
  <div>
    <v-btn v-if="btn" @click="uploadMenu = true" dark class="brand darken-1">Upload</v-btn>
    <v-icon v-if="icon" @click="uploadMenu = true" size="2em" color="accent">mdi-camera</v-icon>
    <v-dialog persistent v-model="uploadMenu" max-width="500px">
      <v-card class="pa-0">
        <v-card-title
          class="title font-weight-bold"
          style="position:sticky;z-index:2;top:0;background:#F4F4F4;border-bottom:1px solid grey"
        >
          Select Image
          <v-spacer></v-spacer>
          <v-icon class="close" @click="uploadMenu = false">mdi-close</v-icon>
        </v-card-title>
        <v-card-text class="mt-4">
          <v-text-field
            flat
            solo
            background-color="grey lighten-2"
            label="URL"
            placeholder="Enter URL"
          ></v-text-field>
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
      <v-card>
        <v-card-title
          class="title font-weight-bold"
          style="position:sticky;z-index:2;top:0;background:#F4F4F4;border-bottom:1px solid grey"
        >
          Edit Image
          <v-spacer></v-spacer>
          <v-icon class="close" @click="clipper = false">mdi-close</v-icon>
        </v-card-title>
        <v-card-text class="pa-2">
          <v-layout>
            <clipper-basic
              ref="clipper"
              class="my-clipper pr-1"
              :src="imgURL"
              :width="50"
              :ratio="1"
              :rotate="rotate"
              :initWidth="50"
              :initHeight="50"
              :bg-color="color"
              preview="my-preview"
            >
              <div class="mt-4 placeholder" slot="placeholder">No image</div>
            </clipper-basic>
            <clipper-preview name="my-preview" class="my-clipper pl-1">
              <div class="placeholder" slot="placeholder">preview area</div>
            </clipper-preview>
          </v-layout>
          <v-layout class="mt-2">
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
          <!-- <v-layout align-content-center justify-center>
            <v-radio-group label="Background:" row dense v-model="color">
              <v-radio color="brand" label="black" value="black"></v-radio>
              <v-radio color="brand" label="white" value="white"></v-radio>
            </v-radio-group>
          </v-layout> -->
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog max-width="500px" v-model="result">
      <v-card>
        <v-card-text class="pa-2">
          <v-img :src="resultURL"></v-img>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="result = false" outlined color="brand darken-1">Cancel</v-btn>
          <v-btn @click="upload()" dark color="brand darken-1">Upload</v-btn>
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
    }
  },
  data() {
    return {
      imgURL: "",
      uploadMenu: false,
      clipper: false,
      rotate: 0,
      color: "black",
      result: false,
      resultURL: "",
      resultImage: null,
      blobImage: null
    };
  },
  methods: {
    crop() {
      this.resultImage = this.$refs.clipper.clip();
      this.resultURL = this.resultImage.toDataURL("image/jpeg", 1);
      this.uploadMenu = false;
      this.resultImage.toBlob(blob => {
        this.blobImage = blob;
        this.result = true;
      });
    },
    rotateLeft() {
      this.rotate -= 10;
    },
    rotateRight() {
      this.rotate += 10;
    },
    upload() {
      this.clipper = false;
      this.$emit("upload", this.blobImage);
    }
  }
};
</script>

<style scoped>
.my-clipper {
  width: 50%;
}
</style>