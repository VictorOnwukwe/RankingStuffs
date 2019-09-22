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
import OverlayScrollbars from "os-vue";
import VueTextareaAutosize from "vue-textarea-autosize";
import { VuetifyLazyImagePlugin } from "vuetify-lazy-image";
import VueGlide from "vue-glide-js";
// @ts-ignore
import PreviewUser from "./components/PreviewUser";
import DisplayPreviews from "./components/DisplayPreviews";

import VueAutosize from "vue-autosize";
import Masonry from "vue-masonry-css";

import VuePacker from 'vue-packer';

const options = {}; // Optional options

Vue.use(VuePacker, {});

import VueMasonryComponent from 'vue-masonry-component'

Vue.use(VueMasonryComponent)

window.Swal = Swal;

// let SocialSharing = require("vue-social-sharing");

Vue.config.productionTip = false;

Vue.use(
  VueGlide,
  OverlayScrollbars,
  VueTextareaAutosize,
  VuetifyLazyImagePlugin,
  VueAutosize
);

Vue.use(Masonry, { name: "the-masonry" });

Vue.component("preview-user", PreviewUser);
Vue.component("display-lists", DisplayPreviews);

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
