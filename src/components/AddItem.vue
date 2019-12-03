<template>
  <div style="position:relative">
    <v-divider v-if="index > 0 && multi" class="mb-one"></v-divider>
    <v-layout class="px-1 mb-4" align-start>
      <div class="numeric-box" v-if="multi && numeral">
        <span>{{ parentLength + index + 1 }}</span>
      </div>
      <v-spacer></v-spacer>
      <v-icon
        @click="oneUp()"
        v-if="index > 0"
        class="mr-3"
        color="grey darken-2"
        >fa-chevron-up</v-icon
      >
      <v-icon @click="deleteItem()" class="close mr-2" color="grey darken-2"
        >fa-times</v-icon
      >
    </v-layout>
    <div style="position:relative">
      <p class="text-capitalize font-weight-medium grey--text text--darken-2">
        Name
      </p>
      <v-text-field
        @focus="showSearch = true"
        solo
        flat
        :rules="[rules.minLength(1, 'Item')]"
        color="brand"
        v-model="item.name"
        @keyup.delete="info = undefined"
        @blur="emitItem()"
      ></v-text-field>
      <div v-if="showSearch && item.name != ''" class="results elevation-3">
        <div
          class="pointer"
          @click="setInfo(result)"
          v-for="(result, index) in results"
          :key="index"
        >
          <v-layout>
            <v-avatar tile size="2.5em">
              <v-img
                v-if="result.data().image"
                :src="result.data().image.url.low"
                class="mr-4"
              ></v-img>
            </v-avatar>
            <div class="pl-1 pt-1">
              <v-layout>
                <span class="text-capitalize ptd" style="line-height:1em">{{
                  result.data().name
                }}</span>
              </v-layout>
              <v-layout>
                <span v-if="result.category" class="std">{{
                  result.data().category
                }}</span>
              </v-layout>
            </div>
          </v-layout>
        </div>
      </div>
    </div>
    <v-img
      class="mt-n4 mb-4"
      v-if="image"
      width="100px"
      aspect-ratio="1"
      :src="image.url.low"
    ></v-img>
    <div class="mt-n1">
      <p class="text-capitalize font-weight-medium grey--text text--darken-1">
        <v-icon color="grey darken-1" size="1.5em">fa-comment</v-icon
        >&nbsp;Comment
      </p>
      <v-textarea
        :placeholder="commentPlaceholder"
        solo
        flat
        rows="2"
        color="brand"
        no-resize
        auto-grow
        v-model="comment"
        @blur="emitComment()"
      ></v-textarea>
    </div>
  </div>
</template>

<script>
import Rules from "../rules";
import { setTimeout } from "timers";
export default {
  props: {
    parentLength: Number,
    index: {
      type: Number,
      default: 0
    },
    commentPlaceholder: {
      type: String,
      default: "[Optional] Tell us why you placed this item at this position"
    },
    propItem: {
      type: Boolean | Object,
      default: false
    },
    multi: {
      type: Boolean,
      default: true
    },
    numeral: {
      type: Boolean,
      default: true
    },
    rImage: {
      type: Boolean | Object,
      default: false
    }
  },
  data() {
    return {
      item: {
        name: "",
        info: undefined
      },
      comment: "",
      results: [],
      showSearch: true,
      image: this.rImage,
      rules: Rules,
      valid: false
    };
  },
  methods: {
    emitItem() {
      setTimeout(() => {
        if (this.item.info) {
          this.item = {
            image: this.image,
            ...this.item
          };
        } else {
          this.item = {
            keywords: this.generateKeywords(this.item.name.trim()),
            name: this.item.name,
            info: this.item.info
          };
        }
        this.$emit("receiveItem", this.index, this.item);
      }, 200);
    },
    emitComment() {
      this.$emit("receiveComment", this.index, this.comment);
    },
    deleteItem() {
      this.item.name = "";
      this.item.exists = false;
      this.comment = "";
      this.image = false;
      this.showSearch = false;
    },
    checkItem() {
      if (this.item.name.length < 3) {
        if (this.item.name.length == 0) {
          this.results = [];
        }
        return;
      }
      this.$store
        .dispatch("search_item", this.item.name.toLowerCase())
        .then(results => {
          this.results = results;
        });
    },
    async setInfo(result) {
      this.item.info = result.id;
      this.item.name = result.data().name;
      this.showSearch = false;
      if(result.data().image) { (this.image = result.data().image) }
    },
    oneUp() {
      this.$emit("oneUp", this.index);
    }
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
      this.item.info = this.propItem.info;
      this.keywords = this.propItem.keywords;
      this.comment = this.propItem.comment;
      this.image = this.propItem.image;
    }
  },
  created() {
    if (this.propItem) {
      this.item.name = this.propItem.name;
      this.item.info = this.propItem.info;
      this.keywords = this.propItem.keywords;
      this.comment = this.propItem.comment;
      this.image = this.propItem.image;
    }
  }
};
</script>

<style scoped>
.close-container {
  position: relative;
}
.close-button {
  right: 0.5em;
  top: 1em;
}
.close-button::after {
  content: "\00D7";
  font-size: 2em;
}
.close-button:hover {
  color: rgb(172, 5, 5);
  cursor: pointer;
}
.results {
  position: absolute;
  top: 90px;
  background: rgb(233, 233, 237);
  width: 100%;
  z-index: 3;
}
.results > div {
  padding: 1em 1.5em;
  /* border-left: 2px solid grey;
  border-right: 2px solid grey; */
}
.results > div:hover {
  background-color:rgb(223, 223, 226);
}
</style>
