import Vue from "vue";
import Vuetify from "vuetify/lib";
// import 'vuetify/src/stylus/app.styl'
import "vuetify/src/styles/main.sass";
import "@fortawesome/fontawesome-free/css/all.css";
// @ts-ignore
import queue from "../icons/queue";
import create from "../icons/create";
import createOutline from "../icons/create-outline";
import demand from "../icons/demand";
import ladder from "../icons/ladder";
import joinQueue from "../icons/joinQueue";
import leaveQueue from "../icons/leaveQueue";
import follow from "../icons/follow";
import unfollow from "../icons/unfollow";
import approved from "../icons/approved";
import people from "../icons/people";
import demandOutline from "../icons/demand-outline";
import contribute from "../icons/contribute";
import addItemOutline from "../icons/add-item-outline";
import starOutline from "../icons/star-outline";
import replyOutline from "../icons/reply-outline";
import commentOutline from "../icons/comment-outline";
import arrowUpOutline from "../icons/arrow-up-outline";
import arrowDownOutline from "../icons/arrow-down-outline";
import category from "../icons/category";
import list from "../icons/list";
import arrowDown from "../icons/arrow-down";
import arrowUp from "../icons/arrow-up";
import bell from "../icons/bell";
import search from "../icons/search";
import menu from "../icons/menu";

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
        component: demand
      },
      demandOutline: {
        component: demandOutline
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
      follow: {
        component: follow
      },
      unfollow: {
        component: unfollow
      },
      approved: {
        component: approved
      },
      people: {
        component: people
      },
      createOutline: {
        component: createOutline
      },
      contribute: {
        component: contribute
      },
      addItemOutline: {
        component: addItemOutline
      },
      starOutline: {
        component: starOutline
      },
      replyOutline: {
        component: replyOutline
      },
      commentOutline: {
        component: commentOutline
      },
      arrowUpOutline: {
        component: arrowUpOutline
      },
      arrowDownOutline: {
        component: arrowDownOutline
      },
      arrowDown: {
        component: arrowDown
      },
      arrowUp: {
        component: arrowUp
      },
      category: {
        component: category
      },
      list: {
        component: list
      },
      bell: {
        component: bell
      },
      search: {
        component: search
      },
      menu: {
        component: menu
      }
    }
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
