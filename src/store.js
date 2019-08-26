import vuex from "vuex";
import Vue from "vue";
import firebase, { firestore } from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import { setPriority } from "os";
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

    onDemand: []
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
    }
  },

  getters: {
    getAuthenticated: state => {
      return state.authenticated;
    },
    getUser: state => state.user
  },

  actions: {
    clear_state({ commit }) {
      commit("clearState");
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
              created_count: 0
            })
            .then(() => {
              auth.currentUser.updateProfile({
                displayName: username,
                photoURL: no_profile
              });
            });

          commit("setUser", {
            username: username,
            profile_pic: no_profile,
            id: result.user.uid
          });
          commit("setAuthenticated", true);
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
              commit("setUser", {
                id: result.user.uid,
                profile_pic: no_profile,
                username: result.user.displayName
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
                created_count: 0
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

    fetch_user({ commit }, userID) {
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

    /******************************************************************************************************************/

    // ALL ABOUT LIST

    async upload_list({ state, dispatch }, list) {
      let db;
      let creationData = firebase
        .firestore()
        .collection("users")
        .doc(state.user.id)
        .collection("creations")
        .doc("data");

      let votable;
      let personal;

      switch (list.listType) {
        case "general":
          votable = true;
          personal = false;
          break;
        case "personal":
          votable = false;
          personal = true;
          break;
        case "personal-votable":
          votable = true;
          personal = true;
          break;
      }
      let items_no = list.items.length;

      if (personal) {
        db = firebase
          .firestore()
          .collection("users")
          .doc(state.user.id)
          .collection("creations")
          .doc("data")
          .collection("personal");
      } else {
        db = firebase.firestore().collection("lists");
      }

      //add list to database
      return db
        .add({
          //add properties to list
          personal: personal,
          title: list.title,
          about: list.about,
          vote_count: (items_no * (items_no + 1)) / 2,
          comment_count: 0,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          rating: 0,
          user: state.user.id,
          rate_count: 0,
          votable: votable
        })
        .then(async docRef => {
          //loops through all items received. Uploads each item as a new document in lists/list id/items collection
          for (let i = 0; i < list.items.length; i++) {
            await dispatch("add_list_item", {
              list_id: docRef.id,
              votes: list.items.length - i,
              personal: personal,
              item: list.items[i]
            });
          }
          return docRef.id;
        })
        .then(list_id => {
          if (!personal) {
            creationData.collection("general").add({
              id: list_id,
              title: list.title
            });
          }
        })
        .then(() => {
          if (personal) {
            creationData.update({
              personal_count: firebase.firestore.FieldValue.increment(1)
            });
          } else {
            creationData.update({
              general_count: firebase.firestore.FieldValue.increment(1)
            });
          }
        })
        .catch(error => {
          throw error;
        });
    },

    async add_list_item({ state, commit }, payload) {
      let comment_count;
      let db = firebase.firestore();

      let list;

      if (payload.personal) {
        list = firebase
          .firestore()
          .collection("users")
          .doc(state.user.id)
          .collection("creations")
          .doc("data")
          .collection("personal")
          .doc(payload.list_id);
      } else {
        list = firebase
          .firestore()
          .collection("lists")
          .doc(payload.list_id);
      }

      if (!payload.item.exists) {
        await db
          .collection("items")
          .add({
            name: payload.item.name
          })
          .then(docref => {
            payload.item.name = docref.id;
          });
      }

      if (payload.item.comment === "") {
        comment_count = 0;
      } else {
        comment_count = 1;
      }

      await list
        .collection("items")
        .add({
          info: payload.item.name,
          vote_count: payload.votes,
          list_id: payload.list_id,
          comment_count: comment_count,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          user: state.user.id
        })
        .then(async docref => {
          if (comment_count === 1) {
            await this.dispatch("upload_comment", {
              personal: payload.personal,
              list_id: payload.list_id,
              item_id: docref.id,
              comment: payload.item.comment
            });
          }
          list.update({
            vote_count: firebase.firestore.FieldValue.increment(payload.votes)
          });
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

            console.log("Added List");
        })
        .catch(error => {
          throw error;
        });
    },

    async fetch_complete_list({ commit }, payload) {
      let db = firebase.firestore();
      let list = {};

      return db
        .collection("lists")
        .doc(payload)
        .get()
        .then(doc => {
          list = {
            id: doc.id,
            ...doc.data()
          };
        })
        .then(async () => {
          await db
            .collection("lists")
            .doc(payload)
            .collection("items")
            .orderBy("votes", "desc")
            .get()
            .then(querySnapshot => {
              list.items = querySnapshot.docs.map(doc => {
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

    async fetch_user_lists() {
      console.log("here");
      return await firebase
        .firestore()
        .collection("users")
        .doc(this.state.user.id)
        .collection("created")
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

    /**************************************************************************************************************/
    //    ALL ABOUT COMMENTS

    async upload_comment({ commit, state }, payload) {
      let db;

      let index;

      if (payload.personal) {
        db = firebase
          .firestore()
          .collection("users")
          .doc(state.user.id)
          .collection("creations")
          .doc("data")
          .collection("personal")
          .doc(payload.list_id)
          .collection("items")
          .doc(payload.item_id);
      } else {
        db = firebase
          .firestore()
          .collection("lists")
          .doc(payload.list_id)
          .collection("items")
          .doc(payload.item_id);
      }

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
          db.update(
            "comments_count",
            firebase.firestore.FieldValue.increment(1)
          );
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
          likes: firebase.firestore.FieldValue.increment(1),
          likers: firebase.firestore.FieldValue.arrayUnion(state.user.id)
        })
        .then(() => {});
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
          likes: firebase.firestore.FieldValue.increment(-1),
          likers: firebase.firestore.FieldValue.arrayRemove(state.user.id)
        })
        .then(() => {});
    },

    async upload_reply({ commit, state }, payload) {
      let item = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id);

      let comment = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .doc(payload.comment_id);

      let index;

      return comment
        .get()
        .then(result => {
          if (result.data().replies_count) {
            index = result.data().replies_count + 1;
          } else {
            index = 1;
          }
        })
        .then(() => {
          comment
            .collection("replies")
            .add({
              content: payload.reply,
              user: state.user.id,
              created: firebase.firestore.FieldValue.serverTimestamp(),
              index: index
            })
            .then(() => {
              comment.update({
                replies_count: firebase.firestore.FieldValue.increment(1)
              });
            });
        })
        .then(() => {
          console.log("Reply uploaded");
          return {
            content: payload.reply,
            user: {
              id: state.user.id,
              username: state.user.username,
              profile_pic: state.user.profile_pic
            },
            index: index,
            likes: 0
          };
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
          likes: firebase.firestore.FieldValue.increment(1),
          likers: firebase.firestore.FieldValue.arrayUnion(state.user.id)
        })
        .then(() => {});
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
          likes: firebase.firestore.FieldValue.increment(-1),
          likers: firebase.firestore.FieldValue.arrayRemove(state.user.id)
        })
        .then(() => {});
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
          votes: firebase.firestore.FieldValue.increment(1),
          voters: firebase.firestore.FieldValue.arrayUnion(state.user.id)
        })
        .then(() => {
          list.update({
            votes: firebase.firestore.FieldValue.increment(1),
            voters: firebase.firestore.FieldValue.arrayUnion(state.user.id)
          });
        })
        .then(() => {
          user.update({
            votedItems: firebase.firestore.FieldValue.arrayUnion({
              list_id: payload.list_id,
              item_id: payload.item_id
            })
          });
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

      item
        .update({
          votes: firebase.firestore.FieldValue.increment(-1),
          voters: firebase.firestore.FieldValue.arrayRemove(state.user.id)
        })
        .then(() => {
          list.update({
            votes: firebase.firestore.FieldValue.increment(-1),
            voters: firebase.firestore.FieldValue.arrayRemove(state.user.id)
          });
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
    }
  },

  plugins: [createPersistedState()]
});

export default store;
