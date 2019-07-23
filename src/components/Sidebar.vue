<template>
  <div id="main">
    <div id="sidebar">
        <div id="trending" class="sidebar-element">
            <h3>Popular</h3>
            <v-divider></v-divider>
            <p>Top ten biggest men in the world</p>
            <p>Top ten biggest men in the world</p>
            <p>Top ten biggest men in the world</p>
            <p>Top ten biggest men in the world</p>
            <p>Top ten biggest men in the world</p>
        </div>

        <div id="latest" class="sidebar-element">
            <h3>Popular</h3>
            <v-divider></v-divider>
            <p>Top ten biggest men in the world</p>
            <p>Top ten biggest men in the world</p>
            <p>Top ten biggest men in the world</p>
            <p>Top ten biggest men in the world</p>
            <p>Top ten biggest men in the world</p>
        </div>

        <div id="rending" class="sidebar-element">
            <h3>Popular</h3>
            <v-divider></v-divider>
            <p>Top ten biggest men in the world</p>
            <p>Top ten biggest men in the world</p>
            <p>Top ten biggest men in the world</p>
            <p>Top ten biggest men in the world</p>
            <p>Top ten biggest men in the world</p>
        </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>

#main{
    float: left;
}

#sidebar{
    width: 16em;
    height: auto;
    margin-left: 2em;
    margin-right: 1em;
}

#sidebar div+div{
    margin-top: 1em;
}

.sidebar-element{
    background-color: hsl(0, 0%, 90%);
    padding: 1em;
    border-radius: 0.5em;
    font-size: 0.8em;
}

.sidebar-element h3{
    text-align: center;
}

</style>


