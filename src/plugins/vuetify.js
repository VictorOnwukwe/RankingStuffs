import Vue from "vue";
import Vuetify from "vuetify/lib";
// import 'vuetify/src/stylus/app.styl'
import "vuetify/src/styles/main.sass";

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#F4F4F4",
        brand: "#176EC9",
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
