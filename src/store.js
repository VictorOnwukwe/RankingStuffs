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
    async emailSignup({ commit }, credentials) {
      let auth = firebase.auth();
      let db = firebase.firestore();

      let all_usernames;
      await db
        .collection("usernames")
        .doc("array")
        .get()
        .then(doc => {
          all_usernames = doc.data().names;
        });

      let username = "";

      if (credentials.username != null) {
        username = credentials.username;
      } else {
        username = credentials.email.slice(0, credentials.email.indexOf("@"));
      }

      if (!all_usernames.includes(username)) {
        return auth
          .createUserWithEmailAndPassword(
            credentials.email,
            credentials.password
          )
          .then(result => {
            db.collection("users")
              .doc(result.user.uid)
              .set({
                username: username
              });
            all_usernames.push(username);
            commit("setUser", { username: username });
            commit("setAuthentication", true);
          })
          .then(() => {
            db.collection("usernames")
              .doc("array")
              .update({
                names: all_usernames
              });
          })
          .catch(error => {
            throw error;
          });
      } else {
        throw new Error("username exists");
      }
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
      if (authType === "G") {
        provider = new firebase.auth.GoogleAuthProvider();
      } else {
        provider = new firebase.auth.FacebookAuthProvider();
      }

      return firebase
        .auth()
        .signInWithPopup(provider)
        .then(async result => {
          await firebase.auth().currentUser.updateProfile({
            displayName: result.user.email.slice(
              0,
              result.user.email.indexOf("@")
            )
          });

          //   commit("setUser", result.user);
          //   commit("setAuthentication", true);
        })
        .catch(error => {
          //   commit("setAuthentication", false);
          throw error;
        });
    },

    async upload_list({ commit }, payload) {
      let db = firebase.firestore();

      let list_key = "";
      let item_key = "";

      return db
        .collection("lists")
        .add({
          title: payload.title
        })
        .then(async docRef => {
          list_key = docRef.id;
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
    }
  }
});

export default store;
