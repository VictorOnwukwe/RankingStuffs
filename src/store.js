import vuex from "vuex";
import Vue from "vue";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import { setPriority } from "os";
import { async } from "q";
import myDate from "../public/my-modules/myDate";

Vue.use(vuex);

let store = new vuex.Store({
  state: {
    user: {
      name: "",
      image: null
    },

    lists: [],

    authenticated: true
  },

  mutations: {
    setUser(state, payload) {
      state.user.name = payload.name;
      state.user.image = payload.image;
      state.user.suggestions = payload.suggestions;
    },

    setAuthentication(state, payload) {
      state.authenticated = payload;
    },

    setLists(state, payload) {
      state.lists.push(payload);
      console.log("Pushed to list");
    }
  },

  actions: {
    emailSignup({ commit }, credentials) {
      let db = firebase.auth();

      return db
        .createUserWithEmailAndPassword(credentials.email, credentials.password)
        .then(async result => {
          await firebase.auth().currentUser.updateProfile({
            displayName: result.user.email.slice(
              0,
              result.user.email.indexOf("@")
            )
          });

          commit("setUser", result.user);
          commit("setAuthentication", true);
        })
        .catch(error => {
          console.log("error:", error);
          commit("setAuthentication", false);
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
          console.log("error:", error);
          commit("setAuthentication", false);
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

          console.log("here");
          console.log("User: ", result.user);

          //   commit("setUser", result.user);
          //   commit("setAuthentication", true);
        })
        .catch(error => {
          console.log("Error: ", error);
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
                votes: 0
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
                console.log("Done!");
              })
              .catch(error => {
                console.log("Error uploading files: ", error);
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

    async fetch_complete_list({ commit }, payload) {
      let db = firebase.firestore();
      let list = {};

      return db.collection("lists")
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
