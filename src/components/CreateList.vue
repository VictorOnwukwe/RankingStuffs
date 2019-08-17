<template>
  <div id="main">
    <div id="container">
    <div>
      <Sidebar></Sidebar>
    </div>
    <div style="margin:0 auto;max-width:600px; flex-grow:1;margin-bottom:2em">
      <div>
        <v-text-field background-color="blue" outlined label="Title" v-model="list.title"></v-text-field>
      </div>

      <div>
        <v-textarea no-resize :rows="6" outlined label="About List" background-color="brand" v-model="list.about" style="width:100%"></v-textarea>
      </div>

      <div class="item" v-for="(item, index) in list.items" :key="index">
        <div class="close-container" v-if="index>0||list.items.length>1" @click="deleteItem(index)">
          <v-icon class="close-button">mdi-close</v-icon>
        </div>
        <h3>Item {{index + 1}}</h3>
        <input type="file" accept="image/*" @change="onFileSelect" style="margin-bottom:2em" />
        <v-text-field label="Item Title" outlined color="accent" v-model="list.items[index].title"></v-text-field>
        <v-textarea label="About Item" outlined no-resize color="accent" v-model="list.items[index].about"></v-textarea>
      </div>

      <div v-if="list.items.length <= 9" id="plus-button">
        <v-icon @click="addItem()" large>mdi-plus-circle</v-icon>
      </div>

      <v-btn @click="upload()">Upload</v-btn>
      <v-btn @click="get()">get</v-btn>
    </div>
    </div>
  </div>
</template>

<script>
import Toolbar from "./Toolbar";
import Sidebar from "./Sidebar";
export default {
  components: {
    Toolbar,
    Sidebar
  },
  data() {
    return {
      list: {
        title: "Worthy Title",
        about: "About List",
        items: [
          {
            title: "",
            about: "",
            image: undefined
          }
        ]
      },
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

      let imageUrl;

      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        imageUrl = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.list.items[this.n].image = files[0];
      this.n++;
    },

    async upload() {
      await this.$store.dispatch("upload_list", this.list);

      alert("Upload done");

      this.$router.go(-1);
    },

    async get() {
      this.$store
        .dispatch("fetch_complete_list", "aTXawHzZOZyEZAB7a3Cy")
        .then(() => {
          console.log("done");
        });
    },

    addItem() {
      this.list.items.push({
        title: "",
        about: "",
        image: undefined
      });

      setTimeout(() => {
        window.scrollTo(0, document.querySelector("#main").scrollHeight);
      }, 1);
    },

    deleteItem(index) {
      this.list.items.splice(index, 1);
    }
  }
};
</script>

<style scoped>
#container{
  display: flex;
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

.item {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  margin-top: 2em;
}

#plus-button {
  display: flex;
  margin: 1em 0;
  justify-content: center;
}

.close-container {
  display: none;
}
.item:hover .close-container {
  display: block;
}
.close-button {
  position: absolute;
  right: 2px;
}
.close-button:hover {
  color: rgb(172, 5, 5);
  cursor: pointer;
}
</style>
