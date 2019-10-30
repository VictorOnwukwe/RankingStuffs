<template>
  <div style="position:relative">
    <v-divider v-if="index > 0 || !multi"></v-divider>
    <v-layout class="mb-3 pa-1">
      <div class="numeric-box" v-if="multi">
        <span>{{parentLength + index + 1}}</span>
      </div>
      <v-spacer></v-spacer>
      <v-icon
        @click="oneUp()"
        v-if="index > 0"
        large
        class="mr-2"
        color="grey darken-2"
      >mdi-chevron-up</v-icon>
      <v-icon @click="deleteItem()" class="close mr-2" color="grey darken-2">close</v-icon>
    </v-layout>
    <div style="position:relative">
      <p class="text-capitalize font-weight-medium grey--text text--darken-2">Name</p>
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
      <div v-if="showSearch" class="results">
        <div
          class="pointer"
          @click="setInfo(result)"
          v-for="(result, index) in results"
          :key="index"
        >
          <v-layout>
            <v-img
              v-if="result.image"
              :src="result.image.url.low"
              max-width="70px"
              aspect-ratio="1"
              class="mr-4"
            ></v-img>
            <div>
              <span
                class="text-capitalize primary-text-dark"
                style="font-size:1.5em"
              >{{result.name}}</span>
              <br />
              <span
                v-if="result.category"
                class="secondary-text-dark font-weight-bold"
              >{{result.category}}</span>
            </div>
          </v-layout>
        </div>
      </div>
    </div>
    <v-img class="mt-n4 mb-6" v-if="image" width="100px" aspect-ratio="1" :src="image.url.low"></v-img>
    <div class="mt-n1">
      <p class="text-capitalize font-weight-medium grey--text text--darken-1">
        <v-icon color="grey darken-1" size="1.5em">fa-comment</v-icon>&nbsp;Comment
      </p>
      <v-textarea
        :placeholder="commentPlaceholder"
        solo
        flat
        no-resize
        color="brand"
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
    index: Number,
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
      image: false,
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
            keywords: this.generateKeywords(this.item.name),
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
      this.item.name = result.name;
      this.showSearch = false;
      result.image ? (this.image = result.image) : (this.image = false);
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
  top: 60px;
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
  background: rgb(202, 213, 248);
}
</style>