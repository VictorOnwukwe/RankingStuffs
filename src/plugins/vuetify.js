import Vue from "vue";
import Vuetify from "vuetify/lib";
// import 'vuetify/src/stylus/app.styl'
import "vuetify/src/styles/main.sass";

Vue.use(Vuetify, {
  theme: {
    primary: "#F9F9FA",
    brand: "#c8c803",
    form: "#60aaea",
    accent: "#082f63",
    background: "#f4f4f4",
    dark_text: "#21242f",
    link: "#0060AC",
    button: "#0060AC"
  }
});

export default new Vuetify();
