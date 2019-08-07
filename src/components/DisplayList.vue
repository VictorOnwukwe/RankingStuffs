<template>
  <div>
    <div v-if="fetched" id="container">
      <div style="position:relative">
      <h2>{{list.title}}</h2>
      <v-icon class="dots">mdi-dots-vertical</v-icon>
      <div class="list-menu">
        <button @click="favoriteList()">Favorite</button>
        <button @click="favoriteList()">Report</button>
      </div>
      </div>

      <div v-for="(item, index) in list.items" :key="index">
        <Item :item="item" :list="list"></Item>
        <div class="divide" v-if="index===9"></div>
      </div>

      <div style="margin-top:2em">Didn't find your favorite? Add to the voting list to make them stand a chance to appear in the voting list.</div>

      <div class="item animated bounceIn" v-for="(item, index) in items" :key="item.id">
        <div class="close-container" v-if="index>0 || items.length>1" @click="deleteItem(index)">
          <v-icon class="close-button" size="18">mdi-close</v-icon>
        </div>
        <h3>Item {{list.items.length +index + 1}}</h3>
        <input type="file" accept="image/*" @change="onFileSelect" />
        <input placeholder="Item Title" type="text" v-model="items[index].title" />
        <textarea placeholder="Tell your viewers why you placed this item here" v-model="items[index].about"></textarea>
      </div>

      <div id="plus-button">
        <v-icon @click="addItem()" large>mdi-plus-circle</v-icon>
      </div>

      <v-btn @click="upload_item()">Submit</v-btn>
    </div>
  </div>
</template>

<script>
import { setTimeout } from "timers";
import Item from "./Item";

export default {
  components: {
    Item
  },
  data() {
    return {
      index: null,
      list: null,
      items: [
        {
          title: "",
          about: "",
          image: undefined
        }
      ],
      fetched: false,
      n: 0
    };
  },

  methods: {
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
      this.items[this.n].image = files[0];
      this.n++;
    },

    addItem() {
      this.items.push({
        title: "",
        about: "",
        image: undefined
      });

      setTimeout(() => {
        window.scrollTo(0, document.querySelector("#main").scrollHeight);
      }, 1);
    },

    upload_item() {
      for (let item of this.items) {
        this.$store.dispatch("add_list_item", {
          list_id: this.listID,
          item: {
            votes: 1,
            ...item
          }
        });
      }
    },

    async fetchList() {
      await this.$store
        .dispatch("fetch_complete_list", this.$route.params.id)
        .then(list => {
          this.list = list;
          setTimeout(() => {
            this.fetched = true;
          }, 1000);
        }).catch(error => {
          console.log(error);
        })
    },

    async favoriteList(){
      this.$store.dispatch("add_favorite", {
        list_id: this.listID,
        list_title: this.list.title,
        preview_image: this.list.items[0].image
      })
    },

    deleteItem(index){
      this.items.splice(index,1);
    }
  },

  computed: {
    listID() {
      return this.$route.params.id;
    },
    getDate() {
      return this.list.created.toDate();
    }
  },

  mounted: async function() {
    this.fetchList();
  }
};
</script>

<style scoped>
#container {
  max-width: 800px;
  margin: 0 auto;
}
#item {
  margin-top: 2em;
}

#plus-button {
  display: flex;
  margin: 1em 0;
  justify-content: center;
}

.item {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  margin-top: 2em;
}

input {
  border: 1px solid black;
  display: block;
  margin-top: 0.3em;
}

textarea {
  border: 1px solid black;
  margin-top: 0.3em;
  resize: none;
  height: 10em;
}

.divide {
  display: block;
  height: 1em;
  background-color: grey;
  margin-top: 1em;
}

.close-container{
  display:none;
}
.item:hover .close-container{
  display: block;
}
.close-button{
  position: absolute;
  right: 3px;
  top: 7px
}
.close-button:hover{
  color: rgb(172, 5, 5);
  cursor: pointer;
}

.dots{
  position: absolute;
  top: 3px;
  right: 0px;
  border-radius: 50%;
  color: black;
  padding: 3px;
}
.dots:hover{
  background-color: white;
  cursor: pointer;
}

.list-menu{
  position: absolute;
  right: 0px;
  top: 38px;
  z-index: 2;
}
.list-menu button{
  display: block;
  background-color: grey;
  padding: 0.8em 4em;
  transition: all 0.1s linear;
}
.list-menu button:hover{
  transform: translateX(3px)
}
</style>
