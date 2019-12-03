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

let moment = require("moment");

Vue.use(vuex);

let store = new vuex.Store({
  state: {
    user: {},

    otherUsers: [],
    lists: [],
    authenticated: false,
    anonymous: false,
    categories: [],
    popular: [],
    trending: [],
    latest: [],
    onDemand: [],
    loading: false,
    showSearch: false,
    followers: [],
    following: [],
    notifications: 0,
    nophoto: "../assets/nophoto.jpg",
    login: false,
    signup: false,
    currentList: {}
  },

  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },

    setOtherUsers(state, payload) {
      state.otherUsers.push(payload);
    },

    setAuthenticated(state, payload) {
      state.authenticated = payload;
    },

    setLists(state, payload) {
      state.lists.push(payload);
    },

    auth_success(state, payload) {
      state.user = payload;
      state.authenticated = true;
    },

    setCategories(state, payload) {
      state.categories = payload;
    },

    setPopular(state, payload) {
      state.popular = payload;
    },
    setLatest(state, payload) {
      state.latest = payload;
    },
    setTrending(state, payload) {
      state.trending = payload;
    },
    setOnDemand(state, payload) {
      state.onDemand = payload;
    },
    clearState(state) {
      state.popular = [];
      state.latest = [];
      // store.replaceState({});
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
    setAnonymous(state, payload) {
      state.anonymous = payload;
    },
    setLogin(state, payload) {
      state.login = payload;
    },
    setSignup(state, payload) {
      state.signup = payload;
    },
    setCurrentList(state, payload) {
      state.currentList = payload;
    }
  },

  getters: {
    authenticated: state => state.authenticated,
    getUser: state => state.user,
    getLoading: state => state.loading,
    showSearch: state => state.showSearch,
    getDemands: state => state.onDemand,
    nophoto: state => state.nophoto,
    semiAuthenticated: state => state.anonymous || state.authenticated,
    notifications: state => state.notifications,
    login: state => state.login,
    signup: state => state.signup,
    categories: state => state.categories
  },

  actions: {
    clear_state({ commit }) {
      commit("clearState");
    },
    set_current_list({ commit }, list) {
      commit("setCurrentList", list);
    },
    set_search({ state, commit }, payload) {
      let send;
      if (payload === "toggle") send = !state.showSearch;
      else send = payload;

      commit("setSearch", send);
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
          let colors = ["blue", "green", "red", "orange", "purple"];
          let visitorColor = colors[Math.round(Math.random() * 5)];

          firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .set({
              username: randomName,
              created: firebase.firestore.FieldValue.serverTimestamp(),
              color: visitorColor
            });

          commit("setUser", {
            username: randomName,
            id: user.uid,
            color: visitorColor
          });
          commit("setAnonymous", true);
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
            commit("setAuthenticated", true);
            commit("setUser", {
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
                  commit("setUser", {
                    id: user.id,
                    ...user.data()
                  });
                  commit("setAuthenticated", true);
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

      this.dispatch("logout");

      return firebase
        .auth()
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
                  commit("setUser", {
                    id: user.id,
                    ...user.data()
                  });
                  commit("setAuthenticated", true);
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
            let displayName;
            if (user.data()) {
              let update = {};
              if (!user.data().profile_pic) {
                if (result.user.email === "") {
                  displayName = "user" + Math.floor(Math.random() * 1000);
                } else {
                  displayName = result.user.email
                    .slice(0, result.user.email.indexOf("@"))
                    .toLowerCase();
                }
                update = {
                  username: displayName,
                  created: firebase.firestore.FieldValue.serverTimestamp()
                };
              } else {
                displayName = user.data().username;
              }
              if (result.user.photoURL) {
                update = {
                  profile_pic: {
                    low: result.user.photoURL,
                    high: result.user.photoURL
                  },
                  ...update
                };
              }
              await db.doc(user.id).update(update);
              commit("setUser", {
                id: user.id,
                username: displayName,
                profile_pic: {
                  high: user.data().profile_pic,
                  low: user.data().profile_pic
                },
                created: user.data().created
              });
              commit("setAuthenticated", true);
              return;
            } else {
              if (result.user.email === "") {
                displayName = "user" + Math.floor(Math.random() * 1000);
              } else {
                displayName = result.user.email
                  .slice(0, result.user.email.indexOf("@"))
                  .toLowerCase();
              }

              let newUser = { username: displayName, id: result.user.uid };

              let update;
              result.user.photoURL
                ? (update = {
                    profile_pic: {
                      low: result.user.photoURL,
                      high: result.user.photoURL
                    }
                  })
                : (update = {});
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

              firebase
                .firestore()
                .collection("user_details")
                .doc(result.user.uid)
                .collection("counters")
                .doc("data")
                .set({
                  created: firebase.firestore.FieldValue.serverTimestamp()
                });

              commit("setUser", {
                ...update,
                ...newUser
              });
              commit("setAuthenticated", true);
              commit("setAnonymous", false);
              return displayName;
            }
          });
      };

      if (this.getters.semiAuthenticated) {
        console.log("Anonymous");
        return auth.currentUser.linkWithPopup(provider).then(userCred => {
          console.log(userCred);
          signIn(userCred);
        });
      }

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
                auth.fetchSignInMethodsForEmail(email).then(methods => {
                  if (methods[0] === "password" && methods.length <= 1) {
                    // @ts-ignore
                    Swal.fire(
                      "You previously logged in with email and password. Please enter your password",
                      {
                        content: {
                          element: "input",
                          attributes: {
                            placeholder: "Enter your password here...",
                            type: "password"
                          }
                        }
                      }
                    ) // TODO: implement promptUserForPassword.
                      .then(value => {
                        auth
                          .signInWithEmailAndPassword(email, value)
                          .then(() => {
                            // Step 4a.
                            auth.currentUser.linkWithCredential(pendingCred);
                          })
                          .catch(error => {
                            throw error;
                          });
                      });
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

                  // @ts-ignore
                  Swal.fire({
                    text: popupMessage,
                    type: "question",
                    showConfirmButton: true,
                    confirmButtonText: "YES",
                    showCancelButton: true,
                    cancelButtonText: "NO"
                  }).then(value => {
                    if (value) {
                      auth
                        .signInWithPopup(new_provider)
                        .then(result => {
                          result.user.linkWithCredential(pendingCred);
                        })
                        .then(() => {
                          commit("setUser", user);
                          commit("setAuthenticated", true);
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
          commit("setUser", {});
          commit("setAuthenticated", false);
          commit("setAnonymous", false);
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

      await user.update({
        profile_pic: {
          low: lowUrl,
          high: highUrl,
          created: firebase.firestore.FieldValue.serverTimestamp()
        }
      });
      commit("setUser", {
        username: state.user.username,
        email: state.user.email,
        profile_pic: {
          low: lowUrl,
          high: highUrl,
          created: firebase.firestore.FieldValue.serverTimestamp()
        },
        id: state.user.id
      });
      await firebase
        .firestore()
        .collection("user_details")
        .doc(state.user.id)
        .update({
          profile_pic: {
            low: lowUrl,
            high: highUrl
          }
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

      return users.doc(state.user.id).update(payload);
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

      followed
        .collection("followers")
        .doc(state.user.id)
        .set({
          user: state.user.id
        })
        .then(() => {
          followed.update({
            followers: firebase.firestore.FieldValue.increment(1)
          });
        })
        .then(() => {
          follower
            .collection("following")
            .doc(user.id)
            .set({
              user: user.id
            });
        })
        .then(() => {
          follower.update({
            following: firebase.firestore.FieldValue.increment(1)
          });
        })
        .then(() => {
          dispatch("send_notification", {
            type: "follow",
            user: user
          });
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

      unfollowed
        .collection("followers")
        .doc(state.user.id)
        .delete()
        .then(() => {
          unfollowed.update({
            followers: firebase.firestore.FieldValue.increment(-1)
          });
        })
        .then(() => {
          unfollower
            .collection("following")
            .doc(id)
            .set({
              user: id
            });
        })
        .then(() => {
          unfollower.update({
            following: firebase.firestore.FieldValue.increment(-1)
          });
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
        });
    },

    /******************************************************************************************************************/

    // ALL ABOUT LIST

    async upload_list({ state, dispatch }, list) {
      if (!this.getters.semiAuthenticated) {
        await this.dispatch("anonymous_login");
      }
      let db = firebase.firestore().collection("lists");
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

      //add list to database
      return db
        .add({
          //add properties to list
          title: list.title.toLowerCase(),
          votes: votes,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          user: state.user.id,
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
          ...others
        })
        .then(async docRef => {
          //loops through all items received. Uploads each item as a new document in lists/list id/items collection
          for (let i = 0; i < list.items.length; i++) {
            await dispatch("add_list_item", {
              list_id: docRef.id,
              votes: list.items.length - i,
              item: list.items[i],
              first_addition: true
            }).then(details => {
              features.push(details.info);
            });
          }
          return docRef.id;
        })
        .then(id => {
          firebase
            .firestore()
            .collection("list_features")
            .doc(id)
            .set({
              items: features
            });
          firebase
            .firestore()
            .collection("list_keywords")
            .doc(id)
            .set({
              words: list.keywords,
              title: list.title.toLowerCase()
            });
          firebase
            .firestore()
            .collection("user_details")
            .doc(state.user.id)
            .update({
              lists: firebase.firestore.FieldValue.increment(1)
            });
          firebase
            .firestore()
            .collection("categories")
            .doc(list.category)
            .update({
              list_count: firebase.firestore.FieldValue.increment(1)
            })
            .then(() => {
              if (list.subCategory !== "") {
                firebase
                  .firestore()
                  .collection("categories")
                  .doc(list.category)
                  .collection("subs")
                  .doc(list.subCategory)
                  .update({
                    list_count: firebase.firestore.FieldValue.increment(1)
                  });
              }
            });
          let image = {};
          list.preview_image
            ? (image = { image: list.preview_image.low })
            : null;
          this.dispatch("update_activities", {
            type: "list",
            list: {
              title: list.title,
              id: id,
              ...image
            }
          });
          if (!list.personal) {
            this.dispatch("update_happening", {
              type: "list",
              list: {
                title: list.title,
                id: id,
                ...image
              }
            });
          }
          return id;
        })
        .catch(error => {
          throw error;
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
            let rating_score, exp;
            exp = (doc.data().raters_count + 1) / 144;
            rating_score = newRating + 5 * (1 - Math.pow(2.718, exp));

            transaction.update(list, {
              rating: newRating,
              raters_count: firebase.firestore.FieldValue.increment(1),
              rating_score: rating_score
            });
          });
        })
        .then(() => {
          db.collection("lists")
            .doc(payload.list.id)
            .collection("raters")
            .doc(state.user.id)
            .set({
              user: state.user.id,
              rating: payload.rating,
              created: firebase.firestore.FieldValue.serverTimestamp()
            });
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
          this.dispatch("update_happening", {
            type: "rate",
            rating: payload.rating,
            raters_count: payload.list.raters_count,
            list: {
              title: payload.list.title,
              id: payload.list.id,
              ...image
            }
          });
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

      let list = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id);

      let ID;

      if (!payload.item.info) {
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
              .doc(state.user.id)
              .set({
                id: state.user.id,
                username: state.user.username
              });
            ID = docref.id;
          });
      } else {
        ID = payload.item.info;
      }
      let comment_count;

      payload.item.comment ? (comment_count = 1) : (comment_count = 0);

      return await list
        .collection("items")
        .add({
          info: ID,
          name: payload.item.name,
          votes: payload.votes,
          list_id: payload.list_id,
          comment_count: comment_count,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          user: state.user.id
        })
        .then(async docref => {
          if (payload.item.comment) {
            await this.dispatch("upload_comment", {
              list_id: payload.list_id,
              item_id: docref.id,
              comment: payload.item.comment,
              first_addition: true
            });
          }
          if (!payload.first_addition) {
            let data = {};
            if (payload.item.comment) {
              data = { item_count: firebase.firestore.FieldValue.increment(1) };
            }
            list.update({
              vote_count: firebase.firestore.FieldValue.increment(
                payload.votes
              ),
              item_count: firebase.firestore.FieldValue.increment(1),
              ...data
            });
            firebase
              .firestore()
              .collection("list_features")
              .doc(payload.list_id)
              .update({
                featured_items: firebase.firestore.FieldValue.arrayUnion(ID)
              });
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
                id: payload.list_id,
                title: payload.list_title
              }
            });
            this.dispatch("update_happening", {
              type: "item",
              item: {
                info: ID,
                name: payload.item.name,
                ...image
              },
              list: {
                id: payload.list_id,
                title: payload.list_title
              }
            });
          }
          return { id: docref.id, info: ID };
        })
        .then(id => {
          if (!payload.first_addition) {
            list
              .collection("voters")
              .doc(state.user.id)
              .set({
                user: state.user.id,
                item: payload.item.id
              });
          }
          return id;
        })
        .catch(error => {
          throw error;
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
      let index = -1;
      // state.lists = [];
      index = state.lists.findIndex(list => {
        return list.id === id;
      });
      index = -1;

      if (index > -1) {
        return state.lists[index];
      } else {
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
              .orderBy("votes", "desc")
              .orderBy("created")
              .limit(50)
              .get()
              .then(async querySnapshot => {
                list.items = [].concat(querySnapshot.docs);
              });
          })
          .then(() => {
            // commit("setLists", list);
            return list;
          });
      }
    },

    async fetch_list({ state }, id) {
      return await firebase
        .firestore()
        .collection("lists")
        .doc(id)
        .get()
        .then(doc => {
          return { id: id, ...doc.data() };
        });
    },

    async fetch_list_items({ commit }, payload) {
      let list = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id);

      return list
        .collection("items")
        .orderBy("votes", "desc")
        .orderBy("created")
        .startAfter(payload.last.votes, payload.last.created)
        .limit(50)
        .get()
        .then(query => {
          return query.docs;
        });
    },

    async fetch_popular({ commit }, payload) {
      let lists = firebase.firestore().collection("lists");
      // let date = new firebase.firestore.Timestamp.fromDate(
      //   new Date(
      //     moment()
      //       .subtract(30, "days")
      //       .calendar()
      //   )
      // );
      let query;

      if (!payload.lastDoc) {
        if (payload.home) {
          query = lists
            .where("preview_image", ">", null)
            .orderBy("popularity")
            .limit(payload.limit);
        } else {
          query = lists.orderBy("popularity", "desc").limit(payload.limit);
        }
      } else {
        if (payload.home) {
          query = lists
            .where("preview_image", ">", null)
            .orderBy("popularity")
            .startAfter(payload.lastDoc)
            .limit(payload.limit);
        } else {
          query = lists
            .orderBy("popularity", "desc")
            .startAfter(payload.lastDoc)
            .limit(payload.limit);
        }
      }

      return query.get().then(query => {
        return query.docs;
      });
    },

    async fetch_latest({ commit }, payload) {
      if (this.state.latest.length > 3) {
        return this.state.latest;
      } else {
        let lists = firebase.firestore().collection("lists");
        let query;

        if (payload.timestamp === "now") {
          payload.timestamp = new firebase.firestore.Timestamp.fromDate(
            new Date()
          );
        }

        if (payload.home) {
          query = lists
            .where("created", "<", payload.timestamp)
            .where("preview_image", ">", null)
            .limit(payload.limit)
            .orderBy("created", "desc");
        } else {
          query = lists
            .where("created", "<", payload.timestamp)
            .limit(payload.limit)
            .orderBy("created", "desc");
        }

        return query.get().then(querySnapshot => {
          let result = querySnapshot.docs;
          return result;
        });
      }
    },

    async fetch_top_rated({ commit }, payload) {
      let lists = firebase.firestore().collection("lists");
      let query;

      if (!payload.lastDoc) {
        if (payload.home) {
          query = lists
            .where("preview_image", ">", null)
            .orderBy("rating_score", "desc")
            .limit(payload.limit);
        } else {
          query = lists.orderBy("rating_score", "desc").limit(payload.limit);
        }
      } else {
        if (payload.home) {
          query = lists
            .where("preview_image", ">", null)
            .orderBy("rating_score", "desc")
            .startAfter(payload.lastDoc)
            .limit(payload.limit);
        } else {
          query = lists
            .orderBy("rating_score", "desc")
            .startAfter(payload.lastDoc)
            .limit(payload.limit);
        }
      }

      return query.get().then(query => {
        return query.docs;
      });
    },

    async favorite_item({ state }, payload) {
      let db = firebase.firestore();
      let batch = db.batch();
      let ID;

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

      batch.commit();
    },

    async unfavorite_item({ state }, payload) {
      let db = firebase.firestore();
      let loc = firebase
        .firestore()
        .collection("user_details")
        .doc(state.user.id)
        .collection("favorites")
        .doc("data");
      return loc
        .collection("items")
        .doc(payload)
        .delete()
        .then(() => {
          db.collection("user_details")
            .doc(state.user.id)
            .update({
              favorite_items: firebase.firestore.FieldValue.increment(-1)
            });

          return;
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

      // batch.set(list.collection("favoriters").doc(state.user.id), {
      //   user: state.user.id
      // });

      batch.commit();
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

      batch.commit();
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
      let itemLoc = firebase
        .firestore()
        .collection("items")
        .doc(payload.item.id);

      await itemLoc.update(payload.update);
      itemLoc
        .collection("contributors")
        .doc(state.user.id)
        .set({
          id: state.user.id,
          username: state.user.username
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
          // this.dispatch("update_happening", {
          //   type: "item-update",
          //   item: {
          //     info: update.item.id,
          //     name: update.item.name,
          //     image: low_url
          //   }
          // });
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

    async upload_comment({ commit, state }, payload) {
      if (!this.getters.semiAuthenticated) {
        await this.dispatch("anonymous_login");
      }
      let db = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list.id)
        .collection("items")
        .doc(payload.item.id);

      const batch = firebase.firestore().batch();

      let index;

      return db
        .collection("comments")
        .add({
          content: payload.comment,
          user: { id: state.user.id, username: state.user.username },
          created: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(docref => {
          if (!payload.first_addition) {
            db.update({
              comment_count: firebase.firestore.FieldValue.increment(1)
            });
            firebase
              .firestore()
              .collection("lists")
              .doc(payload.list.id)
              .update({
                comment_count: firebase.firestore.FieldValue.increment(1)
              });
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
              }
            });
            this.dispatch("update_happening", {
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
              }
            });
            this.dispatch("update_popularity", payload.list.id);
          }
          return docref.id;
        })
        .then(id => {
          return {
            data() {
              return {
                content: payload.comment,
                user: { id: state.user.id, username: state.user.username },
                created: firebase.firestore.Timestamp.fromDate(new Date())
              };
            },
            id: id
          };
        })
        .catch(error => {
          console.log(error);
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

    async fetch_comments({ commit }, payload) {
      let db = firebase.firestore();

      if (payload.timestamp === "now") {
        payload.timestamp = new firebase.firestore.Timestamp.fromDate(
          new Date()
        );
      }

      return await db
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .where("created", "<", payload.timestamp)
        .orderBy("created", "desc")
        .limit(payload.num)
        .get()
        .then(async querySnapshot => {
          return await querySnapshot.docs;
        })
        .catch(error => {
          console.log(error);
        });
    },

    async likeComment({ commit, state }, payload) {
      if (!this.getters.semiAuthenticated) {
        await this.dispatch("anonymous_login");
      }
      let db = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .doc(payload.comment_id);

      await db
        .collection("likers")
        .doc(state.user.id)
        .set({
          user: state.user.id
        })
        .then(async () => {
          await db
            .collection("likers")
            .doc(state.user.id)
            .set({
              user: state.user.id
            });
          db.update({
            likes: firebase.firestore.FieldValue.increment(1)
          });
        })
        .catch(error => {
          console.log(error);
        });
    },

    async unlikeComment({ commit, state }, payload) {
      let db = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .doc(payload.comment_id);

      return await db
        .collection("likers")
        .doc(state.user.id)
        .delete()
        .then(() => {
          db.update({
            likes: firebase.firestore.FieldValue.increment(-1)
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
            .then(doc => {
              return doc.exists;
            });
    },

    async upload_reply({ commit, state }, payload) {
      if (!this.getters.semiAuthenticated) {
        await this.dispatch("anonymous_login");
      }
      let comment = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .doc(payload.comment_id);
      let id;

      return await comment
        .collection("replies")
        .add({
          content: payload.reply,
          user: { id: state.user.id, username: state.user.username },
          created: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(doc => {
          comment.update({
            replies_count: firebase.firestore.FieldValue.increment(1)
          });
          id = doc.id;
        })
        .then(() => {
          this.dispatch("update_activities", {
            type: "reply",
            comment: {
              id: payload.comment_id,
              content: payload.comment_content
            },
            reply: {
              id: id,
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
            id: id,
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
          throw error;
        });
    },

    fetchReplies({ commit }, payload) {
      if (payload.timestamp === "now") {
        payload.timestamp = new firebase.firestore.Timestamp.fromDate(
          new Date()
        );
      }

      let replies = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .doc(payload.comment_id)
        .collection("replies");

      return replies
        .where("created", "<", payload.timestamp)
        .orderBy("created", "desc")
        .limit(payload.num)
        .get()
        .then(querySnapshot => {
          return querySnapshot.docs;
        });
    },

    async likeReply({ commit, state }, payload) {
      if (!this.getters.semiAuthenticated) {
        await this.dispatch("anonymous_login");
      }
      let db = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .doc(payload.comment_id)
        .collection("replies")
        .doc(payload.reply_id);

      await db
        .update({
          likes: firebase.firestore.FieldValue.increment(1)
        })
        .then(() => {
          db.collection("likers")
            .doc(state.user.id)
            .set({
              user: state.user.id
            });
        });
    },

    async unlikeReply({ state }, payload) {
      let db = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .doc(payload.comment_id)
        .collection("replies")
        .doc(payload.reply_id);

      await db
        .update({
          likes: firebase.firestore.FieldValue.increment(-1)
        })
        .then(() => {
          db.collection("likers")
            .doc(state.user.id)
            .delete();
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

    async add_vote({ commit, state }, payload) {
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

      batch.update(item, { votes: firebase.firestore.FieldValue.increment(1) });

      batch.update(list, { votes: firebase.firestore.FieldValue.increment(1) });

      batch.set(list.collection("voters").doc(state.user.id), {
        user: state.user.id,
        item: payload.item.id
      });

      batch.set(
        db.doc(`user_details/${state.user.id}/lists_voted/${payload.list.id}`),
        { list: payload.list.id }
      );

      batch.commit();
      let image = {};
      payload.item.image ? (image = { image: payload.item.image.low }) : null;
      this.dispatch("update_activities", {
        type: "vote",
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
      this.dispatch("update_happening", {
        type: "vote",
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
          return doc.exists;
        });
    },

    async remove_vote({ commit, state }, payload) {
      let list = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id);

      let item = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id);

      let user = firebase
        .firestore()
        .collection("users")
        .doc(state.user.id);

      item
        .update({
          votes: firebase.firestore.FieldValue.increment(-1)
        })
        .then(() => {
          item
            .collection("voters")
            .doc(state.user.id)
            .delete();
        })
        .then(async () => {
          await list
            .update({
              votes: firebase.firestore.FieldValue.increment(-1)
            })
            .then(() => {
              list
                .collection("voters")
                .doc(state.user.id)
                .delete();
            });
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
          return doc.exists ? doc.data() : false;
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
            user: {
              username: state.user.username,
              id: state.user.id
            },
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
      }
      for (let recipient of recipients) {
        if (state.user.id !== recipient) {
          await users
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
      }
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
        .catch(error => {});
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

    async demand_list({ state }, payload) {
      if (!this.getters.semiAuthenticated) {
        await this.dispatch("anonymous_login");
      }

      let db = firebase.firestore();

      await db
        .collection("demands")
        .add({
          waiters_count: 1,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          user: state.user.id,
          ...payload
        })
        .then(docref => {
          db.collection("demand_waiters")
            .doc(docref.id)
            .set({
              demanders: [state.user.id]
            });
          return docref.id;
        })
        .then(id => {
          db.collection("user_details")
            .doc(state.user.id)
            .update({
              demands: firebase.firestore.FieldValue.increment(1)
            });
          this.dispatch("update_activities", {
            type: "demand",
            demand: {
              title: payload.title,
              id: id
            }
          });
          this.dispatch("update_happening", {
            type: "demand",
            demand: {
              title: payload.title,
              id: id
            }
          });
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
      // return state.onDemand;

      let db = firebase.firestore().collection("demands");
      let sort = {};

      switch (payload.sort) {
        case "Most Demanded":
          sort = { order: "waiters_count", dir: "desc" };
          break;
        case "Least Demanded":
          sort = { order: "waiters_count", dir: "asc" };
          break;
        case "Newest":
          sort = { order: "created", dir: "desc" };
          break;
        case "Oldest":
          sort = { order: "created", dir: "asc" };
          break;
      }

      if (!payload.lastDoc) {
        return db
          .orderBy(sort.order, sort.dir)
          .limit(payload.limit)
          .get()
          .then(query => {
            return query.docs;
          });
      } else {
        return db
          .orderBy(sort.order, sort.dir)
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
      await firebase
        .firestore()
        .collection("demand_waiters")
        .doc(demand.id)
        .set(
          {
            demanders: firebase.firestore.FieldValue.arrayUnion(state.user.id),
            id: demand.id
          },
          { merge: true }
        )
        .then(() => {
          firebase
            .firestore()
            .collection("demands")
            .doc(demand.id)
            .update({
              waiters_count: firebase.firestore.FieldValue.increment(1)
            });
          this.dispatch("update_happening", {
            type: "join-demand",
            demand: {
              title: demand.title,
              id: demand.id
            }
          });
        });

      return;
    },
    async upload_demand_comment({ state }, payload) {
      let db = firebase.firestore();

      return db
        .collection("demands")
        .doc(payload.id)
        .collection("comments")
        .add({
          content: payload.comment,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          user: {
            id: state.user.id,
            username: state.user.username
          }
        })
        .then(async docref => {
          await db
            .collection("demands")
            .doc(payload.id)
            .update({
              comment_count: firebase.firestore.FieldValue.increment(1)
            });
          return {
            id: docref.id,
            created: firebase.firestore.FieldValue.serverTimestamp(),
            content: payload.content
          };
        })
        .catch(error => {
          console.log(error);
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
      let db = firebase.firestore().collection("demand_waiters");
      await db
        .doc(demand.id)
        .update({
          demanders: firebase.firestore.FieldValue.arrayRemove(state.user.id)
        })
        .then(() => {
          firebase
            .firestore()
            .collection("demands")
            .doc(demand.id)
            .update({
              waiters_count: firebase.firestore.FieldValue.increment(-1)
            });
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
      let db = firebase.firestore();

      return db
        .collection("lists")
        .where("category", "==", payload.category.toLowerCase())
        .limit(payload.limit)
        .get()
        .then(query => {
          return query.docs;
        });
    },
    async fetch_subcategory_lists({ state }, payload) {
      let db = firebase.firestore();

      return db
        .collection("lists")
        .where("category", "==", payload.category.toLowerCase())
        .where("sub_category", "==", payload.subCategory.toLowerCase())
        .limit(payload.limit)
        .get()
        .then(query => {
          return query.docs;
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
        .collection("demands")
        .where("keywords", "array-contains", text)
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
    async fetchCategories({ commit }) {
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
        });
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

      db.collection("user_details")
        .doc(state.user.id)
        .collection("activities")
        .add({
          created: firebase.firestore.FieldValue.serverTimestamp(),
          ...payload
        });
      db.collection("user_details")
        .doc(state.user.id)
        .set(
          {
            activity_count: firebase.firestore.FieldValue.increment(1)
          },
          { merge: true }
        );
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
    },
    async fetch_user_activities({ state }, payload) {
      let db = firebase.firestore();
      if (payload.timestamp == "now") {
        payload.timestamp = new firebase.firestore.Timestamp.now();
      }

      return db
        .collection("user_details")
        .doc(payload.user.id)
        .collection("activities")
        .where("created", "<", payload.timestamp)
        .orderBy("created", "desc")
        .limit(20)
        .get()
        .then(query => {
          return query.docs;
        });
    }
  },

  plugins: [createPersistedState()]
});

export default store;
