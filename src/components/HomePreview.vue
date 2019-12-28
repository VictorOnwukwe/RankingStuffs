<template>
  <div>
    <div class="top-view">
      <div class="overlay">
        <div class="foreground">
          <h1 class="white--text">top<span class="white--text font-weight-black">TEN</span></h1>
          <p class="ptd text-center">
            It's the Universe... And It's
            <span class="ptd font-weight-black">YOU</span> and US, Building a Repository for Everything Top Ten In it...
          </p>
          <!-- <div class="search-container mt-4">
            <input type="text" placeholder="Looking for something...?" class="search" />
            <v-icon
              size="1.2em"
              style="position:absolute; right:0.5em; top:0.7em"
              color="grey"
            >fa-search</v-icon>
          </div> -->
          <div class="display-container">
            <div class="display create">
              <h3 class="header">Create</h3>
              <p
                class="description ptd text-center"
              >Create Lists, Respond to people's demands...</p>
            </div>
            <div class="display demand">
              <h3 class="header">Demand</h3>
              <p
                class="description ptd text-center"
              >Want a List? Place it on demand...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  
};
</script>

<style scoped>
.top-view {
  background-image: url("../../public/background3.jpg");
  width: calc(100% + 1em);
  margin-left: -0.5em;
  height: 80vh;
  background-size: 100% auto;
  background-position: top right;
}
.overlay {
  background: rgba(0, 0, 0, 0.3);
  height: 80vh;
  display: flex;
  align-content: center;
  justify-content: center;
  padding: 6.5em 2em 3em 2em;
}
.foreground {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.search-container {
  width: 90%;
  max-width: 420px;
  position: relative;
}
.search {
  width: 100%;
  border: 1px solid white;
  height: 45px;
  border-radius: 0.3em;
  /* color: white; */
  padding: 0.2em 0.5em;
  background-color: white;
}
.display-container {
  width: 100%;
  /* background-color: white; */
  margin-top: 2em;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1em;
  max-width: 600px;
}
.display {
  width: 100%;
  /* border: 1px solid var(--accent); */
  padding: 1em;
  background-color: rgba(0, 0, 0, 0);
  border-radius: 0.3em;
}
.header {
  color: white;
  text-align: center;
  font-size: 1.4em;
  border-bottom: 2px solid rgba(0, 0, 0, 0.3);
}
.description {
  font-weight: normal;
}
</style>
