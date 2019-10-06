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
        primary: "#1867C0",
        brand: "#1867C0",
        form: "#60aaea",
        accent: "#f1295b",
        background: "#f4f4f4",
        link: "#0060AC",
        button: "#0060AC",
        item_title: "#BBDEFB",
        sidebar: "#363640"
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
