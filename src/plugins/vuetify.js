import Vue from "vue";
import Vuetify from "vuetify/lib";
// import 'vuetify/src/stylus/app.styl'
import "vuetify/src/styles/main.sass";

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#F9F9FA",
        brand: "#2196F3",
        form: "#60aaea",
        accent: "hsl(39, 90%, 50%)",
        background: "#f4f4f4",
        dark_text: "#21242f",
        link: "#0060AC",
        button: "#0060AC"
      }
    }
  }
});

export default vuetify;
