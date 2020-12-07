const persistInterval = 12 * 60 * 60 * 1000;
const circularJSON = require("circular-json");

const plugin = (store) => {
  store.subscribe(async (mutation, state) => {
    let overrideHomeCategories = async function(cat, localCategories) {
      store
        .dispatch("fetch_home_category_lists")
        .then((cat) => {
          if (
            !cat ||
            (localCategories &&
              localCategories.data &&
              ((localCategories.data.slideLists &&
                cat.slideLists.length <
                  localCategories.data.slideLists.length) ||
                (localCategories.data.pageLists &&
                  cat.pageLists.length <
                    localCategories.data.pageLists.length)))
          )
            return;

          const record = {
            data: cat,
          };
          localStorage.setItem(
            "homeCategoryLists",
            circularJSON.stringify(record)
          );
          store.commit("setCategoryLists", cat.pageLists);
          store.commit("setSlideLists", cat.slideLists);
        })
        .catch((e) => {});
    };
    if ("initialize" === mutation.type) {
      let categories, hotDemands, hotLists, auth, homeMain, homeCategory;

      async function initAuth() {
        try {
          auth = localStorage.getItem("auth") || false;
          if (auth) {
            auth = JSON.parse(auth);
          }
        } catch (e) {}

        if (auth) {
          if (auth.data.authenticated) {
            store.commit("login", auth.data.user);
          } else if (auth.data.anonymous) {
            store.commit("anonymousLogin", auth.data.user);
          } else {
            store.commit("logout");
          }
        } else if (store.getters.dbAuthenticated) {
          store.dispatch("resign_social_user");
        }
      }

      async function initHomeMain() {
        try {
          homeMain = localStorage.getItem("homeMainLists") || false;
          if (homeMain) {
            homeMain = JSON.parse(homeMain);
          }
        } catch (e) {}

        if (homeMain) {
          store.commit("setPopularList", homeMain.popular);
          store.commit("setLatestList", homeMain.latest);
          store.commit("setTopRatedList", homeMain.topRated);
        }
        store.dispatch("fetch_home_contents").then((val) => {
          if (!val.latest) return;
          localStorage.setItem("homeMainLists", circularJSON.stringify(val));
        });
      }

      async function initCategories() {
        try {
          categories = localStorage.getItem("categories") || false;
          if (categories) {
            categories = JSON.parse(categories);
          }
        } catch (e) {}
        try {
          homeCategory = localStorage.getItem("homeCategoryLists") || false;
          if (homeCategory) {
            homeCategory = JSON.parse(homeCategory);
          }
        } catch (e) {}

        if (categories && new Date().getTime() < categories.ts) {
          store.commit("setCategories", categories.data);
          if (
            homeCategory &&
            homeCategory.data &&
            homeCategory.data.slideLists &&
            homeCategory.data.slideLists.length > 0
          ) {
            store.commit("setCategoryLists", homeCategory.data.pageLists);
            store.commit("setSlideLists", homeCategory.data.slideLists);
          }
          overrideHomeCategories(homeCategory);
        } else {
          if (new Date().getTime() >= categories.ts) {
            store.commit("setCategories", categories.data);
            if (
              homeCategory &&
              homeCategory.data &&
              homeCategory.data.slideLists &&
              homeCategory.data.slideLists.length > 0
            ) {
              store.commit("setCategoryLists", homeCategory.data.pageLists);
              store.commit("setSlideLists", homeCategory.data.slideLists);
            }
            overrideHomeCategories(homeCategory);
            store.dispatch("fetchCategories");
          } else {
            if (
              homeCategory &&
              homeCategory.data &&
              homeCategory.data.slideLists &&
              homeCategory.data.slideLists.length > 0
            ) {
              store.commit("setCategoryLists", homeCategory.data.pageLists);
              store.commit("setSlideLists", homeCategory.data.slideLists);
            }
            overrideHomeCategories(homeCategory);
            store.dispatch("fetchCategories");
          }
        }
      }

      async function initHotLists() {
        try {
          hotLists = localStorage.getItem("hotLists") || false;
          if (hotLists) {
            hotLists = JSON.parse(hotLists);
          }
        } catch (e) {}

        if (
          hotLists &&
          new Date().getTime() < hotLists.ts &&
          hotLists.data.length > 0
        ) {
          store.commit("setHotLists", hotLists.data);
        } else {
          if (new Date().getTime() >= hotLists.ts) {
            store.commit("setHotLists", hotLists.data);
          }
          store.dispatch("fetch_sidebar_lists");
        }
      }

      async function initHotDemands() {
        try {
          hotDemands = localStorage.getItem("hotDemands") || false;
          if (hotDemands) {
            hotDemands = JSON.parse(hotDemands);
          }
        } catch (e) {}

        if (
          hotDemands &&
          new Date().getTime() < hotDemands.ts &&
          hotDemands.data.length > 0
        ) {
          store.commit("setHotDemands", hotDemands.data);
        } else {
          if (new Date().getTime() >= hotDemands.ts) {
            store.commit("setHotDemands", hotDemands.data);
          }
          store.dispatch("fetch_sidebar_demands");
        }
      }
      initAuth();
      initCategories();
      initHomeMain();
      initHotDemands();
      initHotLists()
    } else if ("setCategories" === mutation.type) {
      let record = {
        data: state.categories,
        ts: new Date().getTime() + persistInterval,
      };
      try {
        localStorage.setItem("categories", JSON.stringify(record));
      } catch (e) {}

      let homeCategories;
      try {
        homecategories = localStorage.getItem("homeCategoryLists") || false;
      } catch (e) {}
      if (!homeCategories) overrideHomeCategories(homeCategories);
    } else if ("login" === mutation.type) {
      let record = {
        data: {
          user: state.user,
          authenticated: state.authenticated,
        },
      };
      try {
        new Promise((resolve) => {
          localStorage.setItem("auth", JSON.stringify(record));
          resolve();
        }).then(() => {
          // setTimeout(() => {
          //   Promise.all([
          //     store.dispatch("watch_notifications"),
          //     store.dispatch("watch_auth_state"),
          //   ]);
          // }, 1000);
        });
      } catch (e) {}
    } else if ("logout" === mutation.type) {
      let record = {
        data: {
          user: null,
          authenticated: false,
          anonymous: false,
        },
      };
      try {
        localStorage.setItem("auth", JSON.stringify(record));
      } catch (e) {}
    } else if ("anonymousLogin" === mutation.type) {
      let record = {
        data: {
          user: state.user,
          authenticated: false,
          anonymous: true,
        },
      };
      try {
        localStorage.setItem("auth", JSON.stringify(record));
      } catch (e) {}
    } else if ("setHotLists" === mutation.type) {
      let record = {
        data: state.hotLists,
        ts: new Date().getTime() + persistInterval / 12,
      };
      try {
        localStorage.setItem("hotLists", JSON.stringify(record));
      } catch (e) {}
    } else if ("setHotDemands" === mutation.type) {
      let record = {
        data: state.hotDemands,
        ts: new Date().getTime() + persistInterval / 12,
      };
      try {
        localStorage.setItem("hotDemands", JSON.stringify(record));
      } catch (e) {}
    }
  });
};

export default plugin;
