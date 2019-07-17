import vuex from "vuex";
import Vue from "vue";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

Vue.use(vuex);

let store = new vuex.Store({
  state: {
    user: {
      name: "",
      image: null,
      suggestions: []
    },

    authenticated: null
  },

  mutations: {
    setUser(state, payload) {
      state.user.name = payload.name;
      state.user.image = payload.image;
      state.user.suggestions = payload.suggestions;
    },

    setAuthentication(state, payload) {
      state.authenticated = payload;
    }
  },

  actions: {
    emailSignup({ commit }, credentials) {
      let db = firebase.auth();

      return db
        .createUserWithEmailAndPassword(credentials.email, credentials.password)
        .then(async result => {
          await firebase.auth().currentUser.updateProfile({
            displayName: credentials.displayName
          });
          commit("setUser", result.user);
          commit("setAuthentication", true);
          console.log("User: ", result.user);
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
          console.log("here");
          console.log("User: ", result.user);
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
    }
  }
});

export default store;
