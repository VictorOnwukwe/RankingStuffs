import firebase from "firebase/app";

let user = {
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
};

export default user;
