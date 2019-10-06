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
// @ts-ignore
import ProfileSetting from "../components/ProfileSetting";
// @ts-ignore
import UserCreations from "../components/UserCreations";
// @ts-ignore
import UserFavorites from "../components/UserFavorites";
//@ts-ignore
import Item from "../components/Item";
//@ts-ignore
import DisplayDemanded from "../components/DisplayDemanded";
// @ts-ignore
import Demand from "../components/Demand";
// @ts-ignore
import Timeline from "../components/Timeline";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/:id/profile",
      component: Profile,
      children: [
        {
          path: "/:id/profile/creations",
          name: "user-creations",
          component: UserCreations
        },
        {
          path: "/:id/profile/timeline",
          component: Timeline
        },
        {
          path: "/:id/profile/",
          name: "user-favorites",
          component: UserFavorites
        }
      ]
    },
    {
      path: "/create",
      name: "create",
      component: CreateList
    },
    {
      path: "/lists/:id",
      name: "list-display",
      component: DisplayList
    },
    {
      path: "/popular-lists",
      name: "popular-lists",
      component: PopularLists
    },
    {
      path: "/latest-lists",
      name: "latest-lists",
      component: LatestLists
    },
    {
      path: "/items/:id",
      name: "item",
      component: Item
    },
    {
      path: "/demanded",
      name: "demanded-lists",
      component: DisplayDemanded
    },
    {
      path: "/demand",
      name: "demand",
      component: Demand
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});
