import Vue from "vue";
import Vuetify from "vuetify/lib";
// import 'vuetify/src/stylus/app.styl'
import "vuetify/src/styles/main.sass";

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#FFFFFF",
        brand: "#176DC9",
        form: "#60aaea",
        accent: "#f1295b",
        background: "#f4f4f4",
        link: "#0060AC",
        button: "#0060AC",
        item_title: "#BBDEFB",
        sidebar: "#363640"
      }
    }
  }
});

export default vuetify;
