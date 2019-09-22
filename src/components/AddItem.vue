<template>
  <div style="position:relative">
    <v-layout class="mb-3 pa-1">
      <div class="numeric-box" v-if="['list-display'].indexOf($route.name) < 0">
        <span>{{parentLength + index + 1}}</span>
      </div>
      <v-spacer></v-spacer>
      <v-icon @click="deleteItem()">close</v-icon>
    </v-layout>
    <div style="position:relative">
      <v-text-field label="Name" @focus="showSearch = true" outlined color="brand" v-model="item.name" @blur="emitItem(false)"></v-text-field>
      <div v-if="showSearch" class="results">
      <div class="pointer" @click="setInfo(result)" v-for="(result, index) in results" :key="index">
        <v-layout>
          <v-img v-if="result.image" :src="result.image" max-width="70px" aspect-ratio="1" class="mr-4"></v-img>
          <div>
          <span class="text-capitalize primary-text-dark" style="font-size:1.5em">{{result.name}}</span><br>
          <span v-if="result.category" class="secondary-text-dark font-weight-bold">{{result.category}}</span>
          </div>
        </v-layout>
      </div>
    </div>
    </div>
    <v-img class="mt-n4 mb-6" v-if="image" width="100px" aspect-ratio="1" :src="image"></v-img>
    <div class="mt-n3">
      <v-textarea
        label="Comment"
        placeholder="[Optional] Tell us why you placed this item at this position"
        outlined
        no-resize
        color="brand"
        prepend-inner-icon="mdi-comment"
        v-model="comment"
        @blur="emitComment()"
      ></v-textarea>
    </div>
  </div>
</template>

<script>
import keyword from "../../public/my-modules/generateKeywords";
import { setTimeout } from 'timers';
export default {
  props: {
    parentLength: Number,
    index: Number
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
      image: false
    };
  },
  methods: {
    emitItem() {
      setTimeout(() => {
      if(this.item.info !== undefined){
        console.log("okay")
      }else{
        this.item = {keywords: keyword.generateKeywords(this.item.name), ...this.item};
      }
        this.$emit("receiveItem", this.index, this.item, this.image);
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
    checkItem(){
      // console.log(this.item.name);
      this.$store.dispatch("search_item", this.item.name).then(results => {
        this.results = results;
      })
    },
    async setInfo(result){
      this.item.info = result.id
      this.item.name = result.name;
      this.showSearch = false;
      result.image ? this.image = result.image : this.image = false;
    }
  },

  watch: {
    "item.name"(){
      this.checkItem()
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
.results{
  position:absolute;
  top: 60px;
  background: rgb(233, 233, 237);
  width: 100%;
  z-index:2;
}
.results>div{
  padding: 1em 1.5em;
  /* border-left: 2px solid grey;
  border-right: 2px solid grey; */
}
.results>div:hover{
  background: rgb(202, 213, 248)
}
</style>