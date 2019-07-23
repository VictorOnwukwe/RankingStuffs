import Vue from "vue";
import Router from "vue-router";
// @ts-ignore
import Home from "../components/Home";
// @ts-ignore
import Login from "../components/Login";
// @ts-ignore
import Signup from "../components/Signup";
// @ts-ignore
import Profile from "../components/Profile";
// @ts-ignore
import Create from "../components/Create";
import DisplayList from "../components/DisplayList";

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
    },
    {
      path: "/profile",
      component: Profile
    },
    {
      path: "/create",
      component: Create
    },
    {
      path: "/lists/:id",
      component: DisplayList
    }
  ]
});
