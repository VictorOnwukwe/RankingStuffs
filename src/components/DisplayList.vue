<template>
  <div>
    <div id="container">
      <h2>{{list.title}}</h2>

      <p>{{list.created}}</p>

      <div v-for="(item, index) in list.items" :key="index">
        <Item :item="item" :list_id="list.id"></Item>
        <div class="divide" v-if="index===9">
        </div>
      </div>

      <div>Didn't find your favorite? Add to the voting list to make them stand a chance to appear in the voting list</div>

      <div class="item animated bounceIn" v-for="(item, index) in items" :key="item.id">
          <h3>Item {{list.items.length +index + 1}}</h3>
          <input type="file" accept="image/*" @change="onFileSelect" />
          <input placeholder="Item Title" type="text" v-model="items[index].title" />
          <textarea placeholder="About Item" v-model="items[index].about"></textarea>
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
      items: [
        {
          title: "",
          about: "",
          image: undefined
        }
      ],
      n: 0
    };
  },

  methods: {
    fetchList() {},

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
    }
  },

  computed: {
    listID() {
      return this.$route.params.id;
    },
    getDate() {
      return this.list.created.toDate();
    },
    list() {
      return this.$store.state.list;
    }
  },

  mounted: async function() {
    this.$store.dispatch("fetch_complete_list", this.$route.params.id);
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

.divide{
    display: block;
    height: 1em;
    background-color: grey;
    margin-top: 1em;
}

</style>
