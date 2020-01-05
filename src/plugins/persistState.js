const persistInterval = 12 * 60 * 60 * 1000;

const plugin = store => {
  store.subscribe((mutation, state) => {
    if ("initialize" === mutation.type) {
      let storage;
      try {
        storage = localStorage.getItem("auth") || false;
        if (storage) {
          storage = JSON.parse(storage);
        }
      } catch (e) {}

      if (storage) {
        if (storage.data.authenticated) {
          store.commit("login", storage.data.user);
        }
      }

      storage = false;

      try {
        storage = localStorage.getItem("categories") || false;
        if (storage) {
          storage = JSON.parse(storage);
        }
      } catch (e) {}

      if (storage && new Date().getTime() < storage.ts) {
        store.commit("setCategories", storage.data);
        store.dispatch("fetch_home_category_lists");
      } else {
        store.dispatch("fetchCategories");
      }

      storage = false;

      try {
        storage = localStorage.getItem("hotLists") || false;
        if (storage) {
          storage = JSON.parse(storage);
        }
      } catch (e) {}

      if (storage && new Date().getTime() < storage.ts) {
        store.commit("setHotLists", storage.data);
      } else {
        store.dispatch("fetch_sidebar_contents");
      }

      storage = false;

      try {
        storage = localStorage.getItem("hotDemands") || false;
        if (storage) {
          storage = JSON.parse(storage);
        }
      } catch (e) {}

      if (storage && new Date().getTime() < storage.ts) {
        store.commit("setHotDemands", storage.data);
      } else {
        store.dispatch("fetch_sidebar_contents");
      }
    } else if ("setCategories" === mutation.type) {
      let record = {
        data: state.categories,
        ts: new Date().getTime() + persistInterval
      };
      try {
        localStorage.setItem("categories", JSON.stringify(record));
      } catch (e) {}
    } else if ("login" === mutation.type) {
      let record = {
        data: { user: state.user, authenticated: state.authenticated }
      };
      try {
        new Promise(resolve => {
          localStorage.setItem("auth", JSON.stringify(record));
          resolve();
        }).then(() => {
          store.dispatch("watch_notifications");
        });
      } catch (e) {}
    } else if ("logout" === mutation.type) {
      let record = {
        data: {
          user: state.user,
          authenticated: state.authenticated,
          anonymous: state.anonymous
        }
      };
      try {
        localStorage.setItem("auth", JSON.stringify(record));
      } catch (e) {}
    } else if ("anonymousLogin" === mutation.type) {
      let record = {
        data: {
          user: state.user,
          authenticated: false,
          anonymous: true
        }
      };
      try {
        localStorage.setItem("auth", JSON.stringify(record));
      } catch (e) {}
    } else if ("setHotLists" === mutation.type) {
      let record = {
        data: state.hotLists,
        ts: new Date().getTime() + persistInterval
      };
      try {
        localStorage.setItem("hotLists", JSON.stringify(record));
      } catch (e) {}
    } else if ("setHotDemands" === mutation.type) {
      let record = {
        data: state.hotDemands,
        ts: new Date().getTime() + persistInterval
      };
      try {
        localStorage.setItem("hotDemands", JSON.stringify(record));
      } catch (e) {}
    }
  });
};

export default plugin;
