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
import { stat } from "fs";
import { METHODS } from "http";

Vue.use(vuex);

let no_profile =
  "https://firebasestorage.googleapis.com/v0/b/top-ten-534ca.appspot.com/o/profile_pictures%2Fno_profile.jpg?alt=media&token=a2fe3931-d790-4b30-838e-ef9bb877978b";

let store = new vuex.Store({
  state: {
    user: {},

    list: {},

    authenticated: false,
    voted: false
  },

  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },

    setAuthentication(state, payload) {
      state.authenticated = payload;
    },

    setLists(state, payload) {
      state.list = payload;
      console.log("Pushed to list");
    },

    setVoted(state, payload) {
      state.voted = payload;
    }
  },

  actions: {
    async emailSignup({ commit }, payload) {
      let auth = firebase.auth();
      let db = firebase.firestore();

      let user;
      let username = "";

      //get username
      if (payload.credentials.username != null) {
        //username when user inputs username
        username = payload.credentials.username;
      } else {
        //username generated from user email
        username = payload.credentials.email.slice(
          0,
          payload.credentials.email.indexOf("@")
        );

        //If username exists, add a random number between 1 and 3 and check again
        while (payload.all_usernames.includes(username)) {
          username = username + Math.floor(Math.random() * 3);
        }
      }

      //authenticate with email and password
      return auth
        .createUserWithEmailAndPassword(
          payload.credentials.email,
          payload.credentials.password
        )
        .then(result => {
          db.collection("users")
            .doc(result.user.uid)
            .set({
              username: username,
              profile_pic: no_profile,
              created: firebase.firestore.FieldValue.serverTimestamp()
            });

          commit("setUser", {
            username: username,
            profile_pic: no_profile,
            id: result.user.uid
          });
          commit("setAuthentication", true);
        })
        .then(() => {
          db.collection("usernames")
            .doc("array")
            .update({
              names: firebase.firestore.FieldValue.arrayUnion(username)
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
      let db = firebase.firestore();

      return auth
        .signInWithEmailAndPassword(credentials.email, credentials.password)
        .then(result => {
          db.collection("users")
            .doc(result.user.uid)
            .get()
            .then(user => {
              commit("setUser", {
                id: result.user.uid,
                ...user.data()
              });
              commit("setAuthentication", true);
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

      return auth
        .signInWithPopup(provider)
        .then(async result => {
          let displayName;
          methods = await auth.fetchSignInMethodsForEmail(result.user.email);

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
            created: firebase.firestore.FieldValue.serverTimestamp()
          });

          commit("setUser", user);
          commit("setAuthentication", true);
          console.log(state.user);
          return displayName;
        })
        .then(displayName => {
          if (methods.length === 0) {
            firebase
              .firestore()
              .collection("usernames")
              .doc("array")
              .update({
                names: firebase.firestore.FieldValue.arrayUnion(displayName)
              });
          }
        })
        .catch(error => {
          if (error.code === "auth/account-exists-with-different-credential") {
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
                      commit("setAuthentication", true);
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
    },

    async upload_list({ commit, dispatch }, payload) {
      let db = firebase.firestore();

      let items_no = payload.items.length;
      let list_key = "";
      let item_key = "";

      //add list to database
      return db
        .collection("lists")
        .add({
          //add title to list
          title: payload.title,
          votes: (items_no * (items_no + 1)) / 2,
          created: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(async docRef => {
          //loops through all items received. Uploads each item as a new document in lists/list id/items collection
          for (let i = 0; i < payload.items.length; i++) {
            dispatch("add_list_item", {
              list_id: docRef.id,
              item: {
                title: payload.items[i].title,
                about: payload.items[i].about,
                votes: payload.items.length - i,
                image: payload.items[i].image
              }
            });
          }
        })
        .catch(error => {
          throw error;
        });
    },

    async add_list_item({ commit }, payload) {
      let item_key = "";
      let db = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id);

      await db
        .collection("items")
        .add({
          about: payload.item.about,
          title: payload.item.title,
          votes: payload.item.votes,
          list_id: payload.list_id,
          comments_count: 0,
          created: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(docRef2 => {
          item_key = docRef2.id;
          return item_key;
        })
        .then(key => {
          const fileName = payload.item.image.name;
          const ext = fileName.slice(fileName.lastIndexOf("."));
          return firebase
            .storage()
            .ref("item_images/" + key + ext)
            .put(payload.item.image);
        })
        .then(fileData => {
          return fileData.ref.getDownloadURL();
        })
        .then(theUrl => {
          db.collection("items")
            .doc(item_key)
            .update({
              image: theUrl
            });
        })
        .catch(error => {
          throw error;
        });
    },

    async add_comment({ commit, state }, payload) {
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
          index = docRef.data().comments_count + 1;
          db.collection("comments").add({
            content: payload.comment,
            user: {
              id: state.user.id,
              username: state.user.username,
              profile_pic: state.user.profile_pic
            },
            created: firebase.firestore.FieldValue.serverTimestamp(),
            index: index,
            likes: 0,
            replies_count: 0,
            replies: []
          });
        })
        .then(() => {
          db.update(
            "comments_count",
            firebase.firestore.FieldValue.increment(1)
          );
        })
        .then(() => {
          console.log("Uploaded");
          return {
            content: payload.comment,
            user: {
              id: state.user.id,
              username: state.user.username,
              profile_pic: state.user.profile_pic
            },
            index: index,
            likes: 0,
            replies_count: 0,
            replies: []
          };
        })
        .catch(error => {
          console.log(error);
        });
    },

    async add_vote({ commit }, payload) {
      let db = firebase.firestore();
      let item = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id);

      item
        .update("votes", firebase.firestore.FieldValue.increment(1))
        .then(() => {
          commit("setVoted", true);
        })
        .then(() => {
          db.collection("lists")
            .doc(payload.list_id)
            .collection("voters")
            .add({
              username: this.state.user.username
            });
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

    async dislikeComment({ commit, state }, payload) {
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
        .then(() => {
          db.collection("lists")
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
              commit("setLists", list);
              console.log("Fetched!");
            });
        });
    },

    fetch_all_usernames({ commit }) {
      let db = firebase.firestore();

      return db
        .collection("usernames")
        .doc("array")
        .get()
        .then(result => {
          return result.data().names;
        });
    }
  }
});

export default store;
