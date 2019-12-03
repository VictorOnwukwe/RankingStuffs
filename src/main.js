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
import { VuetifyLazyImagePlugin } from "vuetify-lazy-image";
import VueGlide from "vue-glide-js";
// @ts-ignore
import PreviewUser from "./components/PreviewUser";
import DisplayPreviews from "./components/DisplayPreviews";

import VueAutosize from "vue-autosize";
import Masonry from "vue-masonry-css";

import VuePacker from "vue-packer";

import CommentBox from "../src/components/CommentBox";

// @ts-ignore
import MyImage from "../src/components/MyImage";
import VueLodash from "vue-lodash";
import Rate from "../src/components/Rate";
import Rating from "../src/components/Rating";
import VueRx from "vue-rx";
import MyButton from "./components/MyButton";
import MyAlert from "./components/MyAlert";
import MyProgress from "./components/MyProgress";
import ProfilePic from "./components/ProfilePic";
import categories from "../public/my-modules/categories";
import LoadingLists from "./components/LoadingLists";
import {VueMasonryPlugin} from "vue-masonry";

const options = {}; // Optional options

Vue.use(VueMasonryPlugin);

Vue.use(VuePacker, {});

Vue.use(VueLodash, { name: "lodash" });

Vue.use(VueRx);

window.Swal = Swal;

let moment = require("moment");

// let SocialSharing = require("vue-social-sharing");

Vue.config.productionTip = false;

Vue.use(
  VueGlide,
  OverlayScrollbars,
  VuetifyLazyImagePlugin,
  VueAutosize,
  moment
);

Vue.use(Masonry, { name: "the-masonry" });

Vue.component("preview-user", PreviewUser);
Vue.component("display-lists", DisplayPreviews);
Vue.component("auto-textarea", CommentBox);
Vue.component("img-prev", MyImage);
Vue.component("rate", Rate);
Vue.component("rating", Rating);
Vue.component("btn", MyButton);
Vue.component("alert", MyAlert);
Vue.component("dp", ProfilePic);
Vue.component("m-progress", MyProgress);
Vue.component("list-loading", LoadingLists);

Vue.mixin({
  methods: {
    random(to, from) {
      return Math.floor(Math.random() * (to - from + 1) + from);
    },
    showAuthenticationError(action) {
      const Toast = Swal.mixin({
        toast: true,
        position: "center",
        showConfirmButton: false,
        timer: 3000,
        showCloseButton: false,
        type: "info"
      });

      Toast.fire({
        html:
          "<div><strong>" +
          "<p>You have to login to " +
          action +
          "</p>" +
          "</strong></div>"
      });
    },
    generateKeywords: function(text) {
      text = text.toLowerCase();
      let all = text.split(" ");
      let result = [];
      for (let word of all) {
        let editText = word + " " + text.replace(word, "");
        result = [...this.edit(editText.replace("  ", " ")), ...result];
      }
      return result;
    },
    edit: function(text) {
      let arr = [];
      let str = "";
      text.split("").forEach(letter => {
        str += letter;
        arr.push(str);
      });
      return arr;
    }
  }
});

// @ts-ignore
new Vue({
  store,
  router,
  vuetify,
  render: h => h(App),

  created: function() {
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
