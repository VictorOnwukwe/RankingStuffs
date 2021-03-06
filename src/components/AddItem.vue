<template>
  <div style="position:relative">
    <v-divider v-if="index > 0 && multi" class="mb-one"></v-divider>
    <v-layout class="px-1 mb-4" align-start>
      <div class="numeric-box" v-if="multi && numeral">
        <span>{{ parentLength + index + 1 }}</span>
      </div>
      <v-spacer></v-spacer>
      <upload-image
        @save="setImage"
        :type="'addItem'"
        v-if="!image && !creation"
      ></upload-image>
      <v-icon
        v-if="index > 0"
        @click="oneUp()"
        class="ladder ml-5"
        color="grey darken-1"
        >$vuetify.icons.ladder</v-icon
      >
      <v-icon @click="deleteItem()" class="ml-5 mr-1" color="grey darken-1"
        >fa-times</v-icon
      >
    </v-layout>
    <div style="position:relative">
      <v-form ref="form">
        <v-text-field
          @focus="showSearch = true"
          outlined
          flat
          label="Name*"
          :rules="[
            rules.minLength(1, 'Item name'),
            rules.maxLength(50, 'Item name'),
          ]"
          color="brand"
          v-model="item.name"
          @paste="(item.info = null), (image = null)"
          @keyup="blurEmit()"
          :id="'item-name' + index"
          @keyup.enter="focus('item-comment' + index)"
          @blur="hideSearch()"
        ></v-text-field
      ></v-form>
      <transition name="slide-up">
        <div
          v-show="showSearch && item.name.length > 2"
          class="elevation-5 search-menu"
        >
          <v-layout v-if="checkingItem" justify-center>
            <m-progress class="my-4" :color="'grey darken-2'"></m-progress>
          </v-layout>
          <div v-else style="max-height: 300px;overflow-y:scroll">
            <div
              class="pointer results"
              v-for="(result, index) in results"
              :key="index"
            >
              <searched-item @setInfo="setInfo" :rItem="result"></searched-item>
            </div>
          </div></div
      ></transition>
    </div>
    <v-img
      class="mt-n4 mb-4"
      v-if="image"
      width="150px"
      :src="image.url.low"
    ></v-img>
    <v-img
      v-if="displayImg"
      class="mt-n4 mb-4"
      width="150px"
      :src="displayImg"
    ></v-img>
    <div>
      <v-textarea
        :placeholder="commentPlaceholder"
        flat
        rows="4"
        color="brand"
        label="Note / Comment"
        outlined
        no-resize
        auto-grow
        v-model="comment"
        @blur="emitComment()"
        :id="'item-comment' + index"
      ></v-textarea>
    </div>
  </div>
</template>

<script>
import UploadImage from "./UploadImage";
import SearchedItem from "./SearchedItem";
import Rules from "../rules";
import { setTimeout } from "timers";
let _ = require("lodash");
export default {
  components: {
    UploadImage,
    SearchedItem,
  },
  props: {
    parentLength: Number,
    index: {
      type: Number,
      default: 0,
    },
    commentPlaceholder: {
      type: String,
      default: "[Optional] Tell us why you placed this item at this position",
    },
    multi: {
      type: Boolean,
      default: true,
    },
    numeral: {
      type: Boolean,
      default: true,
    },
    creation: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      item: {
        name: "",
        info: null,
      },
      comment: "",
      results: null,
      showSearch: true,
      image: undefined,
      rules: Rules,
      valid: false,
      userImage: undefined,
      displayImg: false,
      checkingItem: true,
    };
  },
  methods: {
    blurEmit: _.debounce(function() {
      this.image = null;
      this.item.info = null;
      this.emitItem();
    }, 400),
    hideSearch() {
      setTimeout(() => {
        this.showSearch = false;
      }, 1000);
    },
    emitItem() {
      setTimeout(() => {
        if (this.item.info) {
          let other = {};
          if (this.image) {
            other = { image: this.image };
          }
          this.item = {
            ...other,
            ...this.item,
            isLink: true,
          };
        } else {
          let data = {};
          if (this.userImage) {
            data = { userImage: this.userImage };
          }
          this.item = {
            name: this.item.name,
            isLink: false,
            ...data,
          };
        }
        this.$emit("receiveItem", this.index, this.item);
      }, 1000);
    },
    emitComment() {
      this.$emit("receiveComment", this.index, this.comment);
    },
    deleteItem() {
      this.$refs.form.reset();
      this.comment = "";
      this.image = false;
      this.item.info = null;
      this.showSearch = false;
      this.userImage = false;
      this.displayImg = false;
      if (this.creation) {
        this.$emit("delete", this.index, this.valid);
      }
    },
    checkItem: _.debounce(function() {
      if (!this.item.name) return;
      if (this.item.name.length < 3) {
        if (this.item.name.length == 0) {
          this.results = [];
        }
        return;
      }
      this.$store
        .dispatch("search_item", this.item.name.toLowerCase())
        .then((results) => {
          this.results = results;
          this.checkingItem = false;
        });
    }, 2000),
    setInfo(result) {
      new Promise((resolve) => {
        this.userImage = false;
        this.item.isLink = true;
        this.item.info = result.id;
        this.item.name = result.name;
        this.showSearch = false;
        if (result.image) {
          this.image = result.image;
        }
        resolve(true);
      }).then(() => {
        this.emitItem();
      });
    },
    oneUp() {
      this.$emit("oneUp", this.index);
    },
    setImage(obj) {
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
          this.userImage = {
            ...data,
            source: obj.source,
            user: {
              id: this.$store.getters.getUser.id,
              username: this.$store.getters.getUser.username,
            },
          };
          this.emitItem();
          this.emitComment();
        };
      }, 500);
    },
    focus(elem) {
      document.querySelector("#" + elem).focus();
    },
  },
  watch: {
    "item.name"(val) {
      this.checkingItem = true;
      this.checkItem();
      val && val.length > 0 ? (this.valid = true) : (this.valid = false);
    },
    valid() {
      this.$emit("setValid", this.valid, this.index);
    },
  },
  created() {
    if (this.propItem) {
      this.item.name = this.propItem.name;
      this.item.info = this.propItem.info;
      this.comment = this.propItem.comment;
      this.image = this.propItem.image;
    }
  },
};
</script>

<style scoped>
.search-menu {
  position: absolute;
  top: 75%;
  background: rgb(233, 233, 237);
  width: 100%;
  z-index: 3;
}
.search-menu .results {
  padding: 1em 1.5em;
}
.search-menu .results:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.search-menu .results:hover {
  background-color: rgb(223, 223, 226);
}
.ladder {
  transform: scaleX(1.1);
}
</style>
