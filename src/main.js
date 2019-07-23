// @ts-ignore
import Vue from "vue";
import "./plugins/vuetify";
// @ts-ignore
import App from "./App.vue";
import Vuetify from "vuetify";
import router from "./routers/router-main";
// import 'material-design-icons-iconfont/dist/material-design-icons.css';
import firebase from "firebase/app";
import store from "./store";

Vue.config.productionTip = false;

Vue.use(Vuetify, {
  theme: {
    primary: '#e8e8e8',
    brand: '#60aaea',
    form: '#60aaea',
    accent: '#a70932',
    background: '#f4f4f4',
    dark_text: '#21242f',
    link: '#0060AC',
    button: '#0060AC'
  }
});

// @ts-ignore
new Vue({
  store,
  router,
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
