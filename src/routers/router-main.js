import Vue from "vue";
import Router from "vue-router";
import store from "../store";
// @ts-ignore
import Home from "../components/Home";
// @ts-ignore
import Profile from "../components/Profile";
// @ts-ignore
import CreateList from "../components/CreateList";
// @ts-ignore
import DisplayList from "../components/DisplayList";
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
import Categories from "../components/Categories";
// @ts-ignore
import Admin from "../components/Admin";
// @ts-ignore
import AdminLists from "../components/AdminLists";
// @ts-ignore
import AdminPendingLists from "../components/AdminPendingLists";
// @ts-ignore
import AdminPendingDemands from "../components/AdminPendingDemands";
// @ts-ignore
import AdminFlagged from "../components/AdminFlagged";
// @ts-ignore
import DisplayLists from "../components/DisplayLists";
// @ts-ignore
import TermsAndConditions from "../components/TermsAndConditions";
// @ts-ignore
import PrivacyPolicy from "../components/PrivacyPolicy";
//@ts-ignore
import ErrorPage from "../components/ErrorPage";
// @ts-ignore
import AdminPendingListItems from "../components/AdminPendingListItems";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/users/:id",
      name: "profile",
      component: Profile,
      children: [
        {
          path: "/users/:id/creations",
          name: "user-creations",
          component: UserCreations
        },
        {
          path: "/users/:id/activities",
          name: "user-activities",
          component: Activities
        },
        {
          path: "/users/:id",
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
      path: "/lists",
      name: "lists",
      component: DisplayLists
    },
    {
      path: "/lists/:id",
      name: "list-display",
      component: DisplayList
    },
    {
      path: "/items/:id",
      name: "item",
      component: Item
    },
    {
      path: "/demands",
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
    },
    {
      path: "/admin",
      component: Admin,
      beforeEnter(to, from, next) {
        if (store.getters.getUser.id === "w4NsNxycJtbGqSjpLsp9KuTln6B2") {
          next();
        } else {
          next({
            name: "home"
          });
        }
      },
      children: [
        { path: "/", name: "admin-lists", component: AdminLists },
        {
          path: "/admin/pending-lists",
          name: "admin-pending-lists",
          component: AdminPendingLists
        },
        {
          path: "/admin/pending-demands",
          name: "admin-pending-demands",
          component: AdminPendingDemands
        },
        {
          path: "/admin/flagged",
          name: "admin-flagged",
          component: AdminFlagged
        },
        {
          path: "/admin/pending-list-items",
          name: "admin-pending-list-items",
          component: AdminPendingListItems
        }
      ]
    },
    {
      path: "/terms-and-conditions",
      name: "terms-and-conditions",
      component: TermsAndConditions
    },
    {
      path: "/privacy-policy",
      name: "privacy-policy",
      component: PrivacyPolicy
    },
    {
      path: "/error",
      name: "error",
      component: ErrorPage
    }
  ],
  scrollBehavior(to) {
    if (
      ["user-favorites", "user-creations", "user-activities"].indexOf(to.name) <
      0
    )
      return { x: 0, y: 0 };
  }
});
