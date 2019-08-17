// @ts-ignore
import Vue from "vue";
import "./plugins/vuetify";
// @ts-ignore
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./routers/router-main";
// import 'material-design-icons-iconfont/dist/material-design-icons.css';
import firebase from "firebase/app";
import store from "./store";
import Swal from "sweetalert2";
import autosize from "autosize";
import anime from "animejs/lib/anime.es.js";
import OverlayScrollbars from "os-vue";

import VueGlide from "vue-glide-js";
// import "vue-glide-js/dist/vue-glide.css";

// window.Swal = Swal;

Vue.config.productionTip = false;

Vue.use(
  VueGlide,
  OverlayScrollbars
);

// @ts-ignore
new Vue({
  store,
  router,
  vuetify,
  render: h => h(App),

  created: function() {
    console.log("created");
    var firebaseConfig = {
      apiKey: "AIzaSyB7FHDy2yItk9Q8U2U2QjkFTT2o2cZ6UDA",
      authDomain: "top-ten-534ca.firebaseapp.com",
      databaseURL: "https://top-ten-534ca.firebaseio.com",
      projectId: "top-ten-534ca",
      storageBucket: "top-ten-534ca.appspot.com",
      messagingSenderId: "943719914188",
      appId: "1:943719914188:web:dd4aacbc348e47f9"
    };
    // Initialize Firebase
    // @ts-ignore
    firebase.initializeApp(firebaseConfig);
  }
}).$mount("#app");
