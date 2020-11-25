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
// @ts-ignore
import AdminPendingItemImages from "../components/AdminPendingItemImages";
// @ts-ignore
import AdminPendingItemInfos from "../components/AdminPendingItemInfos";
// @ts-ignore
import EmailVerification from "../components/EmailVerification";

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
          path: "/users/:id",
          name: "user-activities",
          component: Activities
        },
        {
          path: "/users/:id/favorites",
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
        if (store.getters.getUser.id === "c6F7pgDchSfyY931qz1kUUWDKOR2") {
          next();
        } else {
          next({
            name: "home"
          });
        }
      },
      children: [
        {
          path: "/",
          name: "admin-pending-lists",
          component: AdminPendingLists
        },
        {
          path: "/admin/lists",
          name: "admin-lists",
          component: AdminLists
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
        },
        {
          path: "/admin/pending-item-images",
          name: "admin-pending-item-images",
          component: AdminPendingItemImages
        },
        {
          path: "/admin/pending-item-infos",
          name: "admin-pending-item-infos",
          component: AdminPendingItemInfos
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
    },
    {
      path: "/verify_email",
      name: "verify_email",
      component: EmailVerification,
      beforeEnter(to, from, next) {
        if (store.getters.authenticated && to.query.mode) {
          next();
        } else {
          next({
            name: "home"
          });
        }
      },
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
