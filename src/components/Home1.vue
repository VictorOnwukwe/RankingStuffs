<template>
  <div id="main">
    <div id="background-image">
      <div id="contents">
        <div id="chevron-left">
          <v-icon @click="showList=!showList" color="grey">mdi-chevron-left</v-icon>
        </div>
        <div id="lists-display">
          <div>
          <transition name="list" v-for="list in latest" :key="list.id">
            <div v-if="showList">
              <PreviewList :list="list"></PreviewList>
            </div>
          </transition>
          </div>
          <transition name="list">
            <div v-if="!showList" style="color:white">This is the main text of the website</div>
          </transition>
          <div id="brand-name">
            <transition name="fade-in">
              <div v-if="showList" id="name-trending" class="center">TRENDING</div>
            </transition>
            <transition name="bounce-down">
              <div v-if="showList" id="name-top" class="center">TOP</div>
            </transition>
            <transition name="bounce-up">
              <div v-if="showList" id="name-ten" class="center">10</div>
            </transition>
          </div>
        </div>
        <div id="chevron-right">
          <v-icon @click="showList=!showList" color="grey">mdi-chevron-right</v-icon>
        </div>
      </div>
      <div id="bottom-text"></div>
    </div>
    <Toolbar></Toolbar>
    <router-view></router-view>
  </div>
</template>

<script>
import Toolbar from "./Toolbar";
import PreviewList from "./PreviewList";
import { setTimeout } from "timers";
export default {
  components: {
    PreviewList,
    Toolbar
  },
  data() {
    return {
      latest: [],
      showList: false
    };
  },
  methods: {
    fetchLatest(limit) {
      this.$store
        .dispatch("fetch_latest", {
          timestamp: "now",
          limit: limit
        })
        .then(latest => {
          this.latest = latest;
        });
    },
    rotate() {
      let square = document.querySelector("#box");
      square.classList.remove("pause");
      setTimeout(() => {
        square.classList.add("pause");
      }, 276);
    }
  },
  mounted: function() {
    let limit;
    if(screen.width>=480){
      limit = 5;
    }else{
      limit = 3;
    }
    this.fetchLatest(limit);
    setTimeout(() => {
      this.showList = true;
    }, 3000);
  }
};
</script>

<style scoped>
#main {
  position: relative;
}

#background-image {
  display: flex;
  flex-direction: column;
  width: calc(100% + 2em);
  height: 200px;
  background-image: linear-gradient(90deg, rgb(5, 26, 53), rgb(8, 47, 99));
  margin-left: -1em;
  margin-top: -1em;
  position: relative;
  padding: 1em 6em;
}
@media (min-width: 30em) {
  #background-image {
    height: 25em;
  }
}
#navs a {
  padding-bottom: 0.2em;
}
#navs a:hover {
  border-bottom: 4px solid hsl(60, 97%, 40%);
}
#navs a + a {
  margin-left: 1em;
}
#contents {
  flex-grow: 1;
  display: flex;
  align-content: center;
  justify-content: center;
}
#bottom-text {
  color: white;
  font-size: 17px;
  text-justify: center;
  display: flex;
}
#lists-display {
  flex-grow: 1;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  perspective: 200px;
  perspective-origin: center center;
}
#lists-display div {
  width: 50px;
  object-fit: cover;
}
#lists-display div + div {
  margin-right: 1em;
}
.list-enter-active {
  animation: fade-off 1s cubic-bezier(0, 0.71, 0.57, 1.22) reverse;
  animation-delay: 2.8s;
  animation-fill-mode: backwards;
}
.list-enter-active:nth-child(2) {
  animation-delay: 2.95s;
}
.list-enter-active:nth-child(3) {
  animation-delay: 3.1s;
}
.list-enter-active:nth-child(4) {
  animation-delay: 3.25s;
}
.list-enter-active:nth-child(5) {
  animation-delay: 3.4s;
}
.list-leave-active {
  animation: fade-off 0.6s linear;
}
#brand-name {
  display: flex;
  flex-direction: column;
}
#name-trending {
  color: hsl(60, 97%, 40%);
  font-weight: 800;
  font-size: 1.2em;
}
#name-top {
  color: white;
  letter-spacing: 5px;
  font-weight: 700;
  font-size: 1.125em;
}
#name-ten {
  color: white;
  letter-spacing: 5px;
  font-weight: 700;
  font-size: 1.125em;
}

.bounce-down-enter-active {
  animation: bounce-down 0.5s linear;
  animation-fill-mode: backwards;
  animation-delay: 1.6s;
}
.bounce-up-enter-active {
  animation: bounce-up 0.5s linear;
  animation-fill-mode: backwards;
  animation-delay: 2.3s;
}
.fade-in-enter-active {
  animation: fade-in 0.4s ease-in;
  animation-fill-mode: backwards;
  animation-delay: 1s;
}

#chevron-left {
  align-self: center;
  left: 1em;
  height: 50px;
}
#chevron-right {
  align-self: center;
  height: 50px;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes bounce-down {
  0% {
    opacity: 0.2;
    transform: translateY(-200px);
  }
  50% {
    opacity: 0.6;
    transform: translateY(-100px);
  }
  70% {
    transform: translateY(25px);
  }
  85% {
    opacity: 0.8;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes bounce-up {
  0% {
    opacity: 0.2;
    transform: translateY(400px);
  }
  50% {
    opacity: 0.6;
    transform: translateY(100px);
  }
  70% {
    transform: translateY(-25px);
  }
  85% {
    opacity: 0.8;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.center {
  text-justify: center;
}

@keyframes fade-off {
  0% {
    opacity: 1;
  }
  60% {
    opacity: 0.5;
    transform: translateZ(-300px);
  }
  100% {
    opacity: 0;
    transform: translateZ(-300px) translate(800px);
  }
}

@keyframes slide-in {
  0% {
    transform: translate(-1200px);
  }
  100% {
    transform: translate(0px);
  }
}
</style>
