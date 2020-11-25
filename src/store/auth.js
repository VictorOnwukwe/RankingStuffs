import firebase from "firebase/app";

const auth = {
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

  async emailSignup({ commit }, credentials) {
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
                          .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
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
};

export default auth;