<template>
  <div id="main">
    <div style="display: flex; flex-direction:column">
      <div id="sidebar">
        <div style>
          <div class="entity">
            <div @click="toggle('cat')">
              <a @click="fetchCategories()" class="tile">Categories</a>
              <v-icon v-if="!showCategories" class="menu-icon">mdi-menu-down</v-icon>
              <v-icon v-if="showCategories" class="menu-icon">mdi-menu-up</v-icon>
            </div>
            <transition name="sub-trans">
              <div v-if="showCategories" class="sub-display">
                <a
                  class="highlight pl-2"
                  style="display:block"
                  v-for="(category, i) in categories"
                  :key="i"
                >{{category.name}}</a>
              </div>
            </transition>
          </div>
          <div class="entity">
            <div @click="toggle('tag')">
              <div style="position:relative">
                <a class="tile">Tags</a>
                <v-icon class="prepend-icon" small>mdi-tag-multiple</v-icon>
              </div>
              <v-icon v-if="!showTags" class="menu-icon">mdi-menu-down</v-icon>
              <v-icon v-if="showTags" class="menu-icon">mdi-menu-up</v-icon>
            </div>
            <transition name="sub-trans">
              <div v-if="showTags" style="display:flex; flex-wrap:wrap" class="sub-display">
                <a style v-for="i in 50" :key="i">dog &nbsp;</a>
              </div>
            </transition>
          </div>
          <div class="entity">
            <div @click="toggle('pop')">
              <div style="position:relative">
                <a @click="fetchPopular()" class="tile">Popular</a>
                <v-icon class="prepend-icon" small>mdi-format-list-numbered</v-icon>
              </div>
              <v-icon v-if="!showPopular" class="menu-icon">mdi-menu-down</v-icon>
              <v-icon v-if="showPopular" class="menu-icon">mdi-menu-up</v-icon>
            </div>
            <transition name="sub-trans">
              <div v-if="showPopular" class="sub-display">
                <a
                  class="border-link"
                  style="display:block;"
                  v-for="(popular, i) in populars"
                  :key="i"
                >{{popular.title}}</a>
              </div>
            </transition>
          </div>
          <div class="entity">
            <div @click="toggle('lat')">
              <div style="position:relative">
                <a @click="fetchLatest()" class="tile">Latest</a>
                <v-icon class="prepend-icon" small>mdi-format-list-numbered</v-icon>
              </div>
              <v-icon v-if="!showLatest" class="menu-icon">mdi-menu-down</v-icon>
              <v-icon v-if="showLatest" class="menu-icon">mdi-menu-up</v-icon>
            </div>
            <transition name="sub-trans">
              <div v-if="showLatest" class="sub-display">
                <a
                  class="border-link"
                  style="display:block"
                  v-for="(latest, i) in latests"
                  :key="i"
                >{{latest.title}}</a>
              </div>
            </transition>
          </div>
          <div class="entity">
            <div @click="toggle('dem')">
              <a class="tile">On Demand</a>
              <v-icon v-if="!showOnDemand" class="menu-icon">mdi-menu-down</v-icon>
              <v-icon v-if="showOnDemand" class="menu-icon">mdi-menu-up</v-icon>
            </div>
            <transition name="sub-trans">
              <div v-if="showOnDemand" class="sub-display">
                <a style="display:block" v-for="i in 10" :key="i">dog</a>
              </div>
            </transition>
          </div>
          <div class="entity">
            <div @click="toggle('trend')">
              <div style="position:relative">
                <a class="tile">Trending</a>
                <v-icon class="prepend-icon" small>mdi-format-list-numbered</v-icon>
              </div>
              <v-icon v-if="!showTrending" class="menu-icon">mdi-menu-down</v-icon>
              <v-icon v-if="showTrending" class="menu-icon">mdi-menu-up</v-icon>
            </div>
            <transition name="sub-trans">
              <div v-if="showTrending" class="sub-display">
                <a style="display:block" v-for="i in 10" :key="i">dog</a>
              </div>
            </transition>
          </div>
          <div class="entity">
            <div @click="toggle('top')">
              <div style="position:relative">
                <a class="tile">Top Rated</a>
                <v-icon class="prepend-icon" small>mdi-format-list-numbered</v-icon>
              </div>
              <v-icon v-if="!showTopRated" class="menu-icon">mdi-menu-down</v-icon>
              <v-icon v-if="showTopRated" class="menu-icon">mdi-menu-up</v-icon>
            </div>
            <transition name="sub-trans">
              <div v-if="showTopRated" class="sub-display">
                <a style="display:block" v-for="i in 10" :key="i">dog</a>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showCategories: false,
      showLatest: false,
      showTags: false,
      showTrending: false,
      showOnDemand: false,
      showPopular: false,
      showTopRated: false,
      populars: [],
      latests: [],
      loading: false,
      categories: []
    };
  },
  methods: {
    toggle(letter) {
      switch (letter) {
        case "cat":
          this.showCategories = !this.showCategories;
          this.showLatest = false;
          this.showTags = false;
          this.showTrending = false;
          this.showPopular = false;
          this.showOnDemand = false;
          this.showTopRated = false;
          break;
        case "tag":
          this.showCategories = false;
          this.showLatest = false;
          this.showTags = !this.showTags;
          this.showTrending = false;
          this.showPopular = false;
          this.showOnDemand = false;
          this.showTopRated = false;
          break;
        case "lat":
          this.showCategories = false;
          this.showLatest = !this.showLatest;
          this.showTags = false;
          this.showTrending = false;
          this.showPopular = false;
          this.showOnDemand = false;
          this.showTopRated = false;
          break;
        case "trend":
          this.showCategories = false;
          this.showLatest = false;
          this.showTags = false;
          this.showTrending = !this.showTrending;
          this.showPopular = false;
          this.showOnDemand = false;
          this.showTopRated = false;
          break;
        case "dem":
          this.showCategories = false;
          this.showLatest = false;
          this.showTags = false;
          this.showTrending = false;
          this.showPopular = false;
          this.showOnDemand = !this.showOnDemand;
          this.showTopRated = false;
          break;
        case "pop":
          this.showCategories = false;
          this.showLatest = false;
          this.showTags = false;
          this.showTrending = false;
          this.showPopular = !this.showPopular;
          this.showOnDemand = false;
          this.showTopRated = false;
          break;
        case "top":
          this.showCategories = false;
          this.showLatest = false;
          this.showTags = false;
          this.showTrending = false;
          this.showPopular = false;
          this.showOnDemand = false;
          this.showTopRated = !this.showTopRated;
          break;
      }
    },
    addCategories() {
      let categories = [
        "Agriculture",
        "Activism",
        "Arts",
        "Aviation",
        "Commemoration",
        "Communication",
        "Design",
        "Education",
        "Entertainment",
        "Fishing",
        "Food and Drinks",
        "Government",
        "Hunting",
        "Industry",
        "Leisure",
        "Exercise",
        "Politics",
        "Recreation",
        "Religion",
        "Sports",
        "Space",
        "Trade",
        "Transport",
        "Travel",
        "War",
        "Work",
        "Marine",
        "Animals",
        "Solar",
        "Earth",
        "Military"
      ];

      this.$store.dispatch("add_categories", categories);
    },
    fetchPopular() {
      if (this.showPopular) {
        return;
      }
      this.loading = true;
      if (this.$store.state.popular.length == 0) {
        this.$store.dispatch("fetch_popular", 10).then(populars => {
          this.loading = false;
          this.populars = populars;
        });
      } else {
        console.log("here");
        this.populars = this.$store.state.popular;
      }
    },
    fetchLatest() {
      if (this.showLatest) {
        return;
      }
      this.loading = true;
      if (this.$store.state.latest.length == 0) {
        this.$store
          .dispatch("fetch_latest", {
            timestamp: "now",
            limit: 10
          })
          .then(latests => {
            this.loading = false;
            this.latests = latests;
          });
      } else {
        console.log("here Latest");
        this.latests = this.$store.state.latest;
      }
    },
    fetchCategories() {
      this.$store.dispatch("fetch_categories").then(result => {
        this.categories = result;
      });
    }
  },
  computed: {
    
  }
};
</script>

<style scoped>
#main {
  position: sticky;
  top: 50px;
  scrollbar-color: #051b38 #051b38;
  scrollbar-width: 3px;
  margin-left: -1em;
  margin-right: 1em;
  max-width: 250px;
  min-width: 250px;
  overflow-y: scroll;
  height: calc(100vh - 50px);
  display: none;
  background-color: #363640;
}
@media (min-width: 1000px) {
  #main {
    display: block;
  }
}
.tile {
  border-bottom: 1px solid #424242;
  padding: 0.5em 0;
  display: block;
  color: #424242
}

#sidebar {
  padding: 1.5em;
}

#sidebar div + div {
  margin-top: 1em;
}

.sidebar-element {
  background-color: hsl(0, 0%, 90%);
  padding: 1em;
  border-radius: 0.5em;
  font-size: 0.8em;
}

.sidebar-element h3 {
  text-align: center;
}
.menu-icon {
  position: absolute;
  color: black;
  top: 0.25em;
  right: 0em;
  cursor: pointer;
}
.prepend-icon {
  color: rgb(19, 18, 18);
  position: absolute;
  top: 0.6em;
  left: -1.2em;
}
.sub-display {
  width: 100%;
  background-color: #35465e;
  padding: 1em;
}
.entity {
  position: relative;
}
.sub-trans-enter-active {
  animation: expand-down 0.1s ease-in;
}
.sub-trans-leave-active {
  animation: expand-down 0.1s ease-in reverse;
}
@keyframes expand-down {
  0% {
    opacity: 0;
    height: 0;
  }
  100% {
    height: auto;
    opacity: 1;
  }
}

.highlight:hover {
  background-color: #051b38;
}
.border-link {
  padding: 0.5em 0;
}
.border-link + .border-link {
  border-top: 1px solid var(--brand);
}
</style>


