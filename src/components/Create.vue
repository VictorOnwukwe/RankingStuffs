<template>
  <div id="main">
    <div style="margin:0 auto;max-width:600px">
      <div>
        <label for="list-title">Title</label>
        <input placeholder="List Title" type="text" v-model="list.title" />
      </div>

      <div class="item animated bounceIn" v-for="(item, index) in list.items" :key="index">
        <h3>Item {{index + 1}}</h3>
        <input type="file" accept="image/*" @change="onFileSelect" />
        <input placeholder="Item Title" type="text" v-model="list.items[index].title" />
        <textarea placeholder="About Item" v-model="list.items[index].about"></textarea>
      </div>

      <div v-if="list.items.length <= 9" id="plus-button">
        <v-icon @click="addItem()" large>mdi-plus-circle</v-icon>
      </div>

      <v-btn @click="upload()">Upload</v-btn>
      <v-btn @click="get()">get</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: {
        title: "Worthy Title",
        user_id: null,
        items: [
          {
            title: "",
            about: "",
            image: undefined
          }
        ]
      },

      imageUrl: null,
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
          window.scrollTo(0,document.querySelector('#main').scrollHeight);
        }, 1);
    }
  }
};
</script>

<style scoped>
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
  display: grid;
  grid-template-columns: 1fr;
  margin-top: 2em;
}

#plus-button {
  display: flex;
  margin: 1em 0;
  justify-content: center;
}
</style>
