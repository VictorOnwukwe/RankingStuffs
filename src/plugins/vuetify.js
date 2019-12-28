import Vue from "vue";
import Vuetify from "vuetify/lib";
// import 'vuetify/src/stylus/app.styl'
import "vuetify/src/styles/main.sass";
import "@fortawesome/fontawesome-free/css/all.css";

Vue.use(Vuetify);

const vuetify = new Vuetify({
  // icons: {
  //   iconfont: "fa"
  // },
  theme: {
    themes: {
      light: {
        primary: "#388E3C",
        brand: "#388E3C",
        form: "#60aaea",
        accent: "#FF9800",
        background: "#f4f4f4",
        link: "#0060AC",
        button: "#0060AC",
        item_title: "#BBDEFB",
        footer: "#2F363B"
        // dark_primary: "#000000de",
        // dark_secondary: "#0000198a",
        // dark_hint: "#00001961",
        // dark_divider: "#0000191f",
        // light_primary: "#ffffff",
        // light_secondary: "#ffffffb3",
        // light_hint: "#ffffff80",
        // light_divider: "#ffffff1f"
      }
    }
  }
});

export default vuetify;
