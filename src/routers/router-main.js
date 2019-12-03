import Vue from "vue";
import Router from "vue-router";
// @ts-ignore
import Home from "../components/Home";
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
import Activities from "../components/Activities";
// @ts-ignore
import DisplayDemand from "../components/DisplayDemand";
// @ts-ignore
import Category from "../components/Category";
// @ts-ignore
import SubCategory from "../components/SubCategory";
// @ts-ignore
import TopRatedLists from "../components/TopRatedLists";
// @ts-ignore
import Categories from "../components/Categories";

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
      name: "profile",
      component: Profile,
      children: [
        {
          path: "/:id/profile/creations",
          name: "user-creations",
          component: UserCreations
        },
        {
          path: "/:id/profile/activities",
          name: "activities",
          component: Activities
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
      path: "/top-rated-lists",
      name: "top-rated-lists",
      component: TopRatedLists
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
    },
    {
      path: "/demands/:id",
      name: "demanded",
      component: DisplayDemand
    },
    {
      path: "/categories/:id",
      name: "category",
      component: Category
    },
    {
      path: "/categories/:category/:subcategory",
      name: "subcategory",
      component: SubCategory
    },
    {
      path: "/categories",
      name: "categories",
      component: Categories
    }
  ],
  scrollBehavior(to) {
    if (["user-favorites", "user-creations", "activities"].indexOf(to.name) < 0)
      return { x: 0, y: 0 };
  }
});
