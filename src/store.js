import vuex from "vuex";
import Vue from "vue";
import firebase, { firestore } from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import { setPriority, userInfo } from "os";
import { async } from "q";
import myDate from "../public/my-modules/myDate";
import swalErrors from "../public/my-modules/swalErrors";
import generateID from "../public/my-modules/generate-id";
import { stat } from "fs";
import { METHODS } from "http";
import createPersistedState from "vuex-persistedstate";

let moment = require("moment");

Vue.use(vuex);

let no_profile =
  "https://firebasestorage.googleapis.com/v0/b/top-ten-534ca.appspot.com/o/profile_pictures%2Fno_profile.jpg?alt=media&token=a2fe3931-d790-4b30-838e-ef9bb877978b";

let store = new vuex.Store({
  state: {
    user: {},

    otherUsers: [],

    lists: [],

    authenticated: false,

    categories: [],

    popular: [],

    trending: [],

    latest: [],

    onDemand: [],

    loading: true,

    showSearch: true
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
      state.lists = [];
      state.lists.push(payload);
      console.log("Pushed to list");
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
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setSearch(state, payload) {
      state.showSearch = payload;
    }
  },

  getters: {
    getAuthenticated: state => {
      return state.authenticated;
    },
    getUser: state => state.user,
    getLoading: state => state.loading,
    showSearch: state => state.showSearch,
    getDemands: state => state.onDemand
  },

  actions: {
    clear_state({ commit }) {
      commit("clearState");
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
    /********************************************************************************************************************/
    //ALL ABOUT SIGNUP

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

      //authenticate with email and password
      return auth
        .createUserWithEmailAndPassword(credentials.email, credentials.password)
        .then(async result => {
          db.collection("users")
            .doc(result.user.uid)
            .set({
              username: username,
              profile_pic: no_profile,
              created: firebase.firestore.FieldValue.serverTimestamp(),
              favorites_count: 0,
              followers: 0,
              following: 0,
              creations: {
                personal: 0,
                general: 0
              }
            })
            .then(() => {
              db.collection("users")
                .doc(result.user.uid)
                .get()
                .then(user => {
                  commit("setUser", {
                    id: user.id,
                    ...user.data()
                  });
                });
              commit("setAuthenticated", true);
            });
        })
        .then(() => {
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

    emailLogin({ commit }, credentials) {
      let auth = firebase.auth();

      return firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          return auth
            .signInWithEmailAndPassword(credentials.email, credentials.password)
            .then(result => {
              firebase
                .firestore()
                .collection("users")
                .doc(result.user.uid)
                .get()
                .then(user => {
                  commit("setUser", {
                    id: user.id,
                    ...user.data()
                  });
                });
              commit("setAuthenticated", true);
            })
            .catch(error => {
              throw error;
            });
        })
        .catch(error => {
          throw error;
        });
    },

    socialLogin({ commit, state }, authType) {
      let provider;
      let auth = firebase.auth();
      let db = firebase.firestore().collection("users");
      let user;
      let methods;
      if (authType === "G") {
        provider = new firebase.auth.GoogleAuthProvider();
      } else {
        provider = new firebase.auth.FacebookAuthProvider();
      }

      return firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          return auth
            .signInWithPopup(provider)
            .then(async result => {
              let displayName;
              methods = await auth.fetchSignInMethodsForEmail(
                result.user.email
              );

              if (methods.length > 0) {
                await db
                  .doc(result.user.uid)
                  .get()
                  .then(user => {
                    displayName = user.data().username;
                  });
              } else if (result.user.email === "") {
                displayName = "user" + Math.floor(Math.random() * 1000);
              } else {
                displayName = result.user.email
                  .slice(0, result.user.email.indexOf("@"))
                  .toLowerCase();
              }

              user = { username: displayName, id: result.user.uid };

              let user_pic;
              if (result.user.photoURL !== "") {
                user_pic = result.user.photoURL;
              } else {
                user_pic = no_profile;
              }

              await db.doc(result.user.uid).set({
                username: displayName,
                profile_pic: user_pic,
                created: firebase.firestore.FieldValue.serverTimestamp(),
                favorites_count: 0,
                followers: 0,
                following: 0,
                creations: {
                  personal: 0,
                  general: 0
                }
              });

              commit("setUser", {
                profile_pic: user_pic,
                ...user
              });
              commit("setAuthenticated", true);
              console.log(state.user);
              return displayName;
            })
            .catch(error => {
              if (
                error.code === "auth/account-exists-with-different-credential"
              ) {
                // Step 2.
                // User's email already exists.
                // The pending Facebook credential.
                let pendingCred = error.credential;
                // The provider account's email address.
                let email = error.email;
                // Get sign-in methods for this email.
                auth.fetchSignInMethodsForEmail(email).then(methods => {
                  // Step 3.
                  // If the user has several sign-in methods,
                  // the first method in the list will be the "recommended" method to use.
                  if (methods[0] === "password" && methods.length <= 1) {
                    // Asks the user their password.
                    // @ts-ignore
                    swal(
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
                        console.log(value);
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
                  // All the other cases are external providers.
                  // Construct provider object for that provider.
                  // TODO: implement getProviderForProviderId.
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
                          // Remember that the user may have signed in with an account that has a different email
                          // address than the first one. This can happen as Firebase doesn't control the provider's
                          // sign in flow and the user is free to login using whichever account he owns.
                          // Step 4b.
                          // Link to Facebook credential.
                          // As we have access to the pending credential, we can directly call the link method.
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
                  // At this point, you should let the user know that he already has an account
                  // but with a different provider, and let him validate the fact he wants to
                  // sign in with this provider.
                  // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
                  // so in real scenario you should ask the user to click on a "continue" button
                  // that will trigger the signInWithPopup.
                });
              }
            });
        });
    },

    logout({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("signed out");
          commit("setUser", {});
          commit("setAuthenticated", false);
        });
    },

    /******************************************************************************************************************/

    //ALL ABOUT USER

    async fetch_user({ commit }, userID) {
      return firebase
        .firestore()
        .collection("users")
        .doc(userID)
        .get()
        .then(documentSnapshot => {
          commit("setOtherUsers", {
            id: documentSnapshot.id,
            ...documentSnapshot.data()
          });
          return {
            id: documentSnapshot.id,
            ...documentSnapshot.data()
          };
        });
    },

    async set_profile({ state }, payload) {
      let users = firebase.firestore().collection("users");

      if (payload.date !== undefined) {
        payload.date = new firebase.firestore.Timestamp.fromDate(
          new Date(payload.date)
        );
      }

      return users
        .doc(state.user.id)
        .collection("profile")
        .doc("data")
        .update(payload);
    },

    async follow_user({ state, dispatch }, user) {
      let followed = firebase
        .firestore()
        .collection("users")
        .doc(user.id);

      let follower = firebase
        .firestore()
        .collection("users")
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
        .collection("users")
        .doc(id);

      let unfollower = firebase
        .firestore()
        .collection("users")
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
            following: firebase.firestore.FieldValue.increment(1)
          });
        });
    },

    async check_following({ state }, id) {
      return firebase
        .firestore()
        .collection("users")
        .doc(id)
        .collection("followers")
        .where("user", "==", state.user.id)
        .get();
    },

    /******************************************************************************************************************/

    // ALL ABOUT LIST

    async upload_list({ state, dispatch }, list) {
      let db = firebase.firestore().collection("lists");
      let user = firebase
        .firestore()
        .collection("users")
        .doc(state.user.id);
      let length = list.items.length;
      let votes = (length * (length + 1)) / 2;

      //add list to database
      return db
        .add({
          //add properties to list
          title: list.title,
          about: list.about,
          vote_count: votes,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          rating: 0,
          user: state.user.id,
          raters_count: 0,
          votable: list.votable,
          personal: list.personal,
          tags: list.tags
        })
        .then(async docRef => {
          //loops through all items received. Uploads each item as a new document in lists/list id/items collection
          for (let i = 0; i < list.items.length; i++) {
            await dispatch("add_list_item", {
              list_id: docRef.id,
              votes: list.items.length - i,
              item: list.items[i],
              first_addition: true
            });
          }
          return docRef.id;
        })
        .then(async list_id => {
          if (list.personal) {
            await user.update({
              creations: {
                personal: firebase.firestore.FieldValue.increment(1)
              }
            });
          } else {
            await user.update({
              creations: {
                general: firebase.firestore.FieldValue.increment(1)
              }
            });
          }
          await db
            .doc(list_id)
            .collection("voters")
            .doc(state.user.id)
            .set({
              user: state.user.id
            });
          return list_id;
        })
        .catch(error => {
          throw error;
        });
    },

    async add_list_item({ state }, payload) {
      let db = firebase.firestore();

      let list = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id);

      let ID;

      if (payload.item.info === undefined) {
        await db
          .collection("items")
          .add({
            name: payload.item.name,
            media_count: 0
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

      payload.item.comment === "" ? (comment_count = 0) : (comment_count = 1);

      await list
        .collection("items")
        .add({
          info: ID,
          name: payload.item.name,
          vote_count: payload.votes,
          list_id: payload.list_id,
          comment_count: comment_count,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          user: state.user.id
        })
        .then(async docref => {
          if (payload.item.comment !== "") {
            await this.dispatch("upload_comment", {
              list_id: payload.list_id,
              item_id: docref.id,
              comment: payload.item.comment,
              first_addition: true
            });
          }
          if (payload.first_addition === undefined) {
            list.update({
              vote_count: firebase.firestore.FieldValue.increment(payload.votes)
            });
          }

          return docref.id;
        })
        .then(id => {
          list
            .collection("items")
            .doc(id)
            .collection("voters")
            .add({
              id: state.user.id
            });
        })
        .catch(error => {
          throw error;
        });
    },

    async fetch_complete_list({ commit, state }, payload) {
      let index = -1;
      state.lists = [];
      index = state.lists.findIndex(list => {
        return list.id === payload;
      });

      if (index >= 0) {
        return state.lists[index];
      } else {
        let db = firebase
          .firestore()
          .collection("lists")
          .doc(payload);
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
              .orderBy("vote_count", "desc")
              .get()
              .then(async querySnapshot => {
                list.items = await querySnapshot.docs.map(doc => {
                  return {
                    id: doc.id,
                    ...doc.data()
                  };
                });
              })
              .then(() => {
                console.log("Fetched!");
              });
          })
          .then(() => {
            commit("setLists", list);
            return list;
          });
      }
    },

    async fetch_popular({ commit }, limit) {
      if (this.state.popular.length >= 0) {
        return this.state.popular;
      } else {
        let lists = firebase.firestore().collection("lists");
        let date = new firebase.firestore.Timestamp.fromDate(
          new Date(
            moment()
              .subtract(30, "days")
              .calendar()
          )
        );

        return lists
          .orderBy("votes", "desc")
          .limit(limit)
          .get()
          .then(querySnapshot => {
            let result = querySnapshot.docs.map(doc => {
              return {
                id: doc.id,
                ...doc.data()
              };
            });
            commit("setPopular", result);
            return result;
          });
      }
    },

    async fetch_latest({ commit }, payload) {
      if (this.state.latest.length > 3) {
        return this.state.latest;
      } else {
        let lists = firebase.firestore().collection("lists");

        if (payload.timestamp === "now") {
          payload.timestamp = new firebase.firestore.Timestamp.fromDate(
            new Date()
          );
        }

        return lists
          .where("created", "<", payload.timestamp)
          .limit(payload.limit)
          .orderBy("created", "desc")
          .get()
          .then(querySnapshot => {
            let result = querySnapshot.docs.map(doc => {
              return {
                id: doc.id,
                ...doc.data()
              };
            });
            commit("setLatest", result);
            return result;
          });
      }
    },

    add_favorite({ state }, payload) {
      let user = firebase
        .firestore()
        .collection("users")
        .doc(state.user.id);

      user
        .collection("favorites")
        .add({
          title: payload.list_title,
          id: payload.list_id,
          preview_image: payload.preview_image,
          created: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
          user.update({
            favorites_count: firebase.firestore.FieldValue.increment(1)
          });
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
          return await querySnapshot.docs.map(doc => {
            console.log(doc.data());
            return doc.data();
          });
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
          return await querySnapshot.docs.map(doc => {
            console.log(doc.data());
            return doc.data();
          });
        })
        .catch(error => {
          console.log("error: ", error);
        });
    },

    async update_item({ state }, payload) {
      let itemLoc = firebase
        .firestore()
        .collection("items")
        .doc(payload.item.info);

      if (payload.update.image) {
        let image;
        let ext = payload.update.image.name.slice(
          payload.update.image.name.lastIndexOf(".")
        );

        image = await firebase
          .storage()
          .ref(
            "items/" +
              payload.item.id +
              "/" +
              payload.item.media_count +
              "." +
              ext
          );

        await itemLoc
          .collection("media")
          .add({
            src: image.getDownloadURL(),
            votes: 1,
            created: firebase.firestore.FieldValue.serverTimestamp(),
            user: state.user.id
          })
          .then(() => {
            payload.update = {
              media_count: firebase.firestore.FieldValue.increment(1),
              ...payload.update
            };
            itemLoc.update(payload.update);
          });
      } else {
        await itemLoc.update(payload.update);
      }
      itemLoc
        .collection("contributors")
        .doc(state.user.id)
        .set({
          id: state.user.id,
          username: state.user.username
        });
    },

    async upload_item_image({ state }, update) {
      let itemLoc = firebase
        .firestore()
        .collection("items")
        .doc(update.item.id);
      let image;
      let ext = update.image.name.slice(update.image.name.lastIndexOf("."));

      image = await firebase
        .storage()
        .ref("items/" + update.item.id + "/" + 1 + "." + ext)
        .put(update.image);
      console.log(image);

      return image.ref.getDownloadURL().then(async url => {
        return await itemLoc
          .collection("media")
          .add({
            src: url,
            votes: 1,
            created: firebase.firestore.FieldValue.serverTimestamp(),
            user: state.user.id
          })
          .then(() => {
            itemLoc.update({
              media_count: firebase.firestore.FieldValue.increment(1)
            });
          });
      });
    },

    async fetch_item({ commit }, payload) {
      let item = firebase
        .firestore()
        .collection("items")
        .doc(payload);
      let result;
      return item
        .get()
        .then(docref => {
          result = { id: docref.id, ...docref.data() };
        })
        .then(async () => {
          await item
            .collection("media")
            .get()
            .then(query => {
              result = {
                image: query.docs[0].data(),
                ...result
              };
            });
        })
        .then(() => {
          return result;
        });
    },

    /**************************************************************************************************************/
    //    ALL ABOUT COMMENTS

    async upload_comment({ commit, state }, payload) {
      let db = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id);

      let index;

      return db
        .get()
        .then(async docRef => {
          index = docRef.data().comment_count + 1;
          db.collection("comments").add({
            content: payload.comment,
            user: state.user.id,
            created: firebase.firestore.FieldValue.serverTimestamp(),
            index: index,
            likes: 0
          });
        })
        .then(() => {
          if (payload.first_addition === undefined) {
            db.update({
              comment_count: firebase.firestore.FieldValue.increment(1)
            });
          }
        })
        .then(() => {
          console.log("Comment Uploaded");
          return {
            content: payload.comment,
            user: {
              id: state.user.id,
              username: state.user.username,
              profile_pic: state.user.profile_pic
            },
            index: index,
            likes: 0
          };
        })
        .catch(error => {
          console.log(error);
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
          return await querySnapshot.docs.map(doc => {
            return {
              id: doc.id,
              ...doc.data()
            };
          });
        })
        .catch(error => {
          console.log(error);
        });
    },

    async likeComment({ commit, state }, payload) {
      let db = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .doc(payload.comment_id);

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

    async unlikeComment({ commit, state }, payload) {
      let db = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .doc(payload.comment_id);

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

    async upload_reply({ commit, state }, payload) {
      let comment = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .doc(payload.comment_id);

      return await comment
        .collection("replies")
        .add({
          content: payload.reply,
          user: state.user.id,
          created: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
          comment.update({
            replies_count: firebase.firestore.FieldValue.increment(1)
          });
        })
        .then(() => {
          comment
            .collection("repliers")
            .doc(state.user.id)
            .set({
              user: state.user.id
            });
        })
        .then(() => {
          return {};
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
          return querySnapshot.docs.map(doc => {
            return {
              id: doc.id,
              ...doc.data()
            };
          });
        });
    },

    async likeReply({ commit, state }, payload) {
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

    /********************************************************************************************************************/
    //     ALL ABOUT VOTES

    async add_vote({ commit, state }, payload) {
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
          votes: firebase.firestore.FieldValue.increment(1)
        })
        .then(() => {
          item
            .collection("voters")
            .doc(state.user.id)
            .set({
              user: state.user.id
            });
        })
        .then(async () => {
          await list
            .update({
              votes: firebase.firestore.FieldValue.increment(1)
            })
            .then(() => {
              list
                .collection("voters")
                .doc(state.user.id)
                .set({
                  user: state.user.id
                });
            });
        })
        .then(() => {});
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

    async check_voted({ state }, id) {
      return firebase
        .firestore()
        .collection("lists")
        .doc(id)
        .collection("voters")
        .where("user", "==", state.user.id)
        .get()
        .then(query => {
          return query.docs.length === 0 ? false : true;
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

    async fetch_categories({ state, commit }) {
      if (state.categories.length > 0) {
        return state.categories.sort((a, b) => (a.name > b.name ? 1 : -1));
      } else {
        let categories = firebase.firestore().collection("categories");

        return categories.get().then(querySnapshot => {
          let result = querySnapshot.docs.map(doc => {
            return {
              id: doc.id,
              name: doc.data().name
            };
          });
          commit("setCategories", result);
          return result.sort((a, b) => (a.name > b.name ? 1 : -1));
        });
      }
    },

    async send_notification({ state, dispatch }, payload) {
      let message;
      let recipients;
      let sendData;
      let users = firebase.firestore().collection("users");
      let db = firebase.firestore();

      switch (payload.type) {
        case "reply":
          if (state.user.id !== payload.user.id) {
            let user_message =
              state.user.username +
              " replied to your comment on " +
              payload.item.name +
              ' on "' +
              payload.list.title +
              '"';

            await users
              .doc(payload.user.id)
              .collection("updates")
              .doc("data")
              .collection("notifications")
              .add({
                list_id: payload.list.id,
                item_id: payload.item.id,
                comment_id: payload.comment.id,
                message: user_message,
                created: firebase.firestore.FieldValue.serverTimestamp(),
                type: "reply"
              });
          }
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
              return query.docs.map(doc => {
                return doc.data().user;
              });
            });
          console.log(recipients);
          if (payload.user.id !== state.user.id) {
            message =
              state.user.username +
              " also replied to " +
              payload.user.username +
              "'s comment on " +
              payload.item.name +
              ' on "' +
              payload.list.title +
              '"';
          } else {
            message =
              state.user.username +
              " also replied to their comment on " +
              payload.item.name +
              ' on "' +
              payload.list.title +
              '"';
          }

          sendData = {
            list_id: payload.list.id,
            item_id: payload.item.id,
            comment_id: payload.comment.id,
            message: message,
            type: payload.type
          };
          break;

        case "demand-created":
          message =
            'Your demanded list "' +
            payload.title +
            '" has been created by ' +
            state.user.username;
          recipients = await dispatch("fetch_demanders", payload.demand_id);

          sendData = {
            list_id: payload.list_id,
            message: message,
            type: payload.type
          };
          break;

        case "follow":
          message = state.user.username + " started following you.";
          recipients = [payload.user.id];
          sendData = {
            user: state.user.id,
            message: message,
            type: payload.type
          };
          break;
      }
      setTimeout(() => {
        for (let recipient of recipients) {
          if (state.user.id !== recipient) {
            users
              .doc(recipient)
              .collection("updates")
              .doc("data")
              .collection("notifications")
              .add({
                created: firebase.firestore.FieldValue.serverTimestamp(),
                ...sendData
              });
          }
        }
      }, 3000);
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

      return await user
        .collection("updates")
        .doc("data")
        .get()
        .then(async docRef => {
          let checkTime;
          if (docRef.data() !== undefined) {
            checkTime = docRef.data().lastNotif;
          } else {
            console.log("here");
            checkTime = new firebase.firestore.Timestamp.fromDate(
              new Date(2019, 1, 1)
            );
            console.log(checkTime);
          }
          return checkTime;
        })
        .then(checkTime => {
          return notifications
            .where("created", ">", checkTime)
            .orderBy("created", "desc")
            .get()
            .then(query => {
              return query.docs.map(doc => {
                return {
                  id: doc.id,
                  ...doc.data()
                };
              });
            });
        })
        .catch(error => {
          console.log(error);
        });
    },

    async update_notification_last_seen({ state }) {
      firebase
        .firestore()
        .collection("users")
        .doc(state.user.id)
        .collection("updates")
        .doc("data")
        .update({
          notification_last_seen: firebase.firestore.FieldValue.serverTimestamp()
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
                let images = query.docs.map(doc => {
                  return {
                    id: doc.id,
                    ...doc.data()
                  };
                });
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
      // state.onDemand.push({
      //   title: payload.title,
      //   comment: payload.comment,
      //   waiters_count: 1,
      //   creator: state.user.username
      // });

      let db = firebase.firestore().collection("demands");
      let demand;

      if (payload.comment !== "") {
        demand = await db.add({
          title: payload.title,
          comment: payload.comment,
          waiters_count: 1,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          creator: state.user.id
        });
      } else {
        demand = await db.add({
          title: payload.title,
          waiters_count: 1,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          creator: state.user.id
        });
      }

      db.doc(demand.id)
        .collection("waiters")
        .doc(state.user.id)
        .set({
          user: state.user.id
        });
    },

    async fetch_demanded({ state }, payload) {
      // return state.onDemand;

      let db = firebase.firestore().collection("demands");

      return db
        .where("waiters_count", "<", payload.max)
        .limit(payload.limit)
        .get()
        .then(query => {
          return query.docs.map(doc => {
            return {
              id: doc.id,
              ...doc.data()
            };
          });
        });
    },
    async fetch_demanders({ state }, id) {
      return firebase
        .firestore()
        .collection("demands")
        .doc(id)
        .collection("waiters")
        .get()
        .then(query => {
          return query.docs.map(doc => {
            return doc.id;
          });
        });
    },
    async join_demanders({ state }, id) {
      await firebase
        .firestore()
        .collection("demands")
        .doc(id)
        .collection("waiters")
        .doc(state.user.id)
        .set({
          user: state.user.id
        });

      return;
    },
    async delete_demand({ state }, id) {
      firebase
        .firestore()
        .collection("demands")
        .doc(id)
        .delete();
    }
  },

  plugins: [createPersistedState()]
});

export default store;
