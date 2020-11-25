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
        v-if="!image"
      ></upload-image>
      <v-icon v-if="index > 0" @click="oneUp()" class="ladder ml-5 grey--text"
        >$vuetify.icons.ladder</v-icon
      >
      <v-icon @click="deleteItem()" class="ml-5 mr-1 grey--text">fa-times</v-icon>
    </v-layout>
    <div style="position:relative">
      <p class="text-capitalize font-weight-medium grey--text text--darken-2">
        Name
      </p>
      <v-text-field
        @focus="showSearch = true"
        solo
        flat
        :rules="[rules.minLength(1, 'Item name'),rules.maxLength(50, 'Item name')]"
        color="brand"
        background-color="grey lighten-3"
        v-model="item.name"
        @paste="(item.info = null), (image = null)"
        @keyup="blurEmit()"
        :id="'item-name' + index"
        @keyup.enter="focus('item-comment' + index)"
        @blur="hideSearch()"
      ></v-text-field>
      <div v-show="showSearch && item.name != ''" class="results elevation-3 mt-2">
        <div class="pointer" v-for="(result, index) in results" :key="index">
          <searched-item @setInfo="setInfo" :rItem="result"></searched-item>
        </div>
      </div>
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
    <div class="mt-n1">
      <p class="text-capitalize font-weight-medium grey--text text--darken-1">
        Note / Comment
      </p>
      <v-textarea
        :placeholder="commentPlaceholder"
        solo
        flat
        rows="2"
        color="brand"
        background-color="grey lighten-3"
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
    propItem: {
      type: Boolean | Object,
      default: false,
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
            keywords: this.generateKeywords(this.item.name.trim()),
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
      this.item.name = "";
      this.comment = "";
      this.image = false;
      this.info = null;
      this.showSearch = false;
      this.userImage = false;
      this.displayImg = false;
      if (this.creation) {
        this.$emit("delete", this.index, this.valid);
      }
    },
    checkItem: _.debounce(function() {
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
      this.checkItem();
      val.length > 0 ? (this.valid = true) : (this.valid = false);
    },
    valid() {
      this.$emit("setValid", this.valid, this.index);
    },
    propItem() {
      this.item.name = this.propItem.name;
      this.item.info = this.propItem.info ? this.propItem.info : null;
      this.keywords = this.propItem.keywords;
      this.comment = this.propItem.comment;
      this.image = this.propItem.image;
    },
  },
  created() {
    if (this.propItem) {
      this.item.name = this.propItem.name;
      this.item.info = this.propItem.info;
      this.keywords = this.propItem.keywords;
      this.comment = this.propItem.comment;
      this.image = this.propItem.image;
    }
  },
};
</script>

<style scoped>
.results {
  position: absolute;
  top: 90px;
  background: rgb(233, 233, 237);
  width: 100%;
  z-index: 3;
}
.results > div {
  padding: 1em 1.5em;
}
.results > div:not(:last-child){
  border-bottom: 1px solid rgba(0, 0, 0,.1);
}
.results > div:hover {
  background-color: rgb(223, 223, 226);
}
.ladder {
  transform: scaleX(1.1);
}
</style>
