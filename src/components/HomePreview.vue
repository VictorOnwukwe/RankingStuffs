<template>
  <div>
    <div class="top-view">
      <div class="overlay">
        <div class="foreground">
          <div style="font-size:2em">
            <span class="accent--text font-weight-black">top</span>
            <span class="white--text font-weight-black">TENERS</span>
            <span class="accent--text font-weight-black">...</span>
          </div>
          <p class="ptl text-center">
            Journey with us! As we reach the very top of everything the mind can
            conceive...
          </p>
          <div class="display-container">
            <div class="display create">
              <router-link to="/create" class="header no-deco"
                >Create</router-link
              >
              <div class="mt-2 ptl text-center">
                Share the fun with other Top-Teners by creating lists and
                getting others' opinions
              </div>
            </div>
            <div class="display demand">
              <router-link to="/demand" class="header no-deco"
                >Demand</router-link
              >
              <div class="mt-2 ptl text-center">
                Curious about top ten stuff? Place it on demand. Maybe a
                Top-Tener could just help out
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.top-view {
  background-image: url("../../public/background3.jpg");
  width: calc(100% + 1em);
  margin-left: -0.5em;
  min-height: 80vh;
  background-position: top right;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
.overlay {
  background: rgba(0, 0, 0, 0.5);
  min-height: 80vh;
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
.display-container {
  width: 100%;
  margin-top: 2em;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1em;
  max-width: 600px;
}
.display {
  width: 100%;
  padding: 1em;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}
.header {
  color: white;
  text-align: center;
  font-size: 1.4em;
  border-bottom: 2px solid rgba(255, 152, 0, 0.5);
  transition: 0.2s ease-in;
  display: block;
}
.header:hover {
  color: var(--accent);
  border-bottom: 2px solid var(--accent);
}
</style>
