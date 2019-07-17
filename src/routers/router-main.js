import Vue from "vue";
import Router from "vue-router";
import { homedir } from "os";
import Home from "../components/Home";
import Login from "../components/Login";
import Signup from "../components/Signup";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      component: Home
    },
    {
      path: "/login",
      component: Login
    },
    {
      path: "/signup",
      component: Signup
    }
  ]
});
