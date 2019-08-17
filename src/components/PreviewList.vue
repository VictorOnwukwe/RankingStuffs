<template>
  <div id="main">
    <div id="image-display">
      <img :src="list.preview_image" />
    </div>
    <div id="list-details">
      <a @click="goList()" class="links" style="color:var(--dark-text)">
        <h3 id="list-title">{{list.title}}</h3>
      </a>
      <span style="line-height: 1em" v-for="i in 3" :key="i">{{i}}. Name<br></span>
    </div>
  </div>
</template>

<script>
let moment = require("moment");

export default {
  props: {
    list: Object
  },
  methods: {
    goList() {
      this.$router.push({ path: "/lists/" + this.list.id });
    }
  },
  computed: {
    creationDate() {
      let time = moment(this.list.created.toDate()).fromNow();
      return time.slice(0, time.indexOf(" ") + 2).replace(/\s/g, "");
    }
  }
};
</script>

<style scoped>
img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 0.2em;
}
#image-display {
  margin-right: 1em;
}
#list-title{
    font-size: 1.5em;
}
.clear-float {
  clear: both;
}
#main {
  padding: 1em;
  border-radius: 0.2em;
  display: flex;
}
</style>
