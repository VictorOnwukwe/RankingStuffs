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
import CreateList from "../components/CreateList";
// @ts-ignore
import DisplayList from "../components/DisplayList";
// @ts-ignore
import PopularLists from "../components/PopularLists";
// @ts-ignore
import LatestLists from "../components/LatestLists";

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
      component: CreateList
    },
    {
      path: "/lists/:id",
      component: DisplayList
    },
    {
      path: "/popular-lists",
      component: PopularLists
    },
    {
      path: "/latest-lists",
      component: LatestLists
    }
  ]
});
