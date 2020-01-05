import Vue from "vue";
import Vuetify from "vuetify/lib";
// import 'vuetify/src/stylus/app.styl'
import "vuetify/src/styles/main.sass";
import "@fortawesome/fontawesome-free/css/all.css";
// @ts-ignore
import queue from "../icons/queue";
import create from "../icons/create";
import favorite from "../icons/favorite";
import ladder from "../icons/ladder";
import joinQueue from "../icons/joinQueue";
import leaveQueue from "../icons/leaveQueue";

Vue.use(Vuetify);

const vuetify = new Vuetify({
  icons: {
    iconfont: "mdi",
    values: {
      queue: {
        component: queue
      },
      create: {
        component: create
      },
      demand: {
        component: favorite
      },
      ladder: {
        component: ladder
      },
      joinQueue: {
        component: joinQueue
      },
      leaveQueue: {
        component: leaveQueue
      },
    }
  },
  theme: {
    themes: {
      light: {
        primary: "#388E3C",
        brand: "#388E3C",
        form: "#60aaea",
        accent: "#FF9800",
        background: "#f4f4f4",
        link: "#00A65A",
        button: "#0060AC",
        item_title: "#BBDEFB",
        footer: "#2F363B"
      }
    }
  }
});

export default vuetify;
