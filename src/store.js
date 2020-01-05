import vuex from "vuex";
import Vue from "vue";
import firebase, { firestore } from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import { setPriority, userInfo } from "os";
import { async } from "q";
import swalErrors from "../public/my-modules/swalErrors";
import { stat } from "fs";
import { METHODS } from "http";
import createPersistedState from "vuex-persistedstate";
import { isNull } from "util";
import VuexPersistence from "vuex-persist";
import mypersist from "./plugins/persistState";

let moment = require("moment");

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});
Vue.use(vuex);

let store = new vuex.Store({
  plugins: [mypersist],
  state: {
    user: {},
    authenticated: false,
    anonymous: false,
    categories: [],
    loading: false,
    showSearch: false,
    hotLists: [],
    nophoto: "./assets/nophoto.jpg",
    hotDemands: [],
    followers: [],
    following: [],
    notifications: 0,
    login: false,
    signup: false,
    currentList: {},
    latestList: {},
    popularList: {},
    topRatedList: {},
    categoryLists: []
  },

  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },

    login(state, payload) {
      state.user = payload;
      state.authenticated = true;
      state.anonymous = false;
    },

    logout(state) {
      state.user = null;
      state.authenticated = false;
      state.anonymous = false;
    },

    setAuthenticated(state, payload) {
      state.authenticated = payload;
    },

    auth_success(state, payload) {
      state.user = payload;
      state.authenticated = true;
    },

    setCategories(state, payload) {
      state.categories = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setSearch(state, payload) {
      state.showSearch = payload;
    },
    setFollowers(state, payload) {
      state.followers.push(payload);
    },
    anonymousLogin(state, payload) {
      state.user = payload;
      state.anonymous = true;
      state.authenticated = false;
    },
    setLogin(state, payload) {
      state.login = payload;
    },
    setSignup(state, payload) {
      state.signup = payload;
    },
    setCurrentList(state, payload) {
      state.currentList = payload;
    },
    setHotLists(state, payload) {
      state.hotLists = payload;
    },
    setHotDemands(state, payload) {
      state.hotDemands = payload;
    },
    setLatestList(state, payload) {
      state.latestList = payload;
    },
    setPopularList(state, payload) {
      state.popularList = payload;
    },
    setTopRatedList(state, payload) {
      state.topRatedList = payload;
    },
    initialize(state) {},
    setCategoryLists(state, payload) {
      state.categoryLists.push(payload);
    }
  },

  getters: {
    authenticated: state => state.authenticated,
    getUser: state => state.user,
    getLoading: state => state.loading,
    showSearch: state => state.showSearch,
    nophoto: state => state.nophoto,
    semiAuthenticated: state => state.anonymous || state.authenticated,
    notifications: state => state.notifications,
    login: state => state.login,
    signup: state => state.signup,
    categories: state => state.categories,
    hotLists: state => state.hotLists,
    hotDemands: state => state.hotDemands,
    topRatedList: state => state.topRatedList,
    latestList: state => state.latestList,
    popularList: state => state.popularList,
    categoryLists: state => state.categoryLists
  },

  actions: {
    set_current_list({ commit }, list) {
      commit("setCurrentList", list);
    },
    set_search({ state, commit }, payload) {
      let send;
      if (payload === "toggle") send = !state.showSearch;
      else send = payload;

      commit("setSearch", send);
    },
    async fetch_sidebar_contents({ state, dispatch, commit }) {
      let lists = await dispatch("fetch_lists", {
        sort: "popularity",
        limit: 10
      }).then(lists => {
        return lists.map(list => {
          return { id: list.id, ...list.data() };
        });
      });
      commit("setHotLists", lists);
      let demands = await dispatch("fetch_demanded", {
        sort: "most-demanded",
        limit: 10
      }).then(demands => {
        return demands.map(demand => {
          return { id: demand.id, ...demand.data() };
        });
      });
      commit("setHotDemands", demands);
    },
    async set_loading({ commit }, payload) {
      commit("setLoading", payload);
    },

    set_login({ commit }, payload) {
      commit("setLogin", payload);
    },
    set_signup({ commit }, payload) {
      commit("setSignup", payload);
    },

    fetch_home_contents({ commit, dispatch, state }) {
      dispatch("fetch_lists", {
        sort: "popularity",
        limit: 1
      }).then(async lists => {
        let list = { id: lists[0].id, ...lists[0].data() };
        await dispatch("fetch_list_items", {
          list_id: list.id,
          limit: 3
        }).then(items => {
          list.items = items;
        });
        commit("setPopularList", list);
      });

      dispatch("fetch_lists", {
        sort: "newest",
        limit: 1
      }).then(async lists => {
        let list = { id: lists[0].id, ...lists[0].data() };
        await dispatch("fetch_list_items", {
          list_id: list.id,
          limit: 3
        }).then(items => {
          list.items = items;
        });
        commit("setLatestList", list);
      });

      dispatch("fetch_lists", {
        limit: 1,
        sort: "rating"
      }).then(async lists => {
        let list = { id: lists[0].id, ...lists[0].data() };
        await dispatch("fetch_list_items", {
          list_id: list.id,
          limit: 3
        }).then(items => {
          list.items = items;
        });
        commit("setTopRatedList", list);
      });
    },

    watch_notifications({ state }) {
      if (!state.authenticated) {
        return;
      }
      firebase
        .firestore()
        .collection("users")
        .doc(state.user.id)
        .collection("updates")
        .doc("data")
        .onSnapshot({ includeMetadataChanges: true }, doc => {
          if (doc.exists) {
            console.log("notification: ", doc.data().notifications);
            state.notifications = doc.data().notifications;
          }
        });
    },
    /********************************************************************************************************************/
    //ALL ABOUT SIGNUP

    async anonymous_login({ commit, state, dispatch }) {
      if (state.authenticated || state.anonymous) {
        return;
      }
      let auth = firebase.auth();

      await auth.signInAnonymously().catch(error => {
        console.log(error);
      });

      auth.onAuthStateChanged(async user => {
        if (user) {
          let randomName;
          randomName = "visitor" + Math.floor(Math.random() * 1000000);

          while (!dispatch("username_valid", randomName)) {
            randomName = randomName + Math.floor(Math.random() * 1000000);
          }

          firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .set({
              username: randomName,
              created: firebase.firestore.FieldValue.serverTimestamp()
            });
          commit("anonymousLogin", { username: randomName, id: user.uid });
          console.log("committed");
        } else {
          console.log("user signed out");
        }
      });
    },

    async emailSignup({ commit, dispatch }, credentials) {
      let auth = firebase.auth();
      let db = firebase.firestore();

      let user;
      let username = "";

      //get username
      if (credentials.username != null) {
        //username when user inputs username
        username = credentials.username;
      } else {
        //username generated from user email
        username = credentials.email.slice(0, credentials.email.indexOf("@"));

        //If username exists, add a random number between 1 and 3 and check again
        while (!dispatch("username_valid", username)) {
          username = username + Math.floor(Math.random() * 3);
        }
      }
      if (this.getters.semiAuthenticated) {
        let credential = await firebase.auth.EmailAuthProvider.credential(
          credentials.email,
          credentials.password
        );

        await auth.currentUser
          .linkAndRetrieveDataWithCredential(credential)
          .then(async userCred => {
            await db
              .collection("users")
              .doc(userCred.user.uid)
              .set({
                username: username,
                created: firebase.firestore.FieldValue.serverTimestamp(),
                email: credentials.email
              });
            commit("login", {
              id: userCred.user.uid,
              username: username,
              email: credentials.email
            });
            firebase
              .firestore()
              .collection("user_details")
              .doc(userCred.user.uid)
              .set({
                created: firebase.firestore.FieldValue.serverTimestamp(),
                followers: 0,
                following: 0,
                username: username,
                email: credentials.email
              });
          });

        return;
      }

      //authenticate with email and password
      return auth
        .createUserWithEmailAndPassword(credentials.email, credentials.password)
        .then(async result => {
          await db
            .collection("users")
            .doc(result.user.uid)
            .set({
              username: username,
              created: firebase.firestore.FieldValue.serverTimestamp(),
              email: credentials.email.toLowerCase()
            })
            .then(async () => {
              await db
                .collection("users")
                .doc(result.user.uid)
                .get()
                .then(user => {
                  commit("login", {
                    id: user.id,
                    ...user.data()
                  });
                });
              firebase
                .firestore()
                .collection("user_details")
                .doc(result.user.uid)
                .set({
                  created: firebase.firestore.FieldValue.serverTimestamp(),
                  followers: 0,
                  following: 0
                });
            });
        })
        .then(async () => {
          auth.currentUser
            .sendEmailVerification()
            .then(() => {
              console.log("Email verification sent");
            })
            .catch(error => {
              console.log("Error sending verification: ", error);
            });
        })
        .catch(error => {
          //catch and throw email exists error
          throw error;
        });
    },

    async emailLogin({ commit }, credentials) {
      let auth = firebase.auth();

      return auth
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(async () => {
          return await auth
            .signInWithEmailAndPassword(credentials.email, credentials.password)
            .then(async result => {
              await firebase
                .firestore()
                .collection("users")
                .doc(result.user.uid)
                .get()
                .then(user => {
                  commit("login", {
                    id: user.id,
                    ...user.data()
                  });
                });
            })
            .catch(error => {
              throw error;
            });
        })
        .catch(error => {
          throw error;
        });
    },

    async socialLogin({ commit, state }, authType) {
      let provider;
      let credential;
      let auth = firebase.auth();
      let db = firebase.firestore().collection("users");
      let user;
      let methods;
      if (authType === "G") {
        provider = new firebase.auth.GoogleAuthProvider();
      } else {
        provider = new firebase.auth.FacebookAuthProvider();
      }

      let signIn = async function(result) {
        methods = await auth.fetchSignInMethodsForEmail(result.user.email);
        await db
          .doc(result.user.uid)
          .get()
          .then(async user => {
            let displayName = "";
            if (user.exists) {
              let update = {};
              if (!user.data().profile_pic && result.user.photoURL) {
                update = {
                  profile_pic: {
                    low: result.user.photoURL,
                    high: result.user.photoURL,
                    created: firebase.firestore.FieldValue.serverTimestamp()
                  },
                  created: firebase.firestore.FieldValue.serverTimestamp()
                };
              } else if (user.data().username.includes("visitor")) {
                if (result.user.email === "") {
                  displayName = "user" + Math.floor(Math.random() * 1000);
                } else {
                  displayName = result.user.email
                    .slice(0, result.user.email.indexOf("@"))
                    .toLowerCase();
                }
                update = { username: displayName, ...update };
              }
              await db.doc(user.id).update(update);
              let nUser = {};
              if (displayName !== "") {
                nUser = { username: displayName };
              }else{
                nUser = {username: user.data().username}
              }
              if (result.user.email !== "") {
                nUser = { email: result.user.email, ...nUser };
              }
              nUser = {
                id: user.id,
                profile_pic: {
                  high: user.data().profile_pic.high,
                  low: user.data().profile_pic.low,
                  created: firebase.firestore.FieldValue.serverTimestamp()
                },
                created: user.data().created,
                ...nUser
              };
              commit("login", nUser);
              return;
            } else {
              if (result.user.email === "") {
                displayName = "user" + Math.floor(Math.random() * 1000);
              } else {
                displayName = result.user.email
                  .slice(0, result.user.email.indexOf("@"))
                  .toLowerCase();
              }

              let newUser = {
                username: displayName,
                id: result.user.uid,
                email: result.user.email.toLowerCase()
              };

              let update = {};
              result.user.photoURL
                ? (update = {
                    profile_pic: {
                      low: result.user.photoURL,
                      high: result.user.photoURL,
                      created: firebase.firestore.FieldValue.serverTimestamp()
                    }
                  })
                : null;
              await db.doc(result.user.uid).set({
                username: displayName,
                created: firebase.firestore.FieldValue.serverTimestamp(),
                email: result.user.email.toLowerCase(),
                ...update
              });

              firebase
                .firestore()
                .collection("user_details")
                .doc(result.user.uid)
                .set({
                  created: firebase.firestore.FieldValue.serverTimestamp()
                });

              commit("login", {
                ...update,
                ...newUser
              });
              return displayName;
            }
          });
      };

      // if (this.getters.semiAuthenticated) {
      //   console.log("Anonymous");
      //   return auth.currentUser.linkWithPopup(provider).then(userCred => {
      //     console.log(userCred);
      //     signIn(userCred);
      //   });
      // }

      return firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          return auth
            .signInWithPopup(provider)
            .then(async result => {
              signIn(result);
            })
            .catch(error => {
              if (
                error.code === "auth/account-exists-with-different-credential"
              ) {
                let pendingCred = error.credential;
                let email = error.email;
                auth.fetchSignInMethodsForEmail(email).then(async methods => {
                  if (methods[0] === "password" && methods.length === 1) {
                    // @ts-ignore
                    const { value: password } = await Swal.fire({
                      text:
                        "You previously logged in with this email. Enter your password to continue",
                      input: "password",
                      inputPlaceholder: "Enter your password",
                      inputAttributes: {
                        autocapitalize: "off",
                        autocorrect: "off"
                      }
                    }); // TODO: implement promptUserForPassword.
                    if (password) {
                      auth
                        .signInWithEmailAndPassword(email, password)
                        .then(() => {
                          // Step 4a.
                          auth.currentUser.linkWithCredential(pendingCred);
                          return auth.currentUser;
                        })
                        .then(result => {
                          db.doc(result.uid)
                            .get()
                            .then(user => {
                              commit("login", {
                                id: user.id,
                                ...user.data()
                              });
                            });
                        })
                        .catch(error => {
                          throw error;
                        });
                    }
                    return;
                  }
                  let new_provider;
                  let popupMessage;

                  if (methods[0] === "google.com") {
                    new_provider = new firebase.auth.GoogleAuthProvider();
                    popupMessage =
                      "You have already signed up with Google. Do you want to continue?";
                  } else if (methods[0] === "facebook.com") {
                    new_provider = new firebase.auth.FacebookAuthProvider();
                    popupMessage =
                      "You have already signed up with Facebook. Do you want to continue?";
                  }

                  Swal.fire({
                    text: popupMessage,
                    type: "question",
                    showConfirmButton: true,
                    confirmButtonText: "YES",
                    showCancelButton: true,
                    cancelButtonText: "NO"
                  }).then(result => {
                    if (result.value) {
                      auth
                        .signInWithPopup(new_provider)
                        .then(result => {
                          result.user.linkWithCredential(pendingCred);
                          return result;
                        })
                        .then(result => {
                          db.doc(result.user.uid)
                            .get()
                            .then(user => {
                              commit("login", {
                                id: user.id,
                                ...user.data()
                              });
                            });
                        })
                        .catch(error => {
                          throw error;
                        });
                    } else {
                      throw Error("No login");
                    }
                  });
                });
              }
            });
        });
    },

    async logout({ commit }) {
      await firebase
        .auth()
        .signOut()
        .then(() => {
          commit("logout");
        });
    },

    /******************************************************************************************************************/

    //ALL ABOUT USER

    async fetch_user({ commit }, id) {
      return await firebase
        .firestore()
        .collection("users")
        .doc(id)
        .get()
        .then(documentSnapshot => {
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data()
          };
        })
        .catch(error => {
          throw error;
        });
    },

    async update_profile_pic({ commit, state }, upload) {
      let user = firebase
        .firestore()
        .collection("users")
        .doc(state.user.id);

      let batch = firebase.firestore().batch();

      let low_image, high_image, lowUrl, highUrl;

      low_image = await firebase
        .storage()
        .ref("profile_pics/" + state.user.id + "/low.jpeg")
        .put(upload.low);

      high_image = await firebase
        .storage()
        .ref("profile_pics/" + state.user.id + "/high.jpeg")
        .put(upload.high);

      lowUrl = await low_image.ref.getDownloadURL();
      highUrl = await high_image.ref.getDownloadURL();

      batch.update(user, {
        profile_pic: {
          low: lowUrl,
          high: highUrl,
          created: firebase.firestore.FieldValue.serverTimestamp()
        }
      });
      let userDetail = firebase
        .firestore()
        .collection("user_details")
        .doc(state.user.id);

      batch.update(userDetail, {
        profile_pic: {
          low: lowUrl,
          high: highUrl
        }
      });
      batch
        .commit()
        .then(() => {
          commit("login", {
            username: state.user.username,
            email: state.user.email,
            profile_pic: {
              low: lowUrl,
              high: highUrl,
              created: firebase.firestore.FieldValue.serverTimestamp()
            },
            id: state.user.id
          });
        })
        .catch(error => {
          throw error;
        });
    },

    async fetch_complete_user({ commit }, id) {
      let data;
      let db = firebase.firestore();

      await db
        .collection("users")
        .doc(id)
        .get()
        .then(doc => {
          data = {
            id: doc.id,
            ...doc.data()
          };
        })
        .then(async () => {
          await db
            .collection("user_details")
            .doc(id)
            .get()
            .then(doc => {
              data = {
                ...doc.data(),
                ...data
              };
            });
        })
        .catch(error => {
          throw error;
        });

      return data;
    },

    async set_profile({ state }, payload) {
      let users = firebase.firestore().collection("user_details");

      // if (payload.DOB !== undefined) {
      //   payload.DOB = new firebase.firestore.Timestamp.fromDate(
      //     new Date(payload.date)
      //   );
      // }

      return users
        .doc(state.user.id)
        .update(payload)
        .catch(error => {
          throw error;
        });
    },

    async set_permissions({ state }, payload) {
      let users = firebase.firestore().collection("users");

      users
        .doc(state.user.id)
        .collection("permissions")
        .doc("data")
        .update(payload);
    },

    async follow_user({ state, dispatch }, user) {
      let followed = firebase
        .firestore()
        .collection("user_details")
        .doc(user.id);

      let follower = firebase
        .firestore()
        .collection("user_details")
        .doc(state.user.id);
      let batch = firebase.firestore().batch();

      batch.set(followed.collection("followers").doc(state.user.id), {
        user: state.user.id
      });
      batch.update(followed, {
        followers: firebase.firestore.FieldValue.increment(1)
      });
      batch.set(follower.collection("following").doc(user.id), {
        user: user.id
      });
      batch.update(follower, {
        following: firebase.firestore.FieldValue.increment(1)
      });

      batch
        .commit()
        .then(() => {
          dispatch("send_notification", {
            type: "follow",
            user: user
          });
        })
        .catch(error => {
          throw error;
        });
    },

    async unfollow_user({ state }, id) {
      let unfollowed = firebase
        .firestore()
        .collection("user_details")
        .doc(id);

      let unfollower = firebase
        .firestore()
        .collection("user_details")
        .doc(state.user.id);

      let batch = firebase.firestore().batch();

      batch.delete(unfollowed.collection("followers").doc(state.user.id));
      batch.update(unfollowed, {
        followers: firebase.firestore.FieldValue.increment(-1)
      });
      batch.delete(unfollower.collection("following").doc(id));
      batch.update(unfollower, {
        following: firebase.firestore.FieldValue.increment(-1)
      });
      batch.commit().catch(error => {
        throw error;
      });
    },

    async check_following({ state }, id) {
      if (!state.authenticated) {
        return;
      }
      return await firebase
        .firestore()
        .collection("user_details")
        .doc(id)
        .collection("followers")
        .doc(state.user.id)
        .get()
        .then(doc => {
          return doc.exists;
        })
        .catch(error => {
          throw error;
        });
    },

    /******************************************************************************************************************/

    // ALL ABOUT LIST

    async upload_pending_list({ state }, list) {
      let pending = firebase.firestore().collection("pending_lists");

      return await pending
        .add(list)
        .then(() => {
          return true;
        })
        .catch(error => {
          throw error;
        });
    },

    async fetch_pending_lists({ state }, payload) {
      let pending = firebase.firestore().collection("pending_lists");
      return pending
        .limit(payload.limit)
        .get()
        .then(query => {
          return query.docs;
        })
        .catch(error => {
          throw error;
        });
    },

    async delete_pending_list({ state }, id) {
      firebase
        .firestore()
        .collection("pending_lists")
        .doc(id)
        .delete()
        .catch(error => {
          throw error;
        });
    },

    async upload_list({ state, dispatch }, list) {
      let db = firebase.firestore();
      let dbList = firebase.firestore().collection("lists");
      let userDetail = firebase
        .firestore()
        .collection("user_details")
        .doc(state.user.id);
      let batch = firebase.firestore().batch();
      let length = list.items.length;
      let votes = (length * (length + 1)) / 2;
      let commentCount = list.items.filter(item => {
        item.comment !== "";
      }).length;

      let popularity = (votes + commentCount / 5) / 3;

      list.category = list.category.toLowerCase();
      list.subCategory = list.subCategory.toLowerCase();

      let others = {};
      let features = [];

      list.description !== ""
        ? (others = { description: list.description })
        : null;
      list.selfModerated ? (others = { self_moderated: true }) : null;
      // list.tags !== [] ? (others = { tags: list.tags, ...others }) : null;
      if (list.category == "") {
        list.category = "miscellaneous";
      } else {
        if (list.subCategory == "") {
          null;
        } else {
          others = {
            sub_category: list.subCategory.toLowerCase(),
            ...others
          };
        }
      }

      batch.set(dbList.doc(list.id), {
        //add properties to list
        title: list.title.toLowerCase(),
        votes: votes,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        user: list.user.id,
        rating: 0,
        raters_count: 0,
        item_count: length,
        preview_image: list.preview_image,
        votable: list.votable,
        personal: list.personal,
        category: list.category,
        comment_count: commentCount,
        popularity: popularity,
        rating_score: 0,
        voters_count: 1,
        ...others
      });

      //loops through all items received. Uploads each item as a new document in lists/list id/items collection
      for (let i = 0; i < list.items.length; i++) {
        await dispatch("add_list_item", {
          list: list,
          net_vote: list.items.length - i,
          item: list.items[i],
          first_addition: true,
          rank: i + 1
        }).then(details => {
          if (details.info) {
            features.push(details.info);
          }
        });
      }
      batch.set(db.collection("list_features").doc(list.id), {
        items: features
      });

      batch.set(db.collection("list_keywords").doc(list.id), {
        words: list.keywords,
        title: list.title.toLowerCase()
      });

      batch.update(db.collection("user_details").doc(list.user.id), {
        lists: firebase.firestore.FieldValue.increment(1)
      });
      batch.update(db.collection("categories").doc(list.category), {
        list_count: firebase.firestore.FieldValue.increment(1)
      });
      batch.update(db.collection("categories").doc(list.category), {
        list_count: firebase.firestore.FieldValue.increment(1)
      });
      if (list.subCategory !== "") {
        batch.update(
          db
            .collection("categories")
            .doc(list.category)
            .collection("subs")
            .doc(list.subCategory),
          { list_count: firebase.firestore.FieldValue.increment(1) }
        );
      }

      await batch.commit().then(() => {
        console.log("committed");
        if (list.demanded) {
          this.dispatch("send_notification", {
            type: "demand-created",
            list: { id: list.id, title: list.title, user: list.user },
            demand_id: list.demand_id,
            title: list.title
          }).then(() => {
            this.dispatch("delete_demand", list.demand_id);
          });
        }
        let image = {};
        list.preview_image ? (image = { image: list.preview_image.low }) : null;
        this.dispatch("update_activities", {
          type: "list",
          list: {
            title: list.title,
            id: list.id,
            ...image
          },
          recipient: list.user.id
        });
        // if (!list.personal) {
        //   this.dispatch("update_happening", {
        //     type: "list",
        //     list: {
        //       title: list.title,
        //       id: list.id,
        //       ...image
        //     }
        //   });
        // }
      });
    },

    async rate_list({ state }, payload) {
      let db = firebase.firestore();
      let batch = db.batch();
      let list = db.collection("lists").doc(payload.list.id);
      let newRating;
      if (!this.getters.semiAuthenticated) {
        await this.dispatch("anonymous_login");
      }
      return db
        .runTransaction(async transaction => {
          return transaction.get(list).then(doc => {
            newRating =
              Math.round(
                ((doc.data().rating * doc.data().raters_count +
                  payload.rating) /
                  (doc.data().raters_count + 1)) *
                  10
              ) / 10;
            let ratingScore, exp;
            exp = (doc.data().raters_count + 1) / 144;
            ratingScore = newRating + 5 * (1 - Math.pow(2.718, exp));

            transaction.update(list, {
              rating: newRating,
              raters_count: firebase.firestore.FieldValue.increment(1),
              rating_score: ratingScore
            });
            transaction.set(
              db
                .collection("lists")
                .doc(payload.list.id)
                .collection("raters")
                .doc(state.user.id),
              {
                user: state.user.id,
                rating: payload.rating,
                created: firebase.firestore.FieldValue.serverTimestamp()
              }
            );
          });
        })
        .then(() => {
          let image = {};
          payload.list.preview_image
            ? (image = { image: payload.list.preview_image.url.low })
            : null;

          this.dispatch("update_activities", {
            type: "rate",
            rating: payload.rating,
            raters_count: payload.list.raters_count,
            list: {
              title: payload.list.title,
              id: payload.list.id,
              ...image
            }
          });
          // this.dispatch("update_happening", {
          //   type: "rate",
          //   rating: payload.rating,
          //   raters_count: payload.list.raters_count,
          //   list: {
          //     title: payload.list.title,
          //     id: payload.list.id,
          //     ...image
          //   }
          // });
          this.dispatch("update_popularity", payload.list.id);
          return newRating;
        });
    },

    async check_rated({ state }, id) {
      if (!this.getters.semiAuthenticated) {
        return false;
      }
      return await firebase
        .firestore()
        .collection("lists")
        .doc(id)
        .collection("raters")
        .doc(state.user.id)
        .get()
        .then(doc => {
          return doc.data();
        });
    },

    async update_list_preview({ state }, payload) {
      firebase
        .firestore()
        .collection("lists")
        .doc(payload.id)
        .update({
          preview_image: payload.image
        });
    },

    async add_list_item({ state }, payload) {
      let db = firebase.firestore();
      let batch = db.batch();

      let list = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list.id);
      let itemID = payload.item.name.toLowerCase();
      let user;

      payload.list.user
        ? (user = payload.list.user)
        : (user = { id: state.user.id, username: state.user.username });

      let ID;

      console.log("adding item");

      if (!payload.item.info && payload.item.isLink) {
        await db
          .collection("items")
          .add({
            name: payload.item.name.toLowerCase(),
            media_count: 0,
            keywords: payload.item.keywords
          })
          .then(docref => {
            db.collection("items")
              .doc(docref.id)
              .collection("contributors")
              .doc(user.id)
              .set({ user: user });
            ID = docref.id;
          });
      } else if (payload.item.info) {
        ID = payload.item.info;
        payload.item.isLink = true;
      } else {
        ID = false;
      }
      let comment_count, others;

      ID ? (others = { info: ID }) : {};

      payload.item.comment ? (comment_count = 1) : (comment_count = 0);

      batch.set(list.collection("items").doc(itemID), {
        rank: payload.rank,
        name: payload.item.name,
        net_vote: payload.net_vote,
        upvotes: payload.net_vote,
        downvotes: 0,
        list_id: payload.list.id,
        comment_count: comment_count,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        user: user.id,
        is_link: payload.item.isLink,
        ...others
      });

      if (payload.item.comment) {
        await this.dispatch("upload_comment", {
          list: payload.list,
          user: payload.list.user,
          item: { id: itemID, ...payload.item },
          comment: payload.item.comment,
          first_addition: true
        });
      }
      if (!payload.first_addition) {
        let data = {};
        if (payload.item.comment) {
          data = {
            item_count: firebase.firestore.FieldValue.increment(1)
          };
        }
        batch.update(list, {
          vote_count: firebase.firestore.FieldValue.increment(payload.votes),
          item_count: firebase.firestore.FieldValue.increment(1),
          ...data
        });
        batch.update(db.collection("list_features").doc(payload.list.id), {
          featured_items: firebase.firestore.FieldValue.arrayUnion(ID)
        });
      }

      return batch.commit().then(() => {
        if (!payload.first_addition) {
          let image = {};
          payload.item.image
            ? (image = { image: payload.item.image.low })
            : null;
          this.dispatch("update_activities", {
            type: "item",
            item: {
              info: ID,
              name: payload.item.name,
              ...image
            },
            list: {
              id: payload.list.id,
              title: payload.list.title
            }
          });
          // this.dispatch("update_happening", {
          //   type: "item",
          //   item: {
          //     info: ID,
          //     name: payload.item.name,
          //     ...image
          //   },
          //   list: {
          //     id: payload.list.id,
          //     title: payload.list.title
          //   }
          // });
          return {
            data() {
              return {
                info: ID,
                rank: payload.rank,
                name: payload.item.name,
                net_vote: payload.net_vote,
                upvotes: payload.net_vote,
                downvotes: 0,
                list_id: payload.list.id,
                comment_count: comment_count,
                created: firebase.firestore.FieldValue.serverTimestamp(),
                user: payload.user.id,
                is_link: payload.item.isLink
              };
            },
            id: itemID
          };
        } else {
          if (ID) {
            return { info: ID };
          } else {
            return {};
          }
        }
      });
    },

    async set_item_rank({ commit }, payload) {
      firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .update({
          rank: payload.rank
        });
    },

    async fetch_item_rank({ commit }, payload) {
      return firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .where("info", "==", payload.item.id)
        .get()
        .then(query => {
          return query.docs;
        });
    },

    async update_popularity({ state }, id) {
      let db = firebase.firestore();
      let list = firebase
        .firestore()
        .collection("lists")
        .doc(id);
      let popularity;

      db.runTransaction(async transaction => {
        await transaction.get(list).then(list => {
          popularity =
            (list.data().votes +
              2 * list.data().raters_count +
              list.data().comment_count / 5) /
            3;
        });

        transaction.update(list, {
          popularity: popularity
        });
      });
    },

    async fetch_complete_list({ commit, state }, id) {
      let db = firebase
        .firestore()
        .collection("lists")
        .doc(id);
      let list = {};

      return db
        .get()
        .then(doc => {
          list = {
            id: doc.id,
            ...doc.data()
          };
        })
        .then(async () => {
          await db
            .collection("items")
            .orderBy("net_vote", "desc")
            .orderBy("created")
            .limit(50)
            .get()
            .then(async querySnapshot => {
              list.items = querySnapshot.docs;
            });
        })
        .then(() => {
          return list;
        });
    },

    async fetch_list({ state }, id) {
      return await firebase
        .firestore()
        .collection("lists")
        .doc(id)
        .get()
        .then(doc => {
          return doc.exists ? { id: id, ...doc.data() } : false;
        });
    },

    async fetch_list_with_items({ state }, id) {
      return await firebase
        .firestore()
        .collection("lists")
        .doc(id)
        .get()
        .then(async doc => {
          return {
            id: id,
            ...doc.data(),
            items: await this.dispatch("fetch_list_items", {
              list_id: id,
              limit: 3
            })
          };
        });
    },

    async fetch_list_items({ commit }, payload) {
      let list = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id);
      let query;
      if (payload.lastDoc) {
        query = list
          .collection("items")
          .orderBy("net_votes", "desc")
          .orderBy("created")
          .startAfter(payload.lastDoc);
      } else {
        query = list
          .collection("items")
          .orderBy("net_vote", "desc")
          .orderBy("created");
      }

      return query
        .limit(payload.limit)
        .get()
        .then(query => {
          return query.docs;
        });
    },

    async favorite_item({ state }, payload) {
      let db = firebase.firestore();
      let batch = db.batch();

      // if (!payload.item.info) {
      //   await db
      //     .collection("items")
      //     .add({
      //       name: payload.item.name.toLowerCase(),
      //       media_count: 0,
      //       keywords: payload.item.keywords
      //     })
      //     .then(docref => {
      //       db.collection("items")
      //         .doc(docref.id)
      //         .collection("contributors")
      //         .doc(state.user.id)
      //         .set({
      //           id: state.user.id,
      //           username: state.user.username
      //         });
      //       ID = docref.id;
      //     });
      // } else {
      //   ID = payload.item.info;
      // }

      let data = {};

      if (payload.item.info) {
        data = { info: payload.item.info };
      }

      payload.comment !== "" ? (data = { comment: payload.comment }) : null;

      let user = db.collection("user_details").doc(state.user.id);
      let fav = user
        .collection("favorites")
        .doc("data")
        .collection("items")
        .doc(payload.category);

      batch.set(fav, {
        name: payload.item.name.toLowerCase(),
        created: firebase.firestore.FieldValue.serverTimestamp(),
        ...data
      });
      batch.update(user, {
        favorite_items: firebase.firestore.FieldValue.increment(1)
      });

      batch.commit().catch(error => {
        throw error;
      });
    },

    async unfavorite_item({ state }, payload) {
      let db = firebase.firestore();
      let batch = db.batch();
      let loc = firebase
        .firestore()
        .collection("user_details")
        .doc(state.user.id)
        .collection("favorites")
        .doc("data");

      batch.delete(loc.collection("items").doc(payload));
      batch.update(db.collection("user_details").doc(state.user.id), {
        favorite_items: firebase.firestore.FieldValue.increment(-1)
      });
      batch.commit().catch(error => {
        throw error;
      });
    },

    async fetch_favorite_items({ state }, payload) {
      if (payload.timestamp == "now") {
        payload.timestamp = new firebase.firestore.Timestamp.now();
      }
      return firebase
        .firestore()
        .collection("user_details")
        .doc(payload.user)
        .collection("favorites")
        .doc("data")
        .collection("items")
        .where("created", "<", payload.timestamp)
        .limit(payload.limit)
        .get()
        .then(query => {
          return query.docs;
        });
    },

    async fetch_favorite_lists({ state }, payload) {
      if (!payload.timestamp) {
        payload.timestamp = new firebase.firestore.Timestamp.fromDate(
          new Date()
        );
      }
      return firebase
        .firestore()
        .collection("user_details")
        .doc(payload.user)
        .collection("favorites")
        .doc("data")
        .collection("lists")
        .orderBy("created", "desc")
        .where("created", "<", payload.timestamp)
        .limit(payload.limit)
        .get()
        .then(query => {
          return query.docs;
        });
    },

    async favorite_list({ state }, payload) {
      if (!this.getters.semiAuthenticated) {
        await this.dispatch("anonymous_login");
      }
      let user = firebase
        .firestore()
        .collection("user_details")
        .doc(state.user.id);
      let favorites = user.collection("favorites/data/lists");

      let batch = firebase.firestore().batch();

      batch.set(favorites.doc(payload.id), {
        created: firebase.firestore.FieldValue.serverTimestamp(),
        list: payload.id
      });

      batch.update(user, {
        favorite_lists: firebase.firestore.FieldValue.increment(1)
      });

      batch.commit().catch(error => {
        throw error;
      });
    },

    async unfavorite_list({ state }, payload) {
      let db = firebase.firestore();
      let batch = db.batch();
      let loc = firebase
        .firestore()
        .collection("user_details")
        .doc(state.user.id)
        .collection("favorites")
        .doc("data");
      let user = db.collection("user_details").doc(state.user.id);

      batch.delete(loc.collection("lists").doc(payload));
      batch.update(user, {
        favorite_lists: firebase.firestore.FieldValue.increment(-1)
      });

      batch.commit().catch(error => {
        throw error;
      });
    },

    async check_list_favorited({ state }, payload) {
      if (!this.getters.semiAuthenticated) {
        return false;
      }
      return await firebase
        .firestore()
        .collection("user_details")
        .doc(state.user.id)
        .collection("favorites")
        .doc("data")
        .collection("lists")
        .doc(payload)
        .get()
        .then(doc => {
          return doc.exists;
        });
    },

    async fetch_user_general_lists({ state }) {
      return await firebase
        .firestore()
        .collection("lists")
        .where("user", "==", state.user.id)
        .where("personal", "==", false)
        .orderBy("created")
        .get()
        .then(async querySnapshot => {
          return await querySnapshot.docs;
        })
        .catch(error => {
          console.log("error: ", error);
        });
    },

    async fetch_user_personal_lists({ state }) {
      return await firebase
        .firestore()
        .collection("lists")
        .where("user", "==", state.user.id)
        .where("personal", "==", true)
        .orderBy("created")
        .get()
        .then(async querySnapshot => {
          return await querySnapshot.docs;
        })
        .catch(error => {
          console.log("error: ", error);
        });
    },

    async fetch_user_lists({ state }, payload) {
      let db = firebase.firestore().collection("lists");
      let search;
      if (!payload.timestamp) {
        payload.timestamp = new firebase.firestore.Timestamp.now();
      }

      search = db.where("user", "==", payload.user);

      return search
        .where("created", "<", payload.timestamp)
        .orderBy("created", "desc")
        .limit(payload.limit)
        .get()
        .then(query => {
          return query.docs;
        });
    },

    async fetch_user_demands({ state }, payload) {
      let db = firebase.firestore().collection("demands");
      if (!payload.timestamp) {
        payload.timestamp = new firebase.firestore.Timestamp.now();
      }
      return db
        .where("user", "==", payload.user)
        .where("created", "<", payload.timestamp)
        .orderBy("created", "desc")
        .limit(payload.limit)
        .get()
        .then(query => {
          return query.docs;
        });
    },

    async update_item({ state }, payload) {
      if (!this.getters.semiAuthenticated) {
        await this.dispatch("anonymous_login");
      }
      let batch = firebase.firestore().batch();
      let itemLoc = firebase
        .firestore()
        .collection("items")
        .doc(payload.item.id);

      batch.update(itemLoc, update);
      batch.set(itemLoc.collection("contributors").doc(state.user.id), {
        id: state.user.id,
        username: state.user.username
      });
      batch.commit().catch(error => {
        throw error;
      });
    },

    async upload_item_image({ state }, update) {
      if (!this.getters.semiAuthenticated) {
        await this.dispatch("anonymous_login");
      }
      let itemLoc = firebase
        .firestore()
        .collection("items")
        .doc(update.item.id);

      let low_image, high_image, low_url, high_url;

      low_image = await firebase
        .storage()
        .ref("items/" + update.item.id + "/" + 1 + "/low.jpeg")
        .put(update.image.low);
      high_image = await firebase
        .storage()
        .ref("items/" + update.item.id + "/" + 1 + "/high.jpeg")
        .put(update.image.high);

      low_url = await low_image.ref.getDownloadURL();
      high_url = await high_image.ref.getDownloadURL();

      return await itemLoc
        .collection("media")
        .add({
          source: update.source,
          src: {
            low: low_url,
            high: high_url
          },
          votes: 1,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          user: state.user.id
        })
        .then(doc => {
          let upload;
          update.item.image
            ? (upload = {
                media_count: firebase.firestore.FieldValue.increment(1)
              })
            : (upload = {
                media_count: firebase.firestore.FieldValue.increment(1),
                image: {
                  id: doc.id,
                  url: {
                    low: low_url,
                    high: high_url
                  }
                }
              });
          itemLoc.update(upload);
          this.dispatch("update_activities", {
            type: "item-update",
            item: {
              info: update.item.id,
              name: update.item.name,
              image: low_url
            }
          });
        });
    },

    async fetch_item({ commit }, payload) {
      let item = firebase
        .firestore()
        .collection("items")
        .doc(payload);
      return item.get().then(docref => {
        return { id: docref.id, ...docref.data() };
      });
    },

    async fetch_item_featured({ state }, id) {
      return firebase
        .firestore()
        .collection("list_features")
        .where("items", "array-contains", id)
        .get()
        .then(query => {
          return query.docs;
        });
      // return firebase
      //   .firestore()
      //   .collection("list_features")
      //   .where("featured_items", "array-contains", id)
      //   .get()
      //   .then(query => {
      //     return query.docs.map(doc => {
      //       return { id: doc.id, ...doc.data() };
      //     });
      //   });
    },

    async fetch_item_image({ state }, payload) {
      return firebase
        .firestore()
        .collection("items")
        .doc(payload.item_id)
        .collection("media")
        .doc(payload.image_id)
        .get()
        .then(doc => {
          return {
            id: doc.id,
            ...doc.data()
          };
        });
    },

    async convert_keywords({ state }) {
      let lists = firebase.firestore().collection("lists");
      let keywords = firebase.firestore().collection("list_keywords");

      lists
        .get()
        .then(query => {
          query.docs.forEach(doc => {
            keywords.doc(doc.id).set({
              words: doc.data().keywords,
              title: doc.data().title
            });
          });
        })
        .then(() => {
          console.log("done");
        });
    },

    /**************************************************************************************************************/
    //    ALL ABOUT COMMENTS

    async upload_comment({ state }, payload) {
      if (!this.getters.semiAuthenticated) {
        await this.dispatch("anonymous_login");
      }
      let user;
      payload.user
        ? (user = payload.user)
        : (user = { id: state.user.id, username: state.user.username });
      let list = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list.id);
      let item = list.collection("items").doc(payload.item.id);
      let comment = item.collection("comments").doc();

      const batch = firebase.firestore().batch();

      batch.set(comment, {
        content: payload.comment,
        user: user,
        created: firebase.firestore.FieldValue.serverTimestamp()
      });

      if (!payload.first_addition) {
        batch.update(item, {
          comment_count: firebase.firestore.FieldValue.increment(1)
        });
        batch.update(list, {
          comment_count: firebase.firestore.FieldValue.increment(1)
        });
      }

      return batch
        .commit()
        .then(() => {
          if (!payload.first_addition) {
            let image = {};
            payload.item.image ? (image = { image: payload.item.image }) : null;

            this.dispatch("update_activities", {
              type: "comment",
              comment: payload.comment,
              item: {
                name: payload.item.name,
                id: payload.item.id,
                ...image
              },
              list: {
                title: payload.list.title,
                id: payload.list.id
              },
              recipient: user.id
            });
            this.dispatch("update_popularity", payload.list.id);
            return {
              id: comment.id,
              data() {
                return {
                  content: payload.comment,
                  user: user,
                  created: firebase.firestore.Timestamp.fromDate(new Date())
                };
              }
            };
          }
        })
        .catch(error => {
          throw error;
        });
    },

    async edit_comment({ state }, payload) {
      await firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .doc(payload.comment_id)
        .update({
          content: payload.newContent,
          edited: true
        });
    },

    async delete_comment({ state }, payload) {
      await firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .doc(payload.comment_id)
        .delete();
    },

    async edit_reply({ state }, payload) {
      await firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .doc(payload.comment_id)
        .collection("replies")
        .doc(payload.reply_id)
        .update({
          content: payload.newReply,
          edited: true
        });
    },

    async delete_reply({ state }, payload) {
      await firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .doc(payload.comment_id)
        .collection("replies")
        .doc(payload.reply_id)
        .delete();
    },

    async fetch_comments({ commit }, payload) {
      let db = firebase.firestore();
      let query;

      if (payload.lastDoc) {
        query = db
          .collection("lists")
          .doc(payload.list_id)
          .collection("items")
          .doc(payload.item_id)
          .collection("comments")
          .orderBy("created", "desc")
          .startAfter(payload.lastDoc)
          .limit(payload.limit);
      } else {
        query = db
          .collection("lists")
          .doc(payload.list_id)
          .collection("items")
          .doc(payload.item_id)
          .collection("comments")
          .orderBy("created", "desc")
          .limit(payload.limit);
      }

      return await query
        .get()
        .then(querySnapshot => {
          return querySnapshot.docs;
        })
        .catch(error => {
          console.log(error);
        });
    },

    async likeComment({ commit, state }, payload) {
      if (!this.getters.semiAuthenticated) {
        await this.dispatch("anonymous_login");
      }
      let batch = firebase.firestore().batch();
      let comment = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .doc(payload.comment_id);

      batch.set(comment.collection("likers").doc(state.user.id), {
        user: state.user.id
      });
      batch.update(comment, {
        likes: firebase.firestore.FieldValue.increment(1)
      });
      batch.commit().catch(error => {
        throw error;
      });
    },

    async unlikeComment({ commit, state }, payload) {
      let batch = firebase.firestore().batch();
      let comment = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .doc(payload.comment_id);

      batch.delete(comment.collection("likers").doc(state.user.id));
      batch.update(comment, {
        likes: firebase.firestore.FieldValue.increment(-1)
      });
      batch.commit().catch(error => {
        throw error;
      });
    },

    async comment_liked({ state }, payload) {
      return !this.getters.semiAuthenticated
        ? false
        : await firebase
            .firestore()
            .collection("lists")
            .doc(payload.list_id)
            .collection("items")
            .doc(payload.item_id)
            .collection("comments")
            .doc(payload.comment_id)
            .collection("likers")
            .doc(state.user.id)
            .get()
            .then(doc => {
              return doc.exists;
            });
    },

    async upload_reply({ commit, state }, payload) {
      if (!this.getters.semiAuthenticated) {
        await this.dispatch("anonymous_login");
      }
      let batch = firebase.firestore().batch();
      let comment = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .doc(payload.comment_id);
      let reply = comment.collection("replies").doc();

      batch.set(reply, {
        content: payload.reply,
        user: { id: state.user.id, username: state.user.username },
        created: firebase.firestore.FieldValue.serverTimestamp()
      });
      batch.update(comment, {
        replies_count: firebase.firestore.FieldValue.increment(1)
      });

      return batch
        .commit()
        .then(() => {
          this.dispatch("update_activities", {
            type: "reply",
            comment: {
              id: payload.comment_id,
              content: payload.comment_content
            },
            reply: {
              id: reply.id,
              content: payload.reply
            },
            item: {
              id: payload.item_id,
              name: payload.item_name
            },
            list: {
              id: payload.list_id,
              title: payload.list_title
            },
            ...payload.commenter
          });
        })
        .then(() => {
          return {
            id: reply.id,
            data: () => {
              return {
                content: payload.reply,
                user: { id: state.user.id, username: state.user.username },
                created: firebase.firestore.Timestamp.fromDate(new Date())
              };
            }
          };
        })
        .catch(error => {
          console.log(error);
        });
    },

    async fetch_replies({ commit }, payload) {
      let db = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .doc(payload.comment_id)
        .collection("replies")
        .orderBy("created", "desc");
      let query;

      if (payload.lastDoc) {
        query = db.startAfter(payload.lastDoc).limit(payload.limit);
      } else {
        query = db.limit(payload.limit);
      }

      return await query
        .get()
        .then(querySnapshot => {
          return querySnapshot.docs;
        })
        .catch(error => {
          console.log(error);
        });
    },

    async likeReply({ commit, state }, payload) {
      if (!this.getters.semiAuthenticated) {
        await this.dispatch("anonymous_login");
      }
      let batch = firebase.firestore().batch();
      let reply = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .doc(payload.comment_id)
        .collection("replies")
        .doc(payload.reply_id);

      batch.set(reply.collection("likers").doc(state.user.id), {
        user: state.user.id
      });
      batch.update(reply, { likes: firebase.firestore.FieldValue.increment() });
      batch.commit().catch(error => {
        throw error;
      });
    },

    async unlikeReply({ state }, payload) {
      let batch = firebase.firestore().batch();
      let reply = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .doc(payload.comment_id)
        .collection("replies")
        .doc(payload.reply_id);

      batch.delete(reply.collection("likers").doc(state.user.id));
      batch.update(reply, {
        likes: firebase.firestore.FieldValue.increment(-1)
      });
      batch.commit().catch(error => {
        throw error;
      });
    },

    async reply_liked({ state }, payload) {
      return !this.getters.semiAuthenticated
        ? false
        : await firebase
            .firestore()
            .collection("lists")
            .doc(payload.list_id)
            .collection("items")
            .doc(payload.item_id)
            .collection("comments")
            .doc(payload.comment_id)
            .collection("replies")
            .doc(payload.reply_id)
            .collection("likers")
            .doc(state.user.id)
            .get()
            .then(doc => {
              return doc.exists;
            });
    },

    /********************************************************************************************************************/
    //     ALL ABOUT VOTES

    async upvote({ commit, state }, payload) {
      if (!this.getters.semiAuthenticated) {
        await this.dispatch("anonymous_login");
      }
      let db = firebase.firestore();
      let batch = db.batch();
      let list = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list.id);

      let item = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list.id)
        .collection("items")
        .doc(payload.item.id);

      batch.update(item, {
        votes: firebase.firestore.FieldValue.increment(1),
        net_vote: firebase.firestore.FieldValue.increment(1),
        upvotes: firebase.firestore.FieldValue.increment(1)
      });

      batch.update(list, {
        votes: firebase.firestore.FieldValue.increment(1),
        net_vote: firebase.firestore.FieldValue.increment(1),
        upvotes: firebase.firestore.FieldValue.increment(1)
      });

      batch.set(item.collection("voters").doc(state.user.id), {
        user: state.user.id,
        item: payload.item.id,
        type: "upvote"
      });
      if (!payload.list_voted) {
        batch.set(list.collection("voters").doc(state.user.id), {
          created: firebase.firestore.FieldValue.serverTimestamp()
        });
        batch.update(list, {
          voters_count: firebase.firestore.FieldValue.increment(1)
        });
      }

      batch
        .commit()
        .then(() => {
          let image = {};
          payload.item.image
            ? (image = { image: payload.item.image.low })
            : null;
          this.dispatch("update_activities", {
            type: "upvote",
            item: {
              name: payload.item.name,
              id: payload.item.id,
              ...image
            },
            list: {
              title: payload.list.title,
              id: payload.list.id
            }
          });
          this.dispatch("update_popularity", payload.list.id);
        })
        .catch(error => {
          throw error;
        });
    },

    async downvote({ commit, state }, payload) {
      if (!this.getters.semiAuthenticated) {
        await this.dispatch("anonymous_login");
      }
      let db = firebase.firestore();
      let batch = db.batch();
      let list = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list.id);

      let item = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list.id)
        .collection("items")
        .doc(payload.item.id);

      batch.update(item, {
        votes: firebase.firestore.FieldValue.increment(1),
        net_vote: firebase.firestore.FieldValue.increment(-1),
        downvotes: firebase.firestore.FieldValue.increment(1)
      });

      batch.update(list, {
        votes: firebase.firestore.FieldValue.increment(1),
        net_vote: firebase.firestore.FieldValue.increment(-1),
        downvotes: firebase.firestore.FieldValue.increment(1)
      });

      batch.set(item.collection("voters").doc(state.user.id), {
        user: state.user.id,
        item: payload.item.id,
        type: "downvote"
      });

      batch.set(
        db.doc(`user_details/${state.user.id}/lists_voted/${payload.list.id}`),
        { list: payload.list.id }
      );
      if (!payload.list_voted) {
        batch.set(list.collection("voters").doc(state.user.id), {
          created: firebase.firestore.FieldValue.serverTimestamp()
        });
        batch.update(list, {
          voters_count: firebase.firestore.FieldValue.increment(1)
        });
      }

      batch
        .commit()
        .then(() => {
          let image = {};
          payload.item.image
            ? (image = { image: payload.item.image.low })
            : null;
          this.dispatch("update_activities", {
            type: "downvote",
            item: {
              name: payload.item.name,
              id: payload.item.id,
              ...image
            },
            list: {
              title: payload.list.title,
              id: payload.list.id
            }
          });
          this.dispatch("update_popularity", payload.list.id);
        })
        .catch(error => {
          throw error;
        });
    },

    async check_item_voted({ state }, payload) {
      if (!this.getters.semiAuthenticated) {
        return;
      }
      return await firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("voters")
        .doc(state.user.id)
        .get()
        .then(doc => {
          return doc.exists ? doc.data() : false;
        })
        .catch(error => {
          console.log("Item vote error");
          return { type: "false" };
        });
    },

    async check_list_voted({ state }, id) {
      if (!this.getters.semiAuthenticated) {
        return false;
      }
      return await firebase
        .firestore()
        .collection(`lists/${id}/voters`)
        .doc(state.user.id)
        .get()
        .then(doc => {
          return doc.exists ? true : false;
        })
        .catch(error => {
          console.log("List vote error");
        });
    },

    /*****************************************************************************************************************/
    //    ALL ABOUT USERNAME

    async username_valid({ commit }, username) {
      let users = firebase.firestore().collection("users");

      return await users
        .where("username", "==", username)
        .get()
        .then(docs => {
          return docs.empty;
        });
    },

    add_categories({ commit }, payload) {
      for (let category of payload) {
        firebase
          .firestore()
          .collection("categories")
          .add({
            name: category
          });
      }
    },

    async send_notification({ state, dispatch }, payload) {
      let recipients;
      let sendData;
      let users = firebase.firestore().collection("users");
      let db = firebase.firestore();

      switch (payload.type) {
        case "reply":
          recipients = await db
            .collection("lists")
            .doc(payload.list.id)
            .collection("items")
            .doc(payload.item.id)
            .collection("comments")
            .doc(payload.comment.id)
            .collection("repliers")
            .get()
            .then(query => {
              return [
                payload.commenter.id,
                ...query.docs.map(doc => {
                  return doc.data().user;
                })
              ];
            });

          sendData = {
            list: { id: payload.list.id, title: payload.list.title },
            item: { id: payload.item.id, name: payload.item.name },
            comment_id: payload.comment.id,
            type: payload.type,
            user: {
              username: state.user.username,
              id: state.user.id
            },
            commenter: {
              id: payload.commenter.id,
              username: payload.commenter.username
            }
          };
          break;

        case "demand-created":
          recipients = await dispatch("fetch_demanders", payload.demand_id);

          sendData = {
            user: payload.list.user,
            list: { id: payload.list.id, title: payload.list.title },
            type: payload.type
          };
          break;

        case "follow":
          recipients = [payload.user.id];
          sendData = {
            user: {
              username: state.user.username,
              id: state.user.id
            },
            type: payload.type
          };
          break;
        case "list-approved":
          recipients = [payload.recipient];
          sendData = payload.data;
          break;
        case "list-disapproved":
          recipients = [payload.recipient];
          sendData = payload.data;
          break;
      }
      await Promise.all(
        recipients.map(recipient => {
          if (state.user.id !== recipient) {
            users
              .doc(recipient)
              .collection("updates")
              .doc("data")
              .collection("notifications")
              .add({
                created: firebase.firestore.FieldValue.serverTimestamp(),
                ...sendData
              })
              .then(async () => {
                await users
                  .doc(recipient)
                  .collection("updates")
                  .doc("data")
                  .set(
                    {
                      notifications: firebase.firestore.FieldValue.increment(1)
                    },
                    { merge: true }
                  );
              });
          }
        })
      );
    },

    async fetch_notifications({ state }) {
      let user = firebase
        .firestore()
        .collection("users")
        .doc(state.user.id);

      let notifications = user
        .collection("updates")
        .doc("data")
        .collection("notifications");

      return notifications
        .orderBy("created", "desc")
        .get()
        .then(query => {
          return query.docs;
        })
        .catch(error => {
          console.log(error);
        });
    },

    async reset_notifications({ state }) {
      state.notifications = 0;
      firebase
        .firestore()
        .collection("users")
        .doc(state.user.id)
        .collection("updates")
        .doc("data")
        .update({
          notifications: 0
        })
        .catch(error => {
          throw error;
        });
    },

    async fetch_complete_item({ commit }, itemID, complete) {
      let item = firebase
        .firestore()
        .collection("items")
        .doc(itemID);

      let value;

      await item
        .get()
        .then(docRef => {
          value = docRef.data();
        })
        .then(async () => {
          if (complete) {
            await item
              .collection("images")
              .get()
              .then(query => {
                let images = query.docs;
                value = {
                  images: images,
                  ...value
                };
              });
          }
        });

      return value;
    },

    async upload_pending_demand({ state }, payload) {},

    async demand_list({ state }, demand) {
      if (!this.getters.semiAuthenticated) {
        await this.dispatch("anonymous_login");
      }

      let db = firebase.firestore();
      let batch = db.batch();

      let others;

      demand.category == ""
        ? (others = { category: "miscellaneous" })
        : demand.subCategory
        ? (others = {
            category: demand.category,
            sub_category: demand.subCategory
          })
        : (others = { category: demand.category });
      demand.comment !== ""
        ? (others = { comment: demand.comment, ...others })
        : null;

      batch.set(db.collection("demands").doc(demand.id), {
        waiters_count: 1,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        user: state.user.id,
        title: demand.title,
        ...others
      });
      batch.set(db.collection("demand_keywords").doc(demand.id), {
        words: demand.keywords,
        title: demand.title
      });
      batch.set(db.collection("demand_waiters").doc(demand.id), {
        demanders: [state.user.id]
      });
      batch.update(db.collection("user_details").doc(state.user.id), {
        demands: firebase.firestore.FieldValue.increment(1)
      });
      await batch.commit().then(() => {
        this.dispatch("update_activities", {
          type: "demand",
          demand: {
            title: demand.title,
            id: demand.id
          }
        });
      });
    },
    async flag({ state }, payload) {
      let flagged = firebase.firestore().collection("flagged");
      await flagged
        .add({
          ...payload,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          flagger: { id: state.user.id, username: state.user.username }
        })
        .catch(error => {
          throw error;
        });
    },

    async fetch_flagged({ state }, payload) {
      let flagged = firebase.firestore().collection("flagged");
      let query = flagged.orderBy("created").limit(payload.limit);

      if (payload.sort !== "all") {
        query = query
          .where("type", "==", payload.sort)
          .orderBy("created")
          .limit(payload.limit);
      }
      if (payload.lastDoc) {
        query = query.startAfter(payload.lastDoc);
      }

      return await query.get().then(query => {
        return query.docs;
      });
    },
    async fetch_complete_demand({ state }, id) {
      let demand;
      let loc = firebase
        .firestore()
        .collection("demands")
        .doc(id);

      return loc
        .get()
        .then(doc => {
          demand = doc.data();
        })
        .then(async () => {
          await loc
            .collection("comments")
            .get()
            .then(query => {
              demand.comments = query.docs;
            });
          return demand;
        });
    },
    async fetch_demanded({ state }, payload) {
      let demands = firebase.firestore().collection("demands");
      let query;

      switch (payload.sort) {
        case "random":
          query = demands;
          break;
        case "most-demanded":
          query = demands.orderBy("waiters_count", "desc");
          break;
        case "least-demanded":
          query = demands.orderBy("waiters_count");
          break;
        case "newest":
          query = demands.orderBy("created", "desc");
          break;
        case "oldest":
          query = demands.orderBy("created");
          break;
      }

      if (!payload.lastDoc) {
        return query
          .limit(payload.limit)
          .get()
          .then(query => {
            return query.docs;
          });
      } else {
        return query
          .startAfter(payload.lastDoc)
          .limit(payload.limit)
          .get()
          .then(query => {
            return query.docs;
          });
      }
    },
    async fetch_lists({ state }, payload) {
      let lists = firebase.firestore().collection("lists");
      let query = lists.where("personal", "==", false);

      switch (payload.sort) {
        case "random":
          query = query;
          break;
        case "rating":
          query = lists.orderBy("rating_score", "desc");
          break;
        case "popularity":
          query = lists.orderBy("popularity", "desc");
          break;
        case "newest":
          query = lists.orderBy("created", "desc");
          break;
        case "oldest":
          query = lists.orderBy("created");
          break;
      }

      if (!payload.lastDoc) {
        return query
          .limit(payload.limit)
          .get()
          .then(query => {
            return query.docs;
          });
      } else {
        return query
          .startAfter(payload.lastDoc)
          .limit(payload.limit)
          .get()
          .then(query => {
            return query.docs;
          });
      }
    },
    async fetch_demanders({ state }, id) {
      return await firebase
        .firestore()
        .collection("demand_waiters")
        .doc(id)
        .get()
        .then(doc => {
          return doc.data().demanders;
        });
    },
    async join_demanders({ state }, demand) {
      if (!this.getters.semiAuthenticated) {
        await this.dispatch("anonymous_login");
      }
      let db = firebase.firestore();
      let batch = firebase.firestore().batch();

      batch.set(
        db.collection("demand_waiters").doc(demand.id),
        {
          demanders: firebase.firestore.FieldValue.arrayUnion(state.user.id),
          id: demand.id
        },
        { merge: true }
      );
      batch.update(db.collection("demands").doc(demand.id), {
        waiters_count: firebase.firestore.FieldValue.increment(1)
      });
      batch.commit().catch(error => {
        throw error;
      });
    },
    async upload_demand_comment({ state }, payload) {
      let db = firebase.firestore();
      let batch = db.batch();
      let demand = db.collection("demands").doc(payload.id);

      batch.set(demand.collection("comments").doc(), {
        content: payload.comment,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        user: {
          id: state.user.id,
          username: state.user.username
        }
      });
      batch.update(demand, {
        comment_count: firebase.firestore.FieldValue.increment(1)
      });
      batch
        .commit()
        .then(() => {
          return {
            created: firebase.firestore.FieldValue.serverTimestamp(),
            content: payload.content
          };
        })
        .catch(error => {
          throw error;
        });
    },
    async fetch_demand_comments({ state }, payload) {
      let db = firebase.firestore();

      return db
        .collection("demands")
        .doc(payload.id)
        .collection("comments")
        .orderBy("created")
        .limit(payload.limit)
        .get()
        .then(query => {
          return query.docs;
        });
    },
    async leave_demanders({ state }, demand) {
      let db = firebase.firestore();
      let batch = firebase.firestore().batch();

      batch.set(
        db.collection("demand_waiters").doc(demand.id),
        {
          demanders: firebase.firestore.FieldValue.arrayRemove(state.user.id),
          id: demand.id
        },
        { merge: true }
      );
      batch.update(db.collection("demands").doc(demand.id), {
        waiters_count: firebase.firestore.FieldValue.increment(-1)
      });
      batch.commit().catch(error => {
        throw error;
      });
    },
    async delete_demand({ state }, id) {
      let db = firebase.firestore();

      db.collection("demands")
        .doc(id)
        .delete()
        .then(() => {
          db.collection("demand_waiters")
            .doc(id)
            .delete();
          db.collection("demand_keywords")
            .doc(id)
            .delete();
          db.collection("demands")
            .doc(id)
            .collection("comments")
            .get()
            .then(async query => {
              await Promise.all(
                query.docs.map(doc => {
                  db.collection("demands")
                    .doc(id)
                    .collection("comments")
                    .doc(doc.id)
                    .delete();
                })
              );
            });
        });
    },
    async checkWaiting({ state }, id) {
      if (!this.getters.semiAuthenticated) {
        return false;
      }
      return await firebase
        .firestore()
        .collection("demand_waiters")
        .where("id", "==", id)
        .where("demanders", "array-contains", state.user.id)
        .get()
        .then(query => {
          return query.docs.length === 0 ? false : true;
        });
    },
    async search_item({ state }, name) {
      return await firebase
        .firestore()
        .collection("items")
        .where("keywords", "array-contains", name)
        .get()
        .then(query => {
          return query.docs;
        });
    },

    async fetch_category_lists({ state }, payload) {
      let query;
      let lists = firebase
        .firestore()
        .collection("lists")
        .where("category", "==", payload.category.toLowerCase());
      if (!payload.sortBy) {
        payload.sortBy = "Random";
      }
      switch (payload.sortBy) {
        case "Random":
          query = lists;
          break;
        case "Newest":
          query = lists.orderBy("created", "desc");
          break;
        case "Oldest":
          query = lists.orderBy("created");
          break;
        case "Top Rated":
          query = lists.orderBy("rating_score", "desc");
          break;
        case "Popular":
          query = lists.orderBy("popularity", "desc");
          break;
      }
      if (payload.lastDoc) {
        query = query.startAfter(payload.lastDoc);
      }
      return query
        .limit(payload.limit)
        .get()
        .then(query => {
          return query.docs;
        });
    },
    async fetch_subcategory_lists({ state }, payload) {
      let lists = firebase
        .firestore()
        .collection("lists")
        .where("category", "==", payload.category.toLowerCase())
        .where("sub_category", "==", payload.subCategory.toLowerCase());

      let query;

      switch (payload.sortBy) {
        case "Random":
          query = lists;
          break;
        case "Newest":
          query = lists.orderBy("created", "desc");
          break;
        case "Oldest":
          query = lists.orderBy("created");
          break;
        case "Top Rated":
          query = lists.orderBy("rating_score", "desc");
          break;
        case "Popular":
          query = lists.orderBy("popularity", "desc");
          break;
      }
      if (payload.lastDoc) {
        query = query.startAfter(payload.lastDoc);
      }
      return query
        .limit(payload.limit)
        .get()
        .then(query => {
          return query.docs;
        });
    },
    async fetch_category_demands({ state }, payload) {
      let query;
      let demands = firebase
        .firestore()
        .collection("demands")
        .where("category", "==", payload.category.toLowerCase());

      switch (payload.sortBy) {
        case "Random":
          query = demands;
          break;
        case "Newest":
          query = demands.orderBy("created", "desc");
          break;
        case "Oldest":
          query = demands.orderBy("created");
          break;
        case "Most Demanded":
          query = demands.orderBy("waiters_count", "desc");
          break;
        case "Least Demanded":
          query = demands.orderBy("waiters_count");
          break;
      }

      if (payload.lastDoc) {
        query = query.startAfter(payload.lastDoc);
      }

      return query
        .limit(payload.limit)
        .get()
        .then(query => {
          return query;
        });
    },

    async fetch_subcategory_demands({ commit }, payload) {
      let query;
      let demands = firebase
        .firestore()
        .collection("demands")
        .where("category", "==", payload.category.toLowerCase())
        .where("sub_category", "==", payload.subCategory.toLowerCase());

      switch (payload.sortBy) {
        case "Random":
          query = demands;
          break;
        case "Newest":
          query = demands.orderBy("created", "desc");
          break;
        case "Oldest":
          query = demands.orderBy("created");
          break;
        case "Most Demanded":
          query = demands.orderBy("waiters_count", "desc");
          break;
        case "Least Demanded":
          query = demands.orderBy("waiters_count");
          break;
      }

      if (payload.lastDoc) {
        query = query.startAfter(payload.lastDoc);
      }

      return query
        .limit(payload.limit)
        .get()
        .then(query => {
          return query;
        });
    },

    async update_all_users({ commit }) {
      let db = firebase.firestore();

      db.collection("users")
        .get()
        .then(async query => {});
    },
    async search_demands({ commit }, text) {
      return await firebase
        .firestore()
        .collection("demand_keywords")
        .where("words", "array-contains", text)
        .limit(10)
        .get()
        .then(query => {
          return query.docs;
        });
    },
    async search_lists({ commit }, text) {
      return await firebase
        .firestore()
        .collection("list_keywords")
        .where("words", "array-contains", text)
        .limit(10)
        .get()
        .then(query => {
          return query.docs;
        });
    },
    async upload_categories({ commit }, categories) {
      let db = firebase.firestore();

      categories.forEach(async category => {
        await db
          .collection("categories")
          .doc(category.name)
          .set({
            name: category.name,
            list_count: 0,
            created: firebase.firestore.FieldValue.serverTimestamp()
          })
          .then(() => {
            category.subs.forEach(async sub => {
              await db
                .collection("categories")
                .doc(category.name)
                .collection("subs")
                .doc(sub)
                .set({
                  name: sub,
                  list_count: 0,
                  created: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
            console.log("done");
          });
      });
    },
    async fetchCategories({ commit, state, dispatch }) {
      let categories;
      let db = firebase.firestore();

      await db
        .collection("categories")
        .orderBy("name")
        .get()
        .then(async cat => {
          categories = cat.docs.map(cat => cat.data());
          for (let i = 0; i < categories.length; i++) {
            await db
              .collection("categories")
              .doc(categories[i].name)
              .collection("subs")
              .orderBy("name")
              .get()
              .then(subs => {
                categories[i] = {
                  subs: subs.docs.map(sub => sub.data()),
                  ...categories[i]
                };
              });
          }
        })
        .then(() => {
          if (categories.length > 0) {
            commit("setCategories", categories);
          }
          dispatch("fetch_home_category_lists");
        });
    },
    async fetch_home_category_lists({ state, dispatch, commit }) {
      for (let category of state.categories) {
        dispatch("fetch_category_lists", {
          category: category.name,
          limit: 1
        }).then(async lists => {
          if (lists.length > 0) {
            let list = {
              id: lists[0].id,
              ...lists[0].data()
            };
            await dispatch("fetch_list_items", {
              list_id: list.id,
              limit: 3
            }).then(items => {
              list.items = items;
            });
            commit("setCategoryLists", list);
          }
        });
      }
    },
    async update_happening({ commit, state }, payload) {
      let db = firebase.firestore();
      db.collection("happening")
        .doc("data")
        .collection("collection")
        .add({
          created: firebase.firestore.FieldValue.serverTimestamp(),
          ...payload
        });
      db.collection("happening")
        .doc("data")
        .update({
          count: firebase.firestore.FieldValue.increment(1)
        });
    },
    async update_activities({ commit, state }, payload) {
      let db = firebase.firestore();
      let batch = db.batch();

      let recipient = payload.recipient ? payload.recipient : state.user.id;

      batch.set(
        db
          .collection("user_details")
          .doc(recipient)
          .collection("activities")
          .doc(),
        {
          created: firebase.firestore.FieldValue.serverTimestamp(),
          ...payload
        }
      );
      batch.set(
        db.collection("user_details").doc(recipient),
        {
          activity_count: firebase.firestore.FieldValue.increment(1)
        },
        { merge: true }
      );

      batch.commit().catch(error => {
        throw error;
      });
    },
    async initialize({ commit }) {
      firebase
        .firestore()
        .enablePersistence()
        .catch(function(err) {
          if (err.code == "failed-precondition") {
            console.log("Offline failed precondition");
          } else if (err.code == "unimplemented") {
            console.log("Offline failed");
          }
        });

      commit("initialize");
    },
    async fetch_user_activities({ state }, payload) {
      let db = firebase.firestore();
      let query;

      if (payload.lastDoc) {
        query = db
          .collection("user_details")
          .doc(payload.user.id)
          .collection("activities")
          .orderBy("created", "desc")
          .startAfter(payload.lastDoc);
      } else {
        query = db
          .collection("user_details")
          .doc(payload.user.id)
          .collection("activities")
          .orderBy("created", "desc");
      }
      return query
        .limit(payload.limit)
        .get()
        .then(query => {
          return query.docs;
        });
    }
  }
});

export default store;
