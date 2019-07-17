<template>
  <div id="main">
    <div class="cover">
      <h1>Naija Top Ten</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",

  data(){
    return{

    }
  },

  methods: {

  }
};
</script>

<style scoped>
#main{
  margin-top: 0;
}

.cover{
  background-image: url('./bear.jpg');
  background-size: 200px 100%;
  background-repeat: repeat;
  text-align: center;
}

.cover>h1{
  font-size: 80px;
}

</style>

