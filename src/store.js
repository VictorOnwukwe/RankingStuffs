import vuex from "vuex";
import Vue from "vue";
import firebase, { firestore } from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import mypersist from "./plugins/persistState";
import voteActions from "./plugins/votes";
const algoliasearch = require("algoliasearch");
require("firebase/functions");

let algoliaClient;

setTimeout(() => {
  let getAlgoliaDetails = firebase
    .functions()
    .httpsCallable("getAlgoliaDetails");
  getAlgoliaDetails().then((result) => {
    algoliaClient = algoliasearch(result.data.appid, result.data.apikey);
  });
}, 1);

let b64toBlob = function(b64Data, contentType, sliceSize) {
  contentType = contentType || "";
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, { type: contentType });
  return blob;
};
let getBlob = function(ImageURL) {
  // Split the base64 string in data and contentType
  let block = ImageURL.split(";");
  // Get the content type
  let contentType = block[0].split(":")[1]; // In this case "image/gif"
  // get the real base64 content of the file
  let realData = block[1].split(",")[1]; // In this case "iVBORw0KGg...."

  // Convert to blob
  let blob = b64toBlob(realData, contentType);
  return blob;
};

let encrypt = function(name) {
  return name.replace(/\//g, "zzsl");
};
let decrypt = function(name) {
  return name.replace(/zzsl/g, "/");
};
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
    categoryLists: [],
    snackbar: {
      show: false,
      message: "",
      type: "",
    },
    verified: false,
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
    initialize(_) {},
    setCategoryLists(state, payload) {
      state.categoryLists = payload;
    },
    setSnackbar(state, payload) {
      state.snackbar = payload;
    },
    setNotification(state, num) {
      state.notifications = num;
    },
    setVerified(state, payload) {
      state.verified = payload;
    },
  },

  getters: {
    authenticated: (state) => state.authenticated,
    getUser: (state) => state.user,
    getLoading: (state) => state.loading,
    showSearch: (state) => state.showSearch,
    nophoto: (state) => state.nophoto,
    semiAuthenticated: (state) => state.authenticated || state.anonymous,
    notifications: (state) => state.notifications,
    login: (state) => state.login,
    signup: (state) => state.signup,
    categories: (state) => state.categories,
    hotLists: (state) => state.hotLists,
    hotDemands: (state) => state.hotDemands,
    topRatedList: (state) => state.topRatedList,
    latestList: (state) => state.latestList,
    popularList: (state) => state.popularList,
    categoryLists: (state) => state.categoryLists,
    snackbar: (state) => state.snackbar,
    anonymous: () => firebase.auth().currentUser.isAnonymous,
    verified: (state) => {
      // return firebase
      //   .auth()
      //   .currentUser.reload()
      //   .then(() => {
      //     console.log("reloaded");
      //     return firebase.auth().currentUser.emailVerified;
      //   })
      //   .catch((err) => console.log(err));

      return state.verified;
    },
    isAdmin: () => {
      return (
        firebase.auth().currentUser &&
        firebase.auth().currentUser.uid === "c6F7pgDchSfyY931qz1kUUWDKOR2"
      );
    },
    dbAuthenticated: () =>
      firebase.auth().currentUser && !firebase.auth().currentUser.isAnonymous,
  },

  actions: {
    set_current_list({ commit }, list) {
      commit("setCurrentList", list);
    },
    set_snackbar({ commit }, payload) {
      commit("setSnackbar", payload);
    },
    set_search({ state, commit }, payload) {
      let send;
      if (payload === "toggle") send = !state.showSearch;
      else send = payload;

      commit("setSearch", send);
    },
    async fetch_sidebar_demands({ dispatch, commit }) {
      let demands = await dispatch("fetch_demanded", {
        sort: "most-demanded",
        limit: 10,
      }).then((demands) => {
        return demands.map((demand) => {
          return { id: demand.id, ...demand.data() };
        });
      });
      if (demands && demands.length !== 0) {
        commit("setHotDemands", demands);
      }
    },
    async fetch_sidebar_lists({ dispatch, commit }) {
      let lists = await dispatch("fetch_lists", {
        sort: "popularity",
        limit: 10,
      }).then((lists) => {
        return lists.map((list) => {
          return { id: list.id, ...list.data() };
        });
      });
      if (lists && lists.length !== 0) {
        commit("setHotLists", lists);
      }
    },
    async set_loading({ commit }, payload) {
      commit("setLoading", payload);
    },

    set_login({ commit }, payload) {
      commit("setSignup", false);
      commit("setLogin", payload);
    },
    set_signup({ commit }, payload) {
      commit("setLogin", false);
      commit("setSignup", payload);
    },

    fetch_home_contents({ commit, dispatch }) {
      let latest, popular, topRated;

      return Promise.all([
        dispatch("fetch_lists", {
          sort: "newest",
          limit: 1,
        })
          .then(async (lists) => {
            latest = { id: lists[0].id, ...lists[0].data() };
            await dispatch("fetch_list_items", {
              list_id: latest.id,
              limit: 3,
            }).then((items) => {
              latest.items = items.map((item) => {
                return { name: item.data().name };
              });
            });
            commit("setLatestList", latest);
          })
          .catch((error) => {}),

        dispatch("fetch_lists", {
          sort: "popularity",
          limit: 1,
        })
          .then(async (lists) => {
            popular = { id: lists[0].id, ...lists[0].data() };
            await dispatch("fetch_list_items", {
              list_id: popular.id,
              limit: 3,
            }).then((items) => {
              popular.items = items.map((item) => {
                return { name: item.data().name };
              });
            });
            commit("setPopularList", popular);
          })
          .catch((error) => {}),

        dispatch("fetch_lists", {
          limit: 1,
          sort: "rating",
        })
          .then(async (lists) => {
            topRated = { id: lists[0].id, ...lists[0].data() };
            await dispatch("fetch_list_items", {
              list_id: topRated.id,
              limit: 3,
            }).then((items) => {
              topRated.items = items.map((item) => {
                return { name: item.data().name };
              });
            });
            commit("setTopRatedList", topRated);
          })
          .catch((error) => {}),
      ]).then(() => {
        return {
          latest: latest,
          popular: popular,
          topRated: topRated,
        };
      });
    },

    watch_auth_state({ commit }) {
      let auth = firebase.auth();
      auth.onAuthStateChanged(() => {
        if (auth.currentUser) {
          commit("setVerified", auth.currentUser.emailVerified);
        }
      });
    },

    watch_user_status({ state }) {
      var uid = firebase.auth().currentUser.uid;
      // ...
      var userStatusFirestoreRef = firebase.firestore().doc("/status/" + uid);
      var userStatusDatabaseRef = firebase.database().ref("/status/" + uid);

      var isOfflineForDatabase = {
        state: "offline",
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      };

      var isOnlineForDatabase = {
        state: "online",
        last_changed: firebase.database.ServerValue.TIMESTAMP,
      };

      // Firestore uses a different server timestamp value, so we'll
      // create two more constants for Firestore state.
      var isOfflineForFirestore = {
        state: "offline",
        last_changed: firebase.firestore.FieldValue.serverTimestamp(),
      };

      var isOnlineForFirestore = {
        state: "online",
        last_changed: firebase.firestore.FieldValue.serverTimestamp(),
      };

      firebase
        .database()
        .ref(".info/connected")
        .on("value", function(snapshot) {
          if (snapshot.val() == false) {
            // Instead of simply returning, we'll also set Firestore's state
            // to 'offline'. This ensures that our Firestore cache is aware
            // of the switch to 'offline.'
            userStatusFirestoreRef.set(isOfflineForFirestore);
            return;
          }

          userStatusDatabaseRef
            .onDisconnect()
            .set(isOfflineForDatabase)
            .then(function() {
              userStatusDatabaseRef.set(isOnlineForDatabase);

              // We'll also add Firestore set here for when we come online.
              userStatusFirestoreRef.set(isOnlineForFirestore);
            });
        });
    },

    watch_notifications({ state, commit }) {
      if (!state.authenticated) {
        return;
      }
      firebase
        .firestore()
        .collection("users")
        .doc(state.user.id)
        .collection("updates")
        .doc("data")
        .onSnapshot(
          (doc) => {
            if (doc.exists) {
              commit("setNotification", doc.data().notifications);
            }
          },
          (_) => {
            //do nothing
          }
        );
    },
    /********************************************************************************************************************/
    //ALL ABOUT SIGNUP

    async anonymous_login({ commit, state, dispatch }) {
      if (state.authenticated || state.anonymous) {
        return;
      }
      let auth = firebase.auth();

      await auth
        .signInAnonymously()
        .then(() => {
          let user = firebase.auth().currentUser;
          if (user) {
            let randomName;
            randomName = "visitor" + Math.floor(Math.random() * 1000);

            while (!dispatch("username_valid", randomName)) {
              randomName = randomName + Math.floor(Math.random() * 1000);
            }

            firebase
              .firestore()
              .collection("users")
              .doc(user.uid)
              .set({
                username: randomName,
                created: firebase.firestore.FieldValue.serverTimestamp(),
              });
            commit("anonymousLogin", { username: randomName, id: user.uid });
          }
        })
        .catch((error) => {
          this.dispatch("set_snackbar", {
            show: true,
            message: "sorry. An error occured",
            type: "error",
          });
        });
    },

    async emailSignup({ commit, dispatch }, credentials) {
      let auth = firebase.auth();
      let db = firebase.firestore();

      if (auth.currentUser && auth.currentUser.isAnonymous) {
        let credential = firebase.auth.EmailAuthProvider.credential(
          credentials.email,
          credentials.password
        );

        await auth.currentUser
          .linkAndRetrieveDataWithCredential(credential)
          .then(async (userCred) => {
            let batch = firebase.firestore().batch();
            batch.set(db.collection("users").doc(userCred.user.uid), {
              username: credentials.username,
              created: firebase.firestore.FieldValue.serverTimestamp(),
              email: credentials.email.toLowerCase(),
            });
            batch.set(
              firebase
                .firestore()
                .collection("user_details")
                .doc(userCred.user.uid),
              {
                created: firebase.firestore.FieldValue.serverTimestamp(),
                followers: 0,
                following: 0,
                username: credentials.username,
                email: credentials.email,
              }
            );

            return batch
              .commit()
              .then(() => {
                commit("login", {
                  id: userCred.user.uid,
                  username: credentials.username,
                  email: credentials.email,
                });
              })
              .catch((_) => {
                this.dispatch("set_snackbar", {
                  message: "Sorry, an error occured",
                  type: "error",
                  show: true,
                });
              });
          });
      } else if (auth.currentUser) {
        let userCred = auth.currentUser;
        let batch = firebase.firestore().batch();
        batch.set(db.collection("users").doc(userCred.uid), {
          username: credentials.username,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          email: credentials.email.toLowerCase(),
        });
        batch.set(
          firebase
            .firestore()
            .collection("user_details")
            .doc(userCred.uid),
          {
            created: firebase.firestore.FieldValue.serverTimestamp(),
            followers: 0,
            following: 0,
            username: credentials.username,
            email: credentials.email,
          }
        );

        return batch
          .commit()
          .then(() => {
            commit("login", {
              id: userCred.uid,
              username: credentials.username,
              email: credentials.email,
            });
          })
          .catch((_) => {
            this.dispatch("set_snackbar", {
              message: "Sorry, an error occured",
              type: "error",
              show: true,
            });
          });
      }

      let nUser;
      //authenticate with email and password
      return auth
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          return auth
            .createUserWithEmailAndPassword(
              credentials.email,
              credentials.password
            )
            .then(async (result) => {
              nUser = {
                username: credentials.username,
                created: firebase.firestore.FieldValue.serverTimestamp(),
                email: credentials.email.toLowerCase(),
                id: result.user.uid,
              };
              await db
                .collection("users")
                .doc(result.user.uid)
                .set({
                  username: credentials.username,
                  created: firebase.firestore.FieldValue.serverTimestamp(),
                  email: credentials.email.toLowerCase(),
                })
                .then(async () => {
                  commit("login", nUser);
                  firebase
                    .firestore()
                    .collection("user_details")
                    .doc(result.user.uid)
                    .set({
                      created: firebase.firestore.FieldValue.serverTimestamp(),
                      followers: 0,
                      following: 0,
                      username: credentials.username,
                      email: credentials.email.toLowerCase(),
                    });
                });
            })
            .then(async () => {
              auth.currentUser
                .sendEmailVerification()
                .then(() => {
                  this.dispatch("set_snackbar", {
                    show: true,
                    message:
                      "A verification mail has been sent. Please verify your email",
                    type: "info",
                  });
                })
                .catch((error) => {
                  //no action yet
                });
            })
            .catch((error) => {
              throw error;
            });
        });
    },

    async emailLogin({ commit }, credentials) {
      let auth = firebase.auth();

      return auth
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(async () => {
          return await auth
            .signInWithEmailAndPassword(credentials.email, credentials.password)
            .then(async (result) => {
              await firebase
                .firestore()
                .collection("users")
                .doc(result.user.uid)
                .get()
                .then((user) => {
                  commit("login", {
                    id: user.id,
                    ...user.data(),
                  });
                });
            })
            .catch((error) => {
              throw error;
            });
        })
        .catch((error) => {
          throw error;
        });
    },
    async socialLogin({ commit, state, dispatch }, authType) {
      let provider;
      let anonymous = false;
      let exists = false;
      let auth = firebase.auth();
      let db = firebase.firestore().collection("users");
      let userDetails = firebase.firestore().collection("user_details");
      let batch = firebase.firestore().batch();
      if (authType === "G") {
        provider = new firebase.auth.GoogleAuthProvider();
      } else {
        provider = new firebase.auth.FacebookAuthProvider();
      }

      let signIn = async function(result) {
        await db
          .doc(result.user.uid)
          .get()
          .then(async (user) => {
            let displayName = "";
            if (user.exists) {
              let update = {};
              let newUser = {};
              if (anonymous) {
                if (result.user.photoURL) {
                  update = {
                    profile_pic: {
                      low: result.user.photoURL,
                      high: result.user.photoURL,
                      created: firebase.firestore.FieldValue.serverTimestamp(),
                    },
                  };
                }
                displayName = result.user.displayName
                  .replace(/ /g, "")
                  .toLowerCase();
                let nameValid = await dispatch("username_valid", displayName);
                while (!nameValid) {
                  displayName =
                    result.user.displayName.replace(/ /g, "").toLowerCase() +
                    Math.floor(Math.random() * 1000);
                  nameValid = await dispatch("username_valid", displayName);
                }
                if (result.user.email) {
                  update = { email: result.user.email, ...update };
                }

                update = { username: displayName, ...update };
                batch.update(db.doc(result.user.uid), update);
                batch.set(userDetails.doc(result.user.uid), {
                  created: firebase.firestore.FieldValue.serverTimestamp(),
                  followers: 0,
                  following: 0,
                  username: displayName,
                  email: result.user.email,
                });
                batch
                  .commit()
                  .then(() => {
                    newUser = { username: displayName };
                    if (result.user.email) {
                      newUser = { email: result.user.email, ...newUser };
                    }
                    if (result.user.photoURL) {
                      newUser = {
                        profile_pic: {
                          low: result.user.photoURL,
                          high: result.user.photoURL,
                          created: firebase.firestore.FieldValue.serverTimestamp(),
                          email: result.user.email,
                        },
                        ...newUser,
                      };
                    }
                    newUser = {
                      id: result.user.uid,
                      ...newUser,
                    };
                    commit("login", newUser);
                  })
                  .catch((_) => {
                    this.dispatch("set_snackbar", {
                      show: true,
                      message: "Sorry, an error occured",
                      type: "error",
                    });
                  });
              } else {
                if (exists) {
                  if (result.user.photoURL) {
                    update = {
                      profile_pic: {
                        low: result.user.photoURL,
                        high: result.user.photoURL,
                        created: firebase.firestore.FieldValue.serverTimestamp(),
                      },
                    };
                  }
                  displayName = result.user.displayName
                    .replace(/ /g, "")
                    .toLowerCase();
                  let nameValid = await dispatch("username_valid", displayName);
                  while (!nameValid) {
                    displayName =
                      result.user.displayName.replace(/ /g, "").toLowerCase() +
                      Math.floor(Math.random() * 1000);
                    nameValid = await dispatch("username_valid", displayName);
                  }
                  if (result.user.email) {
                    update = { email: result.user.email, ...update };
                  }

                  update = { username: displayName, ...update };
                  batch.update(db.doc(result.user.uid), update);
                  batch.set(userDetails.doc(result.user.uid), {
                    created: firebase.firestore.FieldValue.serverTimestamp(),
                    followers: 0,
                    following: 0,
                    username: displayName,
                    email: result.user.email,
                  });
                  batch
                    .commit()
                    .then(() => {
                      newUser = { username: displayName };
                      if (result.user.email) {
                        newUser = { email: result.user.email, ...newUser };
                      }
                      if (result.user.photoURL) {
                        newUser = {
                          profile_pic: {
                            low: result.user.photoURL,
                            high: result.user.photoURL,
                            created: firebase.firestore.FieldValue.serverTimestamp(),
                            email: result.user.email,
                          },
                          ...newUser,
                        };
                      }
                      newUser = {
                        id: result.user.uid,
                        ...newUser,
                      };
                      commit("login", newUser);
                    })
                    .catch((_) => {
                      this.dispatch("set_snackbar", {
                        show: true,
                        message: "Sorry, an error occured",
                        type: "error",
                      });
                    });
                } else if (!user.data().profile_pic && result.user.photoURL) {
                  newUser = {
                    profile_pic: {
                      low: result.user.photoURL,
                      high: result.user.photoURL,
                      created: firebase.firestore.FieldValue.serverTimestamp(),
                      email: result.user.email,
                    },
                  };

                  commit("login", { ...user.data(), id: user.id, ...newUser });
                  await db.doc(result.user.uid).update(newUser);
                  firebase
                    .firestore()
                    .collection("user_details")
                    .doc(result.user.uid)
                    .update(newUser);
                } else {
                  commit("login", {
                    ...user.data(),
                    id: user.id,
                    email: user.data().email,
                  });
                }
              }
              return;
            } else {
              displayName = result.user.displayName
                .replace(/ /g, "")
                .toLowerCase();
              let nameValid = await dispatch("username_valid", displayName);
              while (!nameValid) {
                displayName =
                  result.user.displayName.replace(/ /g, "").toLowerCase() +
                  Math.floor(Math.random() * 1000);
                nameValid = await dispatch("username_valid", displayName);
              }

              let newUser = {
                username: displayName,
                id: result.user.uid,
                email: result.user.email,
              };

              let update = {};
              result.user.photoURL
                ? (update = {
                    profile_pic: {
                      low: result.user.photoURL,
                      high: result.user.photoURL,
                      created: firebase.firestore.FieldValue.serverTimestamp(),
                    },
                  })
                : null;
              return Promise.all([
                db.doc(result.user.uid).set({
                  username: displayName,
                  created: firebase.firestore.FieldValue.serverTimestamp(),
                  email: result.user.email,
                  ...update,
                }),

                userDetails.doc(result.user.uid).set({
                  created: firebase.firestore.FieldValue.serverTimestamp(),
                  followers: 0,
                  following: 0,
                  username: displayName,
                  email: result.user.email,
                }),
              ]).then(() => {
                commit("login", {
                  ...update,
                  ...newUser,
                });
                return displayName;
              });
            }
          });
      };

      let handleError = function(error) {
        if (error.code === "auth/network-request-failed") {
          dispatch("set_snackbar", {
            show: true,
            message: "Error: Poor internet connection",
            type: "error",
          });
        } else if (
          error.code === "auth/account-exists-with-different-credential"
        ) {
          let pendingCred = error.credential;
          let email = error.email;
          auth.fetchSignInMethodsForEmail(email).then(async (methods) => {
            if (methods[0] === "password" && methods.length === 1) {
              // @ts-ignore
              const { value: password } = await Swal.fire({
                text:
                  "You previously logged in with this email. Enter your password to continue",
                input: "password",
                inputPlaceholder: "Enter your password",
                inputAttributes: {
                  autocapitalize: "off",
                  autocorrect: "off",
                },
              }); // TODO: implement promptUserForPassword.
              if (password) {
                auth
                  .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                  .then(() => {
                    auth
                      .signInWithEmailAndPassword(email, password)
                      .then(() => {
                        // Step 4a.
                        auth.currentUser.linkWithCredential(pendingCred);
                        return auth.currentUser;
                      })
                      .then((result) => {
                        db.doc(result.uid)
                          .get()
                          .then((user) => {
                            commit("login", {
                              id: user.id,
                              ...user.data(),
                            });
                          });
                      })
                      .catch((error) => {
                        dispatch("set_snackbar", {
                          show: true,
                          message: "sorry. An error occured",
                          type: "error",
                        });
                      });
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
              cancelButtonText: "NO",
            }).then((result) => {
              if (result.value) {
                return auth
                  .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                  .then(() => {
                    auth
                      .signInWithPopup(new_provider)
                      .then((result) => {
                        result.user.linkWithCredential(pendingCred);
                        return result;
                      })
                      .then((result) => {
                        db.doc(result.user.uid)
                          .get()
                          .then((user) => {
                            commit("login", {
                              id: user.id,
                              ...user.data(),
                            });
                          });
                      })
                      .catch((error) => {
                        dispatch("set_snackbar", {
                          show: true,
                          message: "sorry. An error occured",
                          type: "error",
                        });
                      });
                  });
              }
            });
          });
        }
      };

      if (auth.currentUser && auth.currentUser.isAnonymous) {
        anonymous = true;
        return auth
          .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
          .then(() => {
            return auth.currentUser
              .linkWithPopup(provider)
              .then((userCred) => {
                signIn({
                  user: {
                    ...userCred.user.providerData[0],
                    uid: userCred.user.uid,
                  },
                });
              })
              .catch((error) => {
                if (error.code === "auth/credential-already-in-use") {
                  let uid = auth.currentUser.uid;
                  Swal.fire({
                    text:
                      "We noticed you carried out activities while signed out. These activities will not be registered because this account already exists. Do you wish to continue?",
                    type: "question",
                    showConfirmButton: true,
                    confirmButtonText: "YES",
                    showCancelButton: true,
                    cancelButtonText: "NO",
                  }).then(async (result) => {
                    if (result.value) {
                      await db
                        .doc(uid)
                        .delete()
                        .then(async () => {
                          await auth.currentUser.delete();
                          anonymous = false;
                        })
                        .then(() => {
                          auth
                            .setPersistence(
                              firebase.auth.Auth.Persistence.LOCAL
                            )
                            .then(() => {
                              auth
                                .signInWithPopup(provider)
                                .then((result) => {
                                  signIn({
                                    user: {
                                      ...result.user.providerData[0],
                                      uid: result.user.uid,
                                    },
                                  });
                                })
                                .catch((error) => {
                                  this.dispatch("set_snackbar", {
                                    show: true,
                                    message: "sorry. An error occured",
                                    type: "error",
                                  });
                                });
                            });
                        });
                    }
                  });
                }
              });
          });
      }
      if (!anonymous && !auth.currentUser) {
        return firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
          .then(() => {
            return auth
              .signInWithPopup(provider)
              .then(async (result) => {
                signIn({
                  user: {
                    ...result.user.providerData[0],
                    uid: result.user.uid,
                  },
                });
              })
              .catch((error) => {
                handleError(error);
              });
          })
          .catch((error) => {
            this.dispatch("set_snackbar", {
              show: true,
              message: "Sorry. An error occured",
              type: "error",
            });
          });
      } else {
        exists = true;
        signIn({ user: auth.currentUser });
      }
    },

    async resign_social_user({ commit, dispatch }) {
      let result = firebase.auth();
      let user = firebase.firestore().collection("users");
      let batch = firebase.firestore().batch();
      let user_details = firebase.firestore().collection("user_details");
      let displayName = result.user.displayName.replace(/ /g, "").toLowerCase();
      let nameValid = await dispatch("username_valid", displayName);
      while (!nameValid) {
        displayName =
          result.user.displayName.replace(/ /g, "").toLowerCase() +
          Math.floor(Math.random() * 1000);
        nameValid = await dispatch("username_valid", displayName);
      }

      let newUser = {
        username: displayName,
        id: result.user.uid,
        email: result.user.email,
      };

      let update = {};
      result.user.photoURL
        ? (update = {
            profile_pic: {
              low: result.user.photoURL,
              high: result.user.photoURL,
              created: firebase.firestore.FieldValue.serverTimestamp(),
            },
          })
        : null;

      Promise.all([
        user.doc(result.user.uid).set({
          username: displayName,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          email: result.user.email,
          ...update,
        }),

        user_details.doc(result.user.uid).set({
          created: firebase.firestore.FieldValue.serverTimestamp(),
          followers: 0,
          following: 0,
          username: displayName,
          email: result.user.email,
        }),
      ]).then(() => {
        commit("login", {
          ...update,
          ...newUser,
        });
      });
    },

    async logout({ commit }) {
      await firebase
        .auth()
        .signOut()
        .then(() => {
          commit("logout");
          commit("setNotification", 0);
        });
    },

    /******************************************************************************************************************/

    //ALL ABOUT USER

    async update_email({ commit, state }, newEmail) {
      // let oldmail = state.user.email;
      // let newmail =
      //   oldmail.slice(0, oldmail.lastIndexOf("@")) + "@rankingstuffs.com";
      firebase
        .auth()
        .currentUser.updateEmail(newEmail)
        .then(() => {
          commit("setUser", { ...state.user, email: newEmail });
        });
    },

    async fetch_user({ commit }, id) {
      return await firebase
        .firestore()
        .collection("users")
        .doc(id)
        .get()
        .then((documentSnapshot) => {
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
        })
        .catch((_) => {});
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
          created: firebase.firestore.FieldValue.serverTimestamp(),
        },
      });
      let userDetail = firebase
        .firestore()
        .collection("user_details")
        .doc(state.user.id);

      batch.update(userDetail, {
        profile_pic: {
          low: lowUrl,
          high: highUrl,
        },
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
              created: firebase.firestore.FieldValue.serverTimestamp(),
            },
            id: state.user.id,
          });
        })
        .then(() => {
          return {
            low: lowUrl,
            high: highUrl,
            created: firebase.firestore.FieldValue.serverTimestamp(),
            user: {
              id: state.user.id,
              username: state.user.username,
            },
          };
        })
        .catch((error) => {
          this.dispatch("set_snackbar", {
            show: true,
            message: "sorry. An error occured",
            type: "error",
          });
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
        .then((doc) => {
          data = {
            id: doc.id,
            ...doc.data(),
          };
        })
        .then(async () => {
          await db
            .collection("user_details")
            .doc(id)
            .get()
            .then((doc) => {
              data = {
                ...doc.data(),
                ...data,
              };
            });
        })
        .catch((error) => {
          throw error;
        });

      return data;
    },

    async set_profile({ state }, payload) {
      let users = firebase.firestore().collection("user_details");

      return users
        .doc(state.user.id)
        .update(payload)
        .catch((error) => {
          this.dispatch("set_snackbar", {
            show: true,
            message: "sorry. An error occured",
            type: "error",
          });
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
        user: state.user.id,
      });
      batch.update(followed, {
        followers: firebase.firestore.FieldValue.increment(1),
      });
      batch.set(follower.collection("following").doc(user.id), {
        user: user.id,
      });
      batch.update(follower, {
        following: firebase.firestore.FieldValue.increment(1),
      });

      batch
        .commit()
        .then(() => {
          dispatch("send_notification", {
            type: "follow",
            user: user,
          });
        })
        .catch((error) => {
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
        followers: firebase.firestore.FieldValue.increment(-1),
      });
      batch.delete(unfollower.collection("following").doc(id));
      batch.update(unfollower, {
        following: firebase.firestore.FieldValue.increment(-1),
      });
      batch.commit().catch((error) => {
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
        .then((doc) => {
          return doc.exists;
        })
        .catch((error) => {
          //no action needed
        });
    },

    async fetch_followers({ state }, payload) {
      return firebase
        .firestore()
        .collection("user_details")
        .doc(payload.id)
        .collection("followers")
        .get()
        .then((followers) => {
          return followers.docs;
        })
        .catch((error) => {
          this.dispatch("set_snackbar", {
            show: true,
            message: "sorry. An error occured",
            type: "error",
          });
          throw error;
        });
    },
    async fetch_following({ state }, payload) {
      return firebase
        .firestore()
        .collection("user_details")
        .doc(payload.id)
        .collection("following")
        .get()
        .then((following) => {
          return following.docs;
        })
        .catch((error) => {
          this.dispatch("set_snackbar", {
            show: true,
            message: "sorry. An error occured",
            type: "error",
          });
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
        .catch((error) => {
          throw error;
        });
    },

    async fetch_pending_lists({ state }, payload) {
      let pending = firebase.firestore().collection("pending_lists");
      return pending
        .limit(payload.limit)
        .get()
        .then((query) => {
          return query.docs;
        })
        .catch((error) => {
          throw error;
        });
    },

    async delete_pending_list({ state }, id) {
      firebase
        .firestore()
        .collection("pending_lists")
        .doc(id)
        .delete()
        .catch((error) => {
          throw error;
        });
    },

    async upload_list({ state, dispatch }, list) {
      let db = firebase.firestore();
      let dbList = firebase.firestore().collection("lists");
      let batch = firebase.firestore().batch();
      let length = list.items.length;
      let votes = (length * (length + 1)) / 2;

      let popularity = votes / 3;

      let others = {};
      let features = [];

      list.description !== ""
        ? (others = { description: list.description })
        : null;
      list.selfModerated ? (others = { self_moderated: true }) : null;
      // list.tags !== [] ? (others = { tags: list.tags, ...others }) : null;
      if (list.category === "") {
        list.category = "Miscellaneous";
      } else {
        if (list.subCategory === "") {
          null;
        } else {
          others = {
            sub_category: list.subCategory,
            ...others,
          };
        }
      }

      batch.set(dbList.doc(list.id), {
        //add properties to list
        title: list.title,
        votes: votes,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        creator: list.user,
        rating: 0,
        raters_count: 0,
        item_count: length,
        preview_image: list.preview_image,
        votable: list.votable,
        type: list.type,
        category: list.category,
        comment_count: 0,
        popularity: popularity,
        rating_score: 0,
        voters_count: 1,
        views: 0,
        net_vote: votes,
        upvotes: votes,
        ...others,
      });

      let promises = [];
      //loops through all items received. Uploads each item as a new document in lists/list id/items collection
      for (let i = 0; i < list.items.length; i++) {
        promises.push(
          dispatch("add_list_item", {
            list: list,
            user: list.user,
            net_vote: list.items.length - i,
            item: list.items[i],
            first_addition: true,
            rank: i + 1,
          }).then((details) => {
            if (details.info) {
              features.push(details.info);
            }
          })
        );
      }

      await Promise.all(promises);

      batch.set(db.collection("list_features").doc(list.id), {
        items: features,
      });

      // batch.set(db.collection("list_keywords").doc(list.id), {
      //   words: list.keywords,
      //   title: list.title,
      // });

      batch.update(db.collection("user_details").doc(list.user.id), {
        lists: firebase.firestore.FieldValue.increment(1),
      });
      batch.update(db.collection("categories").doc(list.category), {
        list_count: firebase.firestore.FieldValue.increment(1),
      });
      if (list.subCategory !== "") {
        let subID = encrypt(list.subCategory);
        batch.update(
          db
            .collection("categories")
            .doc(list.category)
            .collection("subs")
            .doc(subID),
          { list_count: firebase.firestore.FieldValue.increment(1) }
        );
      }

      await batch.commit().then(() => {
        const algoliaIndex = algoliaClient.initIndex("lists");
        algoliaIndex.saveObject({
          objectID: list.id,
          title: list.title,
        });

        if (list.demanded) {
          this.dispatch("send_notification", {
            type: "demand-created",
            list: { id: list.id, title: list.title, user: list.user },
            demand_id: list.demand_id,
            title: list.title,
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
            ...image,
          },
          recipient: list.user.id,
        }).catch((error) => {
          this.dispatch("set_snackbar", {
            show: true,
            message: "Ooops. An error occured while uploading list",
            type: "error",
          });
          throw error;
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
        .runTransaction(async (transaction) => {
          return transaction.get(list).then((doc) => {
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
              rating_score: ratingScore,
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
                created: firebase.firestore.FieldValue.serverTimestamp(),
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
              ...image,
            },
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
        .then((doc) => {
          return doc.data();
        });
    },

    async update_list_preview({ state }, payload) {
      firebase
        .firestore()
        .collection("lists")
        .doc(payload.id)
        .update({
          preview_image: payload.image,
        });
    },

    async add_pending_list_item({ state }, payload) {
      let db = firebase.firestore();

      db.collection("pending_list_items").add({
        ...payload,
        user: { id: state.user.id, username: state.user.username },
      });
    },

    async fetch_pending_list_items({ state }, payload) {
      let db = firebase.firestore();

      return db
        .collection("pending_list_items")
        .limit(payload.limit)
        .get()
        .then((query) => {
          return query.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          });
        });
    },

    async delete_pending_list_item({ state }, id) {
      firebase
        .firestore()
        .collection("pending_list_items")
        .doc(id)
        .delete()
        .catch((error) => {
          console.log(error);
        });
    },

    async add_list_item({ state, dispatch }, payload) {
      let db = firebase.firestore();
      let batch = db.batch();

      let list = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list.id);
      let itemID = encrypt(payload.item.name.toLowerCase());
      let user, low_url, high_url, others;

      payload.user
        ? (user = payload.user)
        : (user = { id: state.user.id, username: state.user.username });

      others = {};

      if (payload.item.userImage && !payload.item.isLink) {
        let low_image, high_image;

        low_image = await firebase
          .storage()
          .ref(
            "lists/" +
              payload.list.id +
              "/items/" +
              itemID +
              "/" +
              1 +
              "/low.jpeg"
          )
          .put(getBlob(payload.item.userImage.low));
        high_image = await firebase
          .storage()
          .ref(
            "lists/" +
              payload.list.id +
              "/items/" +
              itemID +
              "/" +
              1 +
              "/high.jpeg"
          )
          .put(getBlob(payload.item.userImage.high));

        low_url = await low_image.ref.getDownloadURL();
        high_url = await high_image.ref.getDownloadURL();
        others = {
          image: {
            url: { low: low_url, high: high_url },
            user: user,
            created: firebase.firestore.FieldValue.serverTimestamp(),
            source: payload.item.userImage.source,
          },
        };
      }

      let ID;

      if (!payload.item.info && payload.item.isLink) {
        dispatch("add_db_item", { item: payload.item, user: user });
        ID = itemID;
      } else if (payload.item.info) {
        ID = payload.item.info;
        payload.item.isLink = true;
      } else {
        ID = false;
      }
      let rank;

      if (payload.first_addition) {
        rank = payload.rank;
      } else {
        rank = await list.get().then((list) => {
          return list.data().item_count;
        });
      }

      ID ? (others = { info: ID }) : null;
      payload.item.comment && payload.item.comment !== ""
        ? (others = { note: payload.item.comment, ...others })
        : null;

      batch.set(list.collection("items").doc(itemID), {
        rank: rank,
        name: payload.item.name,
        net_vote: payload.net_vote,
        upvotes: payload.net_vote,
        downvotes: 0,
        list_id: payload.list.id,
        comment_count: 0,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        user: user.id,
        is_link: payload.item.isLink,
        ...others,
      });

      if (!payload.first_addition) {
        let data = {};
        if (!(await this.dispatch("check_list_voted", payload.list.id))) {
          data = {
            voters_count: firebase.firestore.FieldValue.increment(1),
          };
        }
        batch.update(list, {
          votes: firebase.firestore.FieldValue.increment(payload.net_vote),
          item_count: firebase.firestore.FieldValue.increment(1),
          ...data,
        });
        batch.set(list.collection("voters").doc(user.id), {
          created: firebase.firestore.FieldValue.serverTimestamp(),
        });
        batch.update(db.collection("list_features").doc(payload.list.id), {
          items: firebase.firestore.FieldValue.arrayUnion(ID),
        });
      }

      return batch
        .commit()
        .then(() => {
          if (!payload.first_addition) {
            this.dispatch("update_activities", {
              type: "item",
              item: {
                info: ID,
                name: payload.item.name,
              },
              list: {
                id: payload.list.id,
                title: payload.list.title,
              },
              recipient: user.id,
            });
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
                  comment_count: 0,
                  created: firebase.firestore.FieldValue.serverTimestamp(),
                  user: user.id,
                  is_link: payload.item.isLink,
                };
              },
              id: itemID,
            };
          } else {
            if (ID) {
              return { info: ID };
            } else {
              return {};
            }
          }
        })
        .catch((error) => {
          throw error;
        });
    },

    async add_db_item({ commit }, payload) {
      let db = firebase.firestore();
      let id = encrypt(payload.item.name.toLowerCase());
      return await db
        .collection("items")
        .doc(id)
        .get()
        .then(async (item) => {
          if (item.exists) {
            return "exists";
          } else {
            return await db
              .collection("items")
              .doc(id)
              .set({
                name: payload.item.name,
                media_count: 0,
                keywords: payload.item.keywords,
              })
              .then(() => {
                const algoliaIndex = algoliaClient.initIndex("items");
                algoliaIndex.saveObject({
                  objectID: id,
                  title: payload.item.name,
                });
                db.collection("items")
                  .doc(id)
                  .collection("contributors")
                  .doc(payload.user.id)
                  .set(payload.user);
              })
              .then(() => {
                if (payload.item.userImage) {
                  this.dispatch("upload_item_image", {
                    image: payload.item.userImage,
                    item: { id: id, ...payload.item },
                    isUrl: true,
                  });
                }
                return id;
              });
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
          rank: payload.rank,
        });
    },

    async fetch_item_rank({ commit }, payload) {
      return firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item.id)
        .get()
        .then((doc) => {
          return doc.data();
        });
    },

    async update_popularity({ state }, id) {
      let db = firebase.firestore();
      let list = firebase
        .firestore()
        .collection("lists")
        .doc(id);
      let popularity;

      db.runTransaction(async (transaction) => {
        await transaction.get(list).then((list) => {
          if (list.data().votable) {
            popularity =
              (Math.round(
                (list.data().votes +
                  2 * list.data().raters_count +
                  list.data().comment_count +
                  list.data().views * 4) /
                  4
              ) *
                100) /
              100;
          } else {
            popularity =
              Math.round(
                (2 * list.data().raters_count +
                  list.data().comment_count +
                  list.data().views) *
                  4
              ) / 3;
          }
        });

        transaction.update(list, {
          popularity: popularity,
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
        .then((doc) => {
          list = {
            id: doc.id,
            ...doc.data(),
          };
        })
        .then(async () => {
          await db
            .collection("items")
            .orderBy("net_vote", "desc")
            .orderBy("created")
            .limit(50)
            .get()
            .then(async (querySnapshot) => {
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
        .then((doc) => {
          return doc.exists ? { id: id, ...doc.data() } : false;
        });
    },

    async fetch_list_with_items({ state }, id) {
      return await firebase
        .firestore()
        .collection("lists")
        .doc(id)
        .get()
        .then(async (doc) => {
          return {
            id: id,
            ...doc.data(),
            items: await this.dispatch("fetch_list_items", {
              list_id: id,
              limit: 3,
            }),
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
        .then((query) => {
          return query.docs;
        });
    },

    async favorite_item({ state }, payload) {
      let db = firebase.firestore();
      let batch = db.batch();
      let low_url;
      let others = {};
      let user = { username: state.user.username, id: state.user.id };
      let overriden = false;

      if (payload.item.userImage) {
        let low_image;

        low_image = await firebase
          .storage()
          .ref(
            "users/" +
              state.user.id +
              "/favorites/" +
              payload.category +
              "/low.jpeg"
          )
          .put(getBlob(payload.item.userImage.low));

        low_url = await low_image.ref.getDownloadURL();
        others = {
          image: {
            url: low_url,
            user: user.id,
            created: firebase.firestore.FieldValue.serverTimestamp(),
            source: payload.item.userImage.source,
          },
        };
        overriden = true;
      }

      let data = {};

      if (payload.item.info) {
        data = { info: payload.item.info };
      }

      payload.comment && payload.comment !== ""
        ? (data = { comment: payload.comment })
        : null;

      let dbUser = db.collection("user_details").doc(state.user.id);
      let fav = dbUser
        .collection("favorites")
        .doc("data")
        .collection("items")
        .doc(payload.category);

      batch.set(fav, {
        name: payload.item.name,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        ...data,
        ...others,
      });
      if (!payload.existing)
        batch.update(dbUser, {
          favorite_items: firebase.firestore.FieldValue.increment(1),
        });
      else {
        if (payload.existing.data().image && !overriden)
          firebase
            .storage()
            .ref(
              "/users/" +
                state.user.id +
                "/favorites/" +
                payload.existing.id +
                "/low.jpeg"
            ).delete();
      }

      await batch.commit().catch((error) => {
        this.dispatch("set_snackbar", {
          show: true,
          message: "sorry. An error occured",
          type: "error",
        });
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
        favorite_items: firebase.firestore.FieldValue.increment(-1),
      });
      batch.commit().catch((error) => {
        this.dispatch("set_snackbar", {
          show: true,
          message: "sorry. An error occured",
          type: "error",
        });
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
        .then((query) => {
          return query.docs;
        })
        .catch((error) => {
          this.dispatch("set_snackbar", {
            show: true,
            message: "sorry. An error occured",
            type: "error",
          });
          throw error;
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
        .then((query) => {
          return query.docs;
        });
    },

    async favorite_list({ state }, payload) {
      let auth = firebase.auth();
      if (!auth.currentUser && !auth.currentUser.isAnonymous) {
        return;
      }
      let user = firebase
        .firestore()
        .collection("user_details")
        .doc(state.user.id);
      let favorites = user.collection("favorites/data/lists");

      let batch = firebase.firestore().batch();

      batch.set(favorites.doc(payload.id), {
        created: firebase.firestore.FieldValue.serverTimestamp(),
        list: payload.id,
      });

      batch.update(user, {
        favorite_lists: firebase.firestore.FieldValue.increment(1),
      });

      batch.commit().catch((_) => {
        //no action needed
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
        favorite_lists: firebase.firestore.FieldValue.increment(-1),
      });

      batch.commit().catch((_) => {
        //no action needed
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
        .then((doc) => {
          return doc.exists;
        })
        .catch((_) => {
          //no action needed
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
        .then(async (querySnapshot) => {
          return await querySnapshot.docs;
        })
        .catch((_) => {
          //no activity needed
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
        .then(async (querySnapshot) => {
          return await querySnapshot.docs;
        })
        .catch((_) => {
          this.dispatch("set_snackbar", {
            show: true,
            message: "sorry. An error occured",
            type: "error",
          });
          throw error;
        });
    },

    async fetch_user_lists({ state }, payload) {
      let db = firebase.firestore().collection("lists");
      let search;

      search = db.where("creator.id", "==", payload.user);

      return search
        .orderBy("created", "desc")
        .limit(payload.limit)
        .get()
        .then((query) => {
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
        .then((query) => {
          return query.docs;
        });
    },

    async upload_pending_item_info({ state }, update) {
      await firebase
        .firestore()
        .collection("pending_item_infos")
        .add({
          created: firebase.firestore.FieldValue.serverTimestamp(),
          ...update,
        })
        .catch((_) => {
          this.dispatch("set_snackbar", {
            show: true,
            type: "error",
            message: "Sorry. An error occured",
          });
        });
    },

    async fetch_pending_item_infos({ state }) {
      return firebase
        .firestore()
        .collection("pending_item_infos")
        .limit(50)
        .get()
        .then((query) => {
          return query.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          });
        });
    },

    async delete_pending_item_info({ state }, id) {
      await firebase
        .firestore()
        .collection("pending_item_infos")
        .doc(id)
        .delete();
    },

    async update_item_info({ state }, payload) {
      if (!this.getters.semiAuthenticated) {
        await this.dispatch("anonymous_login");
      }
      let batch = firebase.firestore().batch();
      let itemLoc = firebase
        .firestore()
        .collection("items")
        .doc(payload.item.id);

      batch.update(itemLoc, payload.update);
      batch.set(itemLoc.collection("contributors").doc(payload.user.id), {
        id: payload.user.id,
        username: payload.user.username,
      });
      batch
        .commit()
        .then(() => {
          this.dispatch("update_activities", {
            type: "item-update",
            item: {
              info: payload.item.id,
              name: payload.item.name,
            },
            recipient: payload.user.id,
          });
        })
        .catch((_) => {
          this.dispatch("set_snackbar", {
            show: true,
            message: "Sorry. An error occured",
            type: "error",
          });
          throw _;
        });
    },

    async upload_pending_item_image({ state }, update) {
      await firebase
        .firestore()
        .collection("pending_item_images")
        .add({
          created: firebase.firestore.FieldValue.serverTimestamp(),
          ...update,
        })
        .catch((_) => {
          this.dispatch("set_snackbar", {
            show: true,
            type: "error",
            message: "Sorry. An error occured",
          });
          throw _;
        });
    },

    async fetch_pending_item_images({ state }) {
      return firebase
        .firestore()
        .collection("pending_item_images")
        .limit(50)
        .get()
        .then((query) => {
          return query.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          });
        });
    },

    async delete_pending_item_image({ state }, id) {
      await firebase
        .firestore()
        .collection("pending_item_images")
        .doc(id)
        .delete();
    },

    async upload_item_image({ state }, update) {
      let itemLoc = firebase
        .firestore()
        .collection("items")
        .doc(update.item.id);

      let low_image, high_image, low_url, high_url, low_loc, high_loc;
      let batch = firebase.firestore().batch();

      low_loc = firebase
        .storage()
        .ref("items/" + update.item.id + "/" + 1 + "/low.jpeg");
      low_image = await low_loc
        .put(getBlob(update.image.low))
        .catch((error) => {
          //
        });
      high_loc = firebase
        .storage()
        .ref("items/" + update.item.id + "/" + 1 + "/high.jpeg");
      high_image = await high_loc
        .put(getBlob(update.image.high))
        .catch((error) => {
          //
        });

      low_url = await low_image.ref.getDownloadURL();
      high_url = await high_image.ref.getDownloadURL();
      let media = itemLoc.collection("media").doc();

      batch.set(media, {
        source: update.image.source,
        url: {
          low: low_url,
          high: high_url,
        },
        votes: 1,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        user: update.image.user,
      });

      let upload;
      update.item.image
        ? (upload = {
            media_count: firebase.firestore.FieldValue.increment(1),
          })
        : (upload = {
            media_count: firebase.firestore.FieldValue.increment(1),
            image: {
              id: media.id,
              url: {
                low: low_url,
                high: high_url,
              },
              user: update.image.user,
              source: update.image.source,
              created: firebase.firestore.FieldValue.serverTimestamp(),
            },
          });
      batch.update(itemLoc, upload);

      return batch.commit().then(() => {
        if (!update.isUrl) {
          this.dispatch("update_activities", {
            type: "item-update",
            item: {
              info: update.item.id,
              name: update.item.name,
              image: low_url,
            },
            recipient: update.image.user.id,
          });
        }
        return {
          url: {
            high: high_url,
            low: low_url,
          },
          source: update.image.source,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          id: media.id,
          user: update.image.user,
        };
      });
    },

    async fetch_item({ commit }, id) {
      let item = firebase
        .firestore()
        .collection("items")
        .doc(id);
      return item.get().then((docref) => {
        return { id: docref.id, ...docref.data() };
      });
    },

    async fetch_item_featured({ state }, id) {
      return firebase
        .firestore()
        .collection("list_features")
        .where("items", "array-contains", id)
        .get()
        .then((query) => {
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
        .then((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
    },

    async convert_keywords({ state }) {
      let lists = firebase.firestore().collection("lists");
      let keywords = firebase.firestore().collection("list_keywords");

      lists
        .get()
        .then((query) => {
          query.docs.forEach((doc) => {
            keywords.doc(doc.id).set({
              words: doc.data().keywords,
              title: doc.data().title,
            });
          });
        })
        .catch((error) => {
          //no activity needed
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
        created: firebase.firestore.FieldValue.serverTimestamp(),
      });
      batch.update(item, {
        comment_count: firebase.firestore.FieldValue.increment(1),
      });
      batch.update(list, {
        comment_count: firebase.firestore.FieldValue.increment(1),
      });

      return await batch
        .commit()
        .then(() => {
          let image = {};
          payload.item.image ? (image = { image: payload.item.image }) : null;

          this.dispatch("update_activities", {
            type: "comment",
            comment: payload.comment,
            item: {
              name: payload.item.name,
              id: payload.item.id,
              ...image,
            },
            list: {
              title: payload.list.title,
              id: payload.list.id,
            },
            recipient: user.id,
          });
          this.dispatch("update_popularity", payload.list.id);
          return {
            id: comment.id,
            data() {
              return {
                content: payload.comment,
                user: user,
                created: firebase.firestore.Timestamp.fromDate(new Date()),
              };
            },
          };
        })
        .catch((error) => {
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
          edited: true,
        });
    },

    async delete_comment({ state }, payload) {
      let item = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id);

      await item
        .collection("comments")
        .doc(payload.comment_id)
        .delete()
        .then(() => {
          item.update({
            comment_count: firebase.firestore.FieldValue.increment(-1),
          });
        });
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
          edited: true,
        });
    },

    async delete_reply({ state }, payload) {
      const comment = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .doc(payload.comment_id);

      await comment
        .collection("replies")
        .doc(payload.reply_id)
        .delete()
        .then(() => {
          comment.update({
            replies_count: firebase.firestore.FieldValue.increment(-1),
          });
        });
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
        .then((querySnapshot) => {
          return querySnapshot.docs;
        })
        .catch((error) => {
          this.dispatch("set_snackbar", {
            show: true,
            message: "Error fetching comments",
            type: "error",
          });
          throw error;
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
        user: state.user.id,
      });
      batch.update(comment, {
        likes: firebase.firestore.FieldValue.increment(1),
      });
      batch.commit().catch((error) => {
        this.dispatch("set_snackbar", {
          show: true,
          message: "sorry. An error occured",
          type: "error",
        });
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
        likes: firebase.firestore.FieldValue.increment(-1),
      });
      batch.commit().catch((error) => {
        this.dispatch("set_snackbar", {
          show: true,
          message: "sorry. An error occured",
          type: "error",
        });
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
            .then((doc) => {
              return doc.exists;
            })
            .catch((_) => {
              //no action needed
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
        created: firebase.firestore.FieldValue.serverTimestamp(),
      });
      batch.update(comment, {
        replies_count: firebase.firestore.FieldValue.increment(1),
      });

      return batch
        .commit()
        .then(() => {
          this.dispatch("update_activities", {
            type: "reply",
            comment: {
              id: payload.comment_id,
              content: payload.comment_content,
            },
            reply: {
              id: reply.id,
              content: payload.reply,
            },
            item: {
              id: payload.item_id,
              name: payload.item_name,
            },
            list: {
              id: payload.list_id,
              title: payload.list_title,
            },
            ...payload.commenter,
          });
        })
        .then(() => {
          return {
            id: reply.id,
            data: () => {
              return {
                content: payload.reply,
                user: { id: state.user.id, username: state.user.username },
                created: firebase.firestore.Timestamp.fromDate(new Date()),
              };
            },
          };
        })
        .catch((error) => {
          this.dispatch("set_snackbar", {
            show: true,
            message: "sorry. Could not upload reply. Try again",
            type: "error",
          });
          throw error;
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
        .then((querySnapshot) => {
          return querySnapshot.docs;
        })
        .catch((error) => {
          this.dispatch("set_snackbar", {
            show: true,
            message: "Error fetching replies",
            type: "error",
          });
          throw error;
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
        user: state.user.id,
      });
      batch.update(reply, {
        likes: firebase.firestore.FieldValue.increment(1),
      });
      batch.commit().catch((_) => {
        //no action needed
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
        likes: firebase.firestore.FieldValue.increment(-1),
      });
      batch.commit().catch((_) => {
        //no action needed
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
            .then((doc) => {
              return doc.exists;
            })
            .catch((_) => {
              //no action needed
            });
    },

    /********************************************************************************************************************/
    //     ALL ABOUT VOTES

    async upvote({ commit, state }, payload) {
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

      let updateDatabase = function() {
        if (!payload.list_voted) {
          batch.update(list, {
            voters_count: firebase.firestore.FieldValue.increment(1),
          });
        }

        batch.update(item, {
          votes: firebase.firestore.FieldValue.increment(1),
          net_vote: firebase.firestore.FieldValue.increment(2),
          upvotes: firebase.firestore.FieldValue.increment(1),
        });

        batch.update(list, {
          votes: firebase.firestore.FieldValue.increment(1),
          net_vote: firebase.firestore.FieldValue.increment(2),
          upvotes: firebase.firestore.FieldValue.increment(1),
        });
      };

      if (!this.getters.authenticated) {
        voteActions.addVote({
          list_id: payload.list.id,
          item_id: payload.item.id,
          type: "upvote",
        });
      } else {
        batch.set(item.collection("voters").doc(state.user.id), {
          user: state.user.id,
          item: payload.item.id,
          type: "upvote",
        });
        if (!payload.list_voted) {
          batch.set(list.collection("voters").doc(state.user.id), {
            created: firebase.firestore.FieldValue.serverTimestamp(),
          });
        }
      }

      updateDatabase();

      batch
        .commit()
        .then(() => {
          if (this.getters.authenticated) {
            // let image = {};
            // payload.item.image
            //   ? (image = { image: payload.item.image.low })
            //   : null;
            this.dispatch("update_activities", {
              type: "upvote",
              item: {
                name: payload.item.name,
                id: payload.item.id,
              },
              list: {
                title: payload.list.title,
                id: payload.list.id,
              },
            });
          }
          this.dispatch("update_popularity", payload.list.id);
        })
        .catch((_) => {
          this.dispatch("set_snackbar", {
            show: true,
            message: "sorry. An error occured",
            type: "error",
          });
        });
    },

    async downvote({ commit, state }, payload) {
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

      let updateDatabase = function() {
        if (!payload.list_voted) {
          batch.update(list, {
            voters_count: firebase.firestore.FieldValue.increment(1),
          });
        }

        batch.update(item, {
          votes: firebase.firestore.FieldValue.increment(1),
          net_vote: firebase.firestore.FieldValue.increment(-1),
          downvotes: firebase.firestore.FieldValue.increment(1),
        });

        batch.update(list, {
          votes: firebase.firestore.FieldValue.increment(1),
          net_vote: firebase.firestore.FieldValue.increment(-1),
          downvotes: firebase.firestore.FieldValue.increment(1),
        });
      };

      if (!this.getters.authenticated) {
        voteActions.addVote({
          list_id: payload.list.id,
          item_id: payload.item.id,
          type: "downvote",
        });
      } else {
        batch.set(item.collection("voters").doc(state.user.id), {
          user: state.user.id,
          item: payload.item.id,
          type: "downvote",
        });
        if (!payload.list_voted) {
          batch.set(list.collection("voters").doc(state.user.id), {
            created: firebase.firestore.FieldValue.serverTimestamp(),
          });
        }
      }

      updateDatabase();

      batch
        .commit()
        .then(() => {
          if (this.getters.authenticated) {
            // let image = {};
            // payload.item.image
            //   ? (image = { image: payload.item.image.low })
            //   : null;
            this.dispatch("update_activities", {
              type: "downvote",
              item: {
                name: payload.item.name,
                id: payload.item.id,
              },
              list: {
                title: payload.list.title,
                id: payload.list.id,
              },
            });
          }

          this.dispatch("update_popularity", payload.list.id);
        })
        .catch((_) => {
          this.dispatch("set_snackbar", {
            show: true,
            message: "sorry. An error occured",
            type: "error",
          });
        });
    },

    async check_item_voted({ state }, payload) {
      let checkStorage = function() {
        let votes = voteActions.getVotes();
        let vote = votes.find((a) => {
          return a.list_id === payload.list_id && a.item_id === payload.item_id;
        });

        return vote || false;
      };
      let checkDB = async function() {
        return await firebase
          .firestore()
          .collection("lists")
          .doc(payload.list_id)
          .collection("items")
          .doc(payload.item_id)
          .collection("voters")
          .doc(state.user.id)
          .get()
          .then((doc) => {
            return doc.exists ? doc.data() : false;
          })
          .catch((_) => {
            return { type: "false" };
          });
      };

      if (!this.getters.authenticated) {
        return checkStorage();
      }

      // let voted = checkStorage(state.user.id);
      // if (voted.type === "false") {
      //   return await checkDB();
      // }
      return await checkDB();
    },

    async check_list_voted({ state }, id) {
      let checkStorage = function() {
        let votes = voteActions.getVotes();
        let index = votes.findIndex((a) => {
          return a.list_id === id;
        });

        return index >= 0;
      };
      let checkDB = async function() {
        return await firebase
          .firestore()
          .collection(`lists/${id}/voters`)
          .doc(state.user.id)
          .get()
          .then((doc) => {
            return doc.exists ? true : false;
          })
          .catch((_) => {
            //no action needed
          });
      };

      firebase
        .firestore()
        .doc(`lists/${id}`)
        .update({
          views: firebase.firestore.FieldValue.increment(1),
        });

      if (!this.getters.authenticated) {
        return checkStorage();
      }

      // let voted = checkStorage(state.user.id);
      // if (!voted) {
      //   return checkDB();
      // }
      return await checkDB();
    },

    /*****************************************************************************************************************/
    //    ALL ABOUT USERNAME

    async username_valid({ commit }, username) {
      let users = firebase.firestore().collection("users");

      return await users
        .where("username", "==", username)
        .get()
        .then((docs) => {
          return docs.empty;
        });
    },

    add_categories({ commit }, payload) {
      for (let category of payload) {
        firebase
          .firestore()
          .collection("categories")
          .add({
            name: category,
          });
      }
    },

    async send_notification({ state, dispatch }, payload) {
      let recipients;
      let sendData;
      let users = firebase.firestore().collection("users");

      switch (payload.type) {
        case "reply":
          // recipients = await db
          //   .collection("lists")
          //   .doc(payload.list.id)
          //   .collection("items")
          //   .doc(payload.item.id)
          //   .collection("comments")
          //   .doc(payload.comment.id)
          //   .collection("repliers")
          //   .get()
          //   .then(query => {
          //     return [
          //       payload.commenter.id,
          //       ...query.docs.map(doc => {
          //         return doc.data().user;
          //       })
          //     ];
          //   });

          recipients = [payload.commenter.id];

          sendData = {
            list: { id: payload.list.id, title: payload.list.title },
            item: { id: payload.item.id, name: payload.item.name },
            comment_id: payload.comment.id,
            type: payload.type,
            user: {
              username: state.user.username,
              id: state.user.id,
            },
            commenter: {
              id: payload.commenter.id,
              username: payload.commenter.username,
            },
          };
          break;

        case "demand-created":
          recipients = await dispatch("fetch_demanders", payload.demand_id);

          sendData = {
            user: payload.list.user,
            list: { id: payload.list.id, title: payload.list.title },
            type: payload.type,
          };
          break;

        case "follow":
          recipients = [payload.user.id];
          sendData = {
            user: {
              username: state.user.username,
              id: state.user.id,
            },
            type: payload.type,
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
        case "demand-approved":
          recipients = [payload.recipient];
          sendData = payload.data;
          break;
        case "demand-disapproved":
          recipients = [payload.recipient];
          sendData = payload.data;
          break;
        case "item-approved":
          recipients = [payload.recipient];
          sendData = payload.data;
          break;
        case "item-disapproved":
          recipients = [payload.recipient];
          sendData = payload.data;
      }
      await Promise.all(
        recipients.map((recipient) => {
          if (state.user.id !== recipient) {
            users
              .doc(recipient)
              .collection("updates")
              .doc("data")
              .collection("notifications")
              .add({
                created: firebase.firestore.FieldValue.serverTimestamp(),
                ...sendData,
              })
              .then(async () => {
                await users
                  .doc(recipient)
                  .collection("updates")
                  .doc("data")
                  .set(
                    {
                      notifications: firebase.firestore.FieldValue.increment(1),
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
        .then((query) => {
          return query.docs;
        });
    },

    async reset_notifications({ commit, state }) {
      commit("setNotification", 0);
      firebase
        .firestore()
        .collection("users")
        .doc(state.user.id)
        .collection("updates")
        .doc("data")
        .update({
          notifications: 0,
        })
        .catch((_) => {
          //no action needed
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
        .then((docRef) => {
          value = docRef.data();
        })
        .then(async () => {
          if (complete) {
            await item
              .collection("images")
              .get()
              .then((query) => {
                let images = query.docs;
                value = {
                  images: images,
                  ...value,
                };
              });
          }
        });

      return value;
    },

    async upload_pending_demand({ state }, demand) {
      let pendingDemand = firebase
        .firestore()
        .collection("pending_demands")
        .doc(demand.id);
      let batch = firebase.firestore().batch();

      await pendingDemand.set(demand).catch((_) => {
        throw error;
      });
    },

    async fetch_pending_demands({ state }) {
      return firebase
        .firestore()
        .collection("pending_demands")
        .get()
        .then((query) => {
          return query.docs;
        })
        .catch((error) => {
          throw error;
        });
    },

    async demand_list({ state }, demand) {
      if (!this.getters.authenticated) {
        return;
      }

      let db = firebase.firestore();
      let batch = db.batch();

      let others;

      demand.category == ""
        ? (others = { category: "Miscellaneous" })
        : demand.subCategory
        ? (others = {
            category: demand.category,
            sub_category: demand.subCategory,
          })
        : (others = { category: demand.category });
      demand.comment !== ""
        ? (others = { comment: demand.comment, ...others })
        : null;

      batch.set(db.collection("demands").doc(demand.id), {
        waiters_count: 1,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        user: demand.user.id,
        title: demand.title,
        ...others,
      });
      batch.set(db.collection("demand_keywords").doc(demand.id), {
        words: demand.keywords,
        title: demand.title,
      });
      batch.set(db.collection("demand_waiters").doc(demand.id), {
        demanders: [demand.user.id],
      });
      batch.update(db.collection("user_details").doc(demand.user.id), {
        demands: firebase.firestore.FieldValue.increment(1),
      });
      await batch.commit().then(() => {
        const index = algoliaClient.initIndex("demands");
        index.saveObject({
          objectID: demand.id,
          title: demand.title,
        });
        this.dispatch("update_activities", {
          type: "demand",
          demand: {
            title: demand.title,
            id: demand.id,
          },
          recipient: demand.user.id,
        });
      });
    },
    async flag({ state }, payload) {
      let flagged = firebase.firestore().collection("flagged");
      await flagged
        .add({
          ...payload,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          flagger: { id: state.user.id, username: state.user.username },
        })
        .catch((error) => {
          this.dispatch("set_snackbar", {
            show: true,
            message: "sorry. An error occured",
            type: "error",
          });
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

      return await query
        .get()
        .then((query) => {
          return query.docs;
        })
        .catch((error) => {
          throw error;
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
        .then((doc) => {
          demand = doc.data();
        })
        .then(async () => {
          await loc
            .collection("comments")
            .get()
            .then((query) => {
              demand.comments = query.docs;
            });
          return demand;
        });
    },
    async fetch_demand({ state }, id) {
      let loc = firebase
        .firestore()
        .collection("demands")
        .doc(id);

      return loc.get().then((doc) => {
        return doc.exists ? { id: doc.id, ...doc.data() } : false;
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
          .then((query) => {
            return query.docs;
          });
      } else {
        return query
          .startAfter(payload.lastDoc)
          .limit(payload.limit)
          .get()
          .then((query) => {
            return query.docs;
          });
      }
    },
    async fetch_lists({ state }, payload) {
      let lists = firebase.firestore().collection("lists");
      let query = lists.where("type", "<", "personal");

      switch (payload.sort) {
        case "random":
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
          .then((query) => {
            return query.docs;
          });
      } else {
        return query
          .startAfter(payload.lastDoc)
          .limit(payload.limit)
          .get()
          .then((query) => {
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
        .then((doc) => {
          return doc.data().demanders;
        });
    },
    async join_demanders({ state }, demand) {
      if (!this.getters.authenticated) {
        return;
      }
      let db = firebase.firestore();
      let batch = firebase.firestore().batch();

      batch.set(
        db.collection("demand_waiters").doc(demand.id),
        {
          demanders: firebase.firestore.FieldValue.arrayUnion(state.user.id),
          id: demand.id,
        },
        { merge: true }
      );
      batch.update(db.collection("demands").doc(demand.id), {
        waiters_count: firebase.firestore.FieldValue.increment(1),
      });
      batch.commit().catch((error) => {
        this.dispatch("set_snackbar", {
          show: true,
          message: "sorry. An error occured",
          type: "error",
        });
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
          username: state.user.username,
        },
      });
      batch.update(demand, {
        comment_count: firebase.firestore.FieldValue.increment(1),
      });
      return batch
        .commit()
        .then(() => {
          return {
            data() {
              return {
                created: firebase.firestore.FieldValue.serverTimestamp(),
                content: payload.content,
                user: {
                  id: state.user.id,
                  username: state.user.username,
                },
              };
            },
          };
        })
        .catch((error) => {
          this.dispatch("set_snackbar", {
            show: true,
            message: "sorry. An error occured",
            type: "error",
          });
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
        .then((query) => {
          return query.docs;
        })
        .catch((error) => {
          this.dispatch("set_snackbar", {
            show: true,
            message: "sorry. An error occured",
            type: "error",
          });
          throw error;
        });
    },
    async leave_demanders({ state }, demand) {
      let db = firebase.firestore();
      let batch = firebase.firestore().batch();

      batch.set(
        db.collection("demand_waiters").doc(demand.id),
        {
          demanders: firebase.firestore.FieldValue.arrayRemove(state.user.id),
          id: demand.id,
        },
        { merge: true }
      );
      batch.update(db.collection("demands").doc(demand.id), {
        waiters_count: firebase.firestore.FieldValue.increment(-1),
      });
      batch.commit().catch((error) => {
        this.dispatch("set_snackbar", {
          show: true,
          message: "sorry. An error occured",
          type: "error",
        });
        throw error;
      });
    },
    async delete_demand({ state }, id) {
      let db = firebase.firestore();

      db.collection("demands")
        .doc(id)
        .delete()
        .then(() => {
          const algoliaIndex = algoliaClient.initIndex("demands");
          algoliaIndex.deleteObject(id);
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
            .then(async (query) => {
              await Promise.all(
                query.docs.map((doc) => {
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
    async delete_pending_demand({ state }, id) {
      firebase
        .firestore()
        .collection("pending_demands")
        .doc(id)
        .delete()
        .then(() => {})
        .catch((_) => {
          console.log(_);
        });
    },
    async checkWaiting({ state }, id) {
      if (!this.getters.authenticated) {
        return false;
      }
      return await firebase
        .firestore()
        .collection("demand_waiters")
        .where("id", "==", id)
        .where("demanders", "array-contains", state.user.id)
        .get()
        .then((query) => {
          return query.docs.length === 0 ? false : true;
        });
    },
    async search_item({ state }, name) {
      const algoliaIndex = algoliaClient.initIndex("items");
      return algoliaIndex.search(name).then(({ hits }) => {
        return hits;
      });
      // return await firebase
      //   .firestore()
      //   .collection("items")
      //   .where("keywords", "array-contains", name)
      //   .get()
      //   .then((query) => {
      //     return query.docs;
      //   });
    },

    async populateAlgolia({ state }) {
      const db = firebase.firestore();

      const items = db.collection("items");
      const lists = db.collection("lists");
      const demands = db.collection("demands");

      let promises = [];
      let all = [
        { db: items, name: "items" },
        { db: lists, name: "lists" },
        { db: demands, name: "demands" },
      ];

      all.forEach((index) => {
        promises.push(
          index.db.get().then((query) => {
            let results = [];
            query.docs.forEach((doc) => {
              if (index.name == "items")
                results.push({
                  name: doc.data().name,
                  objectID: doc.id,
                });
              else
                results.push({
                  title: doc.data().title,
                  objectID: doc.id,
                });
            });

            const algoliaIndex = algoliaClient.initIndex(index.name);
            algoliaIndex.saveObjects(results);
          })
        );
      });

      Promise.all(promises)
        .then(() => {
          console.log("Done");
        })
        .catch((err) => console.log(err));
    },

    async fetch_category_lists({ state }, payload) {
      let query;
      let lists = firebase
        .firestore()
        .collection("lists")
        .where("category", "==", payload.category)
        .where("type", "<", "personal");
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
        .then((query) => {
          return query.docs;
        });
    },
    async fetch_subcategory_lists({ state }, payload) {
      let lists = firebase
        .firestore()
        .collection("lists")
        .where("category", "==", payload.category)
        .where("sub_category", "==", payload.subCategory);

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
        .then((query) => {
          return query.docs;
        });
    },
    async fetch_category_demands({ state }, payload) {
      let query;
      let demands = firebase
        .firestore()
        .collection("demands")
        .where("category", "==", payload.category);

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
        default:
          query = demands;
      }

      if (payload.lastDoc) {
        query = query.startAfter(payload.lastDoc);
      }

      return query
        .limit(payload.limit)
        .get()
        .then((query) => {
          return query;
        });
    },

    async fetch_subcategory_demands({ commit }, payload) {
      let query;
      let demands = firebase
        .firestore()
        .collection("demands")
        .where("category", "==", payload.category)
        .where("sub_category", "==", payload.subCategory);

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
        .then((query) => {
          return query;
        });
    },

    async update_all_users({ commit }) {
      let db = firebase.firestore();

      db.collection("users")
        .get()
        .then(async (query) => {});
    },
    async search_demands({ commit }, text) {
      const algoliaIndex = algoliaClient.initIndex("demands");
      return algoliaIndex
        .search(text, {
          hitsPerPage: 10,
        })
        .then(({ hits }) => {
          return hits;
        });
      // return await firebase
      //   .firestore()
      //   .collection("demand_keywords")
      //   .where("words", "array-contains", text)
      //   .limit(10)
      //   .get()
      //   .then((query) => {
      //     return query.docs;
      //   })
      //   .catch((_) => {});
    },
    async search_lists({ commit }, text) {
      const algoliaIndex = algoliaClient.initIndex("lists");
      return algoliaIndex
        .search(text, {
          hitsPerPage: 10,
        })
        .then(({ hits }) => {
          return hits;
        });
      // return await firebase
      //   .firestore()
      //   .collection("list_keywords")
      //   .where("words", "array-contains", text)
      //   .limit(10)
      //   .get()
      //   .then((query) => {
      //     return query.docs;
      //   })
      //   .catch((_) => {});
    },

    async search_lists_and_demands({ state }, text) {
      let query = [
        {
          indexName: "lists",
          query: text,
          hitsPerPage: 10,
        },
        {
          indexName: "demands",
          query: text,
          hitsPerPage: 10,
        },
      ];

      return algoliaClient.multipleQueries(query).then(({ results }) => {
        return {
          demands: results[1].hits,
          lists: results[0].hits,
        };
      });
    },
    async upload_categories({ commit }, categories) {
      let db = firebase.firestore();
      let catID, subID;

      categories.forEach(async (category) => {
        await db
          .collection("categories")
          .doc(category.name)
          .set({
            name: category.name,
            list_count: 0,
            created: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            category.subs.forEach(async (sub) => {
              subID = encrypt(sub);
              await db
                .collection("categories")
                .doc(category.name)
                .collection("subs")
                .doc(subID)
                .set({
                  name: sub,
                  list_count: 0,
                  created: firebase.firestore.FieldValue.serverTimestamp(),
                });
            });
            this.dispatch("set_snackbar", {
              show: true,
              message: "Category uploaded successfully",
              type: "success",
            });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    },
    async fetchCategories({ commit, state, dispatch }) {
      let categories;
      let db = firebase.firestore();

      await db
        .collection("categories")
        .get()
        .then(async (cat) => {
          categories = cat.docs.map((cat) => cat.data());
          for (let i = 0; i < categories.length; i++) {
            await db
              .collection("categories")
              .doc(categories[i].name)
              .collection("subs")
              .get()
              .then((subs) => {
                categories[i].subs = subs.docs.map((sub) => sub.data());
              });
          }
        })
        .then(() => {
          if (categories.length > 0) {
            commit("setCategories", categories);
          }
        });
    },
    async fetch_home_category_lists({ state, dispatch, commit }, payload) {
      let lists = [];
      let categories = payload ? payload : state.categories;
      let promises = [];

      for (let category of categories) {
        promises.push(
          dispatch("fetch_category_lists", {
            category: category.name,
            limit: 1,
          })
            .then(async (docs) => {
              if (docs.length > 0) {
                let list = {
                  id: docs[0].id,
                  ...docs[0].data(),
                };
                lists.push(list);
              }
            })
            .catch((_) => {
              //no action needed
            })
        );
      }

      return Promise.all(promises).then(() => {
        if (lists[0]) commit("setCategoryLists", lists);
        return lists;
      });
    },
    async update_happening({ commit, state }, payload) {
      let db = firebase.firestore();
      db.collection("happening")
        .doc("data")
        .collection("collection")
        .add({
          created: firebase.firestore.FieldValue.serverTimestamp(),
          ...payload,
        });
      db.collection("happening")
        .doc("data")
        .update({
          count: firebase.firestore.FieldValue.increment(1),
        });
    },
    async update_activities({ commit, state }, payload) {
      if (
        firebase.auth().currentUser &&
        firebase.auth().currentUser.isAnonymous
      ) {
        return;
      }
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
          ...payload,
        }
      );

      batch.commit().catch((error) => {
        //no action needed
      });
    },
    async initialize({ commit }) {
      // let auth = firebase.auth();
      // if (auth.currentUser.uid) {
      //   if (!auth.currentUser.isAnonymous) {
      //     firebase
      //       .firestore()
      //       .collection("user_details")
      //       .doc(auth.currentUser.uid)
      //       .get()
      //       .then(user => {
      //         commit("login", { ...user.data(), id: auth.currentUser.uid });
      //       });
      //   } else {
      //     firebase
      //       .firestore()
      //       .collection("user_details")
      //       .doc(auth.currentUser.uid)
      //       .get()
      //       .then(user => {
      //         commit("anonymousLogin", {
      //           ...user.data(),
      //           id: auth.currentUser.uid
      //         });
      //       });
      //   }
      // firebase
      //   .firestore()
      //   .enablePersistence()
      //   .then(() => {

      //   })
      //   .catch(function(err) {
      //     if (err.code == "failed-precondition") {
      //       //
      //     } else if (err.code == "unimplemented") {
      //       //
      //     }
      //   });

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
        .then((query) => {
          return query.docs;
        })
        .catch((error) => {
          throw error;
        });
    },
    // async set_votes({state}){
    //   let lists = firebase.firestore().collection("lists");

    //   lists.get().then(async listquery => {
    //     for(let a=0;a<listquery.docs.length;a++){
    //       await lists.doc(listquery.docs[a].id).collection("items").get().then(query => {
    //         query.docs.forEach(async item => {
    //           if(!item.data().net_vote){
    //             await lists.doc(listquery.docs[a].id).collection("items").doc(item.id).update({
    //               net_vote: item.data().upvotes
    //             })
    //           }
    //         })
    //       })
    //     }
    //   })
    // }
  },
});

export default store;
