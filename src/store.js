import vuex from "vuex";
import Vue from "vue";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import { setPriority } from "os";
import { async } from "q";
import myDate from "../public/my-modules/myDate";
import { stat } from "fs";
import swal from "sweetalert";

Vue.use(vuex);

let store = new vuex.Store({
  state: {
    user: null,

    lists: null,

    authenticated: true,
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
      state.lists.push(payload);
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
              created: firebase.firestore.FieldValue.serverTimestamp()
            });
          payload.all_usernames.push(username);
          commit("setUser", { username: username });
          commit("setAuthentication", true);
        })
        .then(() => {
          db.collection("usernames")
            .doc("array")
            .update({
              names: payload.all_usernames
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
      let db = firebase.auth();

      return db
        .signInWithEmailAndPassword(credentials.email, credentials.password)
        .then(result => {
          commit("setUser", result.user);
          commit("setAuthentication", true);
        })
        .catch(error => {
          throw error;
        });
    },

    socialLogin({ commit }, authType) {
      let provider;
      let auth = firebase.auth();
      let db = firebase.firestore().collection("users");
      let user;
      if (authType === "G") {
        provider = new firebase.auth.GoogleAuthProvider();
      } else {
        provider = new firebase.auth.FacebookAuthProvider();
      }

      return auth
        .signInWithPopup(provider)
        .then(async result => {
          let displayName;

          if (result.user.email === "") {
            displayName = "user" + Math.floor(Math.random() * 1000);
          } else {
            displayName = result.user.email.slice(
              0,
              result.user.email.indexOf("@")
            );
          }

          user = { username: displayName };

          if (result.user.photoURL !== "") {
            user = { profile_pic: result.user.photoURL, ...user };
            await db.doc(result.user.uid).set({
              username: displayName,
              profile_pic: result.user.photoURL
            });
          } else {
            await db.doc(result.user.uid).set({
              username: displayName
            });
          }
          commit("setUser", user);
          commit("setAuthentication", true);
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
                    return;
                  });
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
              swal(popupMessage, {
                buttons: {
                  cancel: "NO",
                  confirm: "YES"
                }
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
                      result.user.linkAndRetrieveDataWithCredential(
                        pendingCred
                      );
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

    async upload_list({ commit }, payload) {
      let db = firebase.firestore();

      let list_key = "";
      let item_key = "";

      //add list to database
      return db
        .collection("lists")
        .add({
          //add title to list
          title: payload.title
        })
        .then(async docRef => {
          //assign list id to list_key variable. We'd use the id later to update list
          list_key = docRef.id;

          //loops through all items received. Uploads each item as a new document in lists/list id/items collection
          for (let i = 0; i < 10; i++) {
            await docRef
              .collection("items")
              .add({
                about: payload.items[i].about,
                title: payload.items[i].title,
                votes: 0,
                list_id: list_key,
                comment_count: 0
              })
              .then(docRef2 => {
                item_key = docRef2.id;
                return item_key;
              })
              .then(key => {
                const fileName = payload.items[i].image.name;
                const ext = fileName.slice(fileName.lastIndexOf("."));
                return firebase
                  .storage()
                  .ref("item_images/" + key + ext)
                  .put(payload.items[i].image);
              })
              .then(fileData => {
                return fileData.ref.getDownloadURL();
              })
              .then(theUrl => {
                db.collection("lists")
                  .doc(list_key)
                  .collection("items")
                  .doc(item_key)
                  .update({
                    image: theUrl
                  });
              })
              .catch(error => {
                throw error;
              });
          }
        })
        .then(() => {
          db.collection("lists")
            .doc(list_key)
            .update({
              created: firebase.firestore.FieldValue.serverTimestamp()
            });
        });
    },

    async add_comment({ commit, state }, payload) {
      let db = firebase
        .firestore()
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id);

      db.get()
        .then(docRef => {
          return docRef.data().comments_count + 1;
        })
        .then(comments_count => {
          db.collection("comments").add({
            content: payload.comment,
            user: {
              username: state.user.username,
              profile_pic: state.user.profile_pic
            },
            created: firebase.firestore.FieldValue.serverTimestamp(),
            index: comments_count
          });
          return comments_count;
        })
        .then(comments_count => {
          db.update({
            comments_count: comments_count
          });
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
        .get()
        .then(docRef => {
          return docRef.data().votes;
        })
        .then(votes => {
          item.update({
            votes: votes + 1
          });
        })
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

      db.collection("lists").doc(payload.list).get;
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
