import Vue from "vue";
import Vuetify from "vuetify/lib";
// import 'vuetify/src/stylus/app.styl'
import "vuetify/src/styles/main.sass";
import "@fortawesome/fontawesome-free/css/all.css";
import icons from "../my-modules/js/icons";

Vue.use(Vuetify);

const vuetify = new Vuetify({
  icons: {
    iconfont: "mdi",
    values: icons
  },
  theme: {
    themes: {
      light: {
        primary: "#00A65A",
        brand: "#388E3C",
        form: "#60aaea",
        accent: "#FF9800",
        background: "#f4f4f4",
        link: "#00A65A",
        button: "#0060AC",
        item_title: "#BBDEFB",
        footer: "#242729"
      }
    }
  }
});

export default vuetify;
