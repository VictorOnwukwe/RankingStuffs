<template>
  <div>
    <div style="margin:0 auto;max-width:600px">
      <div>
        <label for="list-title">Title</label>
        <input placeholder="List Title" type="text" v-model="list.title" />
      </div>

      <div class="item">
        <h3>Item 1</h3>
        <input type="file" accept="image/*" @change="onFileSelect" />
        <input placeholder="Item Title" type="text" v-model="list.items[0].title" />
        <textarea placeholder="About Item" v-model="list.items[0].about"></textarea>
      </div>

      <div class="item">
        <h3>Item 2</h3>
        <input type="file" accept="image/*" @change="onFileSelect" />
        <input placeholder="Item Title" type="text" v-model="list.items[1].title" />        
        <textarea placeholder="About Item" v-model="list.items[1].about"></textarea>
      </div>
      <div class="item">
        <h3>Item 3</h3>
        <input type="file" accept="image/*" @change="onFileSelect" />
        <input placeholder="Item Title" type="text" v-model="list.items[2].title" />
        <textarea placeholder="About Item" v-model="list.items[2].about"></textarea>
      </div>
      <div class="item">
        <h3>Item 4</h3>
        <input type="file" accept="image/*" @change="onFileSelect" />
        <input placeholder="Item Title" type="text" v-model="list.items[3].title" />
        <textarea placeholder="About Item" v-model="list.items[3].about"></textarea>
      </div>
      <div class="item">
        <h3>Item 5</h3>
        <input type="file" accept="image/*" @change="onFileSelect" />
        <input placeholder="Item Title" type="text" v-model="list.items[4].title" />
        <textarea placeholder="About Item" v-model="list.items[4].about"></textarea>
      </div>
      <div class="item">
        <h3>Item 6</h3>
        <input type="file" accept="image/*" @change="onFileSelect" />
        <input placeholder="Item Title" type="text" v-model="list.items[5].title" />
        <textarea placeholder="About Item" v-model="list.items[5].about"></textarea>
      </div>
      <div class="item">
        <h3>Item 7</h3>
        <input type="file" accept="image/*" @change="onFileSelect" />
        <input placeholder="Item Title" type="text" v-model="list.items[6].title" />
        <textarea placeholder="About Item" v-model="list.items[6].about"></textarea>
      </div>
      <div class="item">
        <h3>Item 8</h3>
        <input type="file" accept="image/*" @change="onFileSelect" />
        <input placeholder="Item Title" type="text" v-model="list.items[7].title" />
        <textarea placeholder="About Item" v-model="list.items[7].about"></textarea>
      </div>
      <div class="item">
        <h3>Item 9</h3>
        <input type="file" accept="image/*" @change="onFileSelect" />
        <input placeholder="Item Title" type="text" v-model="list.items[8].title" />
        <textarea placeholder="About Item" v-model="list.items[8].about"></textarea>
      </div>
      <div class="item">
        <h3>Item 10</h3>
        <input type="file" accept="image/*" @change="onFileSelect" />
        <input placeholder="Item Title" type="text" v-model="list.items[9].title" />
        <textarea placeholder="About Item" v-model="list.items[9].about"></textarea>
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
            created: null,
            title: "Worthy Title",
            user_id: null,
            items: [
                {image:null, about:"This is a good boy", title:"boy"},
                {image:null, about:"This is a good boy", title:"boy"},
                {image:null, about:"This is a good boy", title:"boy"},
                {image:null, about:"This is a good boy", title:"boy"},
                {image:null, about:"This is a good boy", title:"boy"},
                {image:null, about:"This is a good boy", title:"boy"},
                {image:null, about:"This is a good boy", title:"boy"},
                {image:null, about:"This is a good boy", title:"boy"},
                {image:null, about:"This is a good boy", title:"boy"},
                {image:null, about:"This is a good boy", title:"boy"},
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

    async upload(){

        await this.$store.dispatch("upload_list", this.list);

        alert("Upload done");

        this.$router.go(-1);
    },

    async get(){

        this.$store.dispatch("fetch_complete_list", "aTXawHzZOZyEZAB7a3Cy").then(() => {
            console.log("done");
        });

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
</style>
