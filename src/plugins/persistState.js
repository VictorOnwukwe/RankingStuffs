const persistInterval = 12 * 60 * 60 * 1000;

const plugin = store => {
  store.subscribe(async (mutation, state) => {
    if ("initialize" === mutation.type) {
      let storage;

      try {
        storage = localStorage.getItem("categories") || false;
        if (storage) {
          storage = JSON.parse(storage);
        }
      } catch (e) {}

      if (
        storage &&
        new Date().getTime() < storage.ts &&
        storage.data.length > 0
      ) {
        store.commit("setCategories", storage.data);
        store.dispatch("fetch_home_category_lists");
      } else {
        if (new Date().getTime() >= storage.ts) {
          store.commit("setCategories", storage.data);
          store.dispatch("fetch_home_category_lists");
        }
        store.dispatch("fetchCategories").then(() => {
          if (!storage) {
            this.dispatch("fetch_home_category_lists");
          }
        });
      }

      storage = false;

      try {
        storage = localStorage.getItem("hotLists") || false;
        if (storage) {
          storage = JSON.parse(storage);
        }
      } catch (e) {}

      if (
        storage &&
        new Date().getTime() < storage.ts &&
        storage.data.length > 0
      ) {
        store.commit("setHotLists", storage.data);
      } else {
        if (new Date().getTime() >= storage.ts) {
          store.commit("setHotLists", storage.data);
        }
        store.dispatch("fetch_sidebar_lists");
      }

      storage = false;

      try {
        storage = localStorage.getItem("hotDemands") || false;
        if (storage) {
          storage = JSON.parse(storage);
        }
      } catch (e) {}

      if (
        storage &&
        new Date().getTime() < storage.ts &&
        storage.data.length > 0
      ) {
        store.commit("setHotDemands", storage.data);
      } else {
        if (new Date().getTime() >= storage.ts) {
          store.commit("setHotDemands", storage.data);
        }
        store.dispatch("fetch_sidebar_demands");
      }

      storage = false;

      try {
        storage = localStorage.getItem("auth") || false;
        if (storage) {
          storage = JSON.parse(storage);
        }
      } catch (e) {}

      if (storage) {
        if (storage.data.authenticated) {
          store.commit("login", storage.data.user);
          let user = await store.dispatch(
            "fetch_complete_user",
            storage.data.user.id
          );
          store.commit("login", user);
        } else if (storage.data.anonymous) {
          store.commit("anonymousLogin", storage.data.user);
        }
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
          setTimeout(() => {
            store.dispatch("watch_notifications");
          }, 1000);
        });
      } catch (e) {}
    } else if ("logout" === mutation.type) {
      let record = {
        data: {
          user: null,
          authenticated: false,
          anonymous: false
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
        ts: new Date().getTime() + persistInterval / 12
      };
      try {
        localStorage.setItem("hotLists", JSON.stringify(record));
      } catch (e) {}
    } else if ("setHotDemands" === mutation.type) {
      let record = {
        data: state.hotDemands,
        ts: new Date().getTime() + persistInterval / 12
      };
      try {
        localStorage.setItem("hotDemands", JSON.stringify(record));
      } catch (e) {}
    }
  });
};

export default plugin;
