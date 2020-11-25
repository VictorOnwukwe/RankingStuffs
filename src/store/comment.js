import firebase from "firebase/app";

let comments = {
  async upload_comment({ state }, payload) {
    if (!this.getters.semiAuthenticated) {
      await this.dispatch("anonymous_login");
    }
    let user;
    payload.user
      ? (user = payload.user)
      : (user = { id: state.user.id, username: state.user.username });
    let list = firebase
      .firestore()
      .collection("lists")
      .doc(payload.list.id);
    let item = list.collection("items").doc(payload.item.id);
    let comment = item.collection("comments").doc();

    const batch = firebase.firestore().batch();

    batch.set(comment, {
      content: payload.comment,
      user: user,
      created: firebase.firestore.FieldValue.serverTimestamp(),
    });
    batch.update(item, {
      comment_count: firebase.firestore.FieldValue.increment(1),
    });
    batch.update(list, {
      comment_count: firebase.firestore.FieldValue.increment(1),
    });

    return await batch
      .commit()
      .then(() => {
        let image = {};
        payload.item.image ? (image = { image: payload.item.image }) : null;

        this.dispatch("update_activities", {
          type: "comment",
          comment: payload.comment,
          item: {
            name: payload.item.name,
            id: payload.item.id,
            ...image,
          },
          list: {
            title: payload.list.title,
            id: payload.list.id,
          },
          recipient: user.id,
        });
        this.dispatch("update_popularity", payload.list.id);
        return {
          id: comment.id,
          data() {
            return {
              content: payload.comment,
              user: user,
              created: firebase.firestore.Timestamp.fromDate(new Date()),
            };
          },
        };
      })
      .catch((error) => {
        throw error;
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
        edited: true,
      });
  },

  async delete_comment({ state }, payload) {
    let item = firebase
      .firestore()
      .collection("lists")
      .doc(payload.list_id)
      .collection("items")
      .doc(payload.item_id);

    await item
      .collection("comments")
      .doc(payload.comment_id)
      .delete()
      .then(() => {
        item.update({
          comment_count: firebase.firestore.FieldValue.increment(-1),
        });
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
        edited: true,
      });
  },

  async delete_reply({ state }, payload) {
    const comment = firebase
      .firestore()
      .collection("lists")
      .doc(payload.list_id)
      .collection("items")
      .doc(payload.item_id)
      .collection("comments")
      .doc(payload.comment_id);

    await comment
      .collection("replies")
      .doc(payload.reply_id)
      .delete()
      .then(() => {
        comment.update({
          replies_count: firebase.firestore.FieldValue.increment(-1),
        });
      });
  },

  async fetch_comments({ commit }, payload) {
    let db = firebase.firestore();
    let query;

    if (payload.lastDoc) {
      query = db
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .orderBy("created", "desc")
        .startAfter(payload.lastDoc)
        .limit(payload.limit);
    } else {
      query = db
        .collection("lists")
        .doc(payload.list_id)
        .collection("items")
        .doc(payload.item_id)
        .collection("comments")
        .orderBy("created", "desc")
        .limit(payload.limit);
    }

    return await query
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs;
      })
      .catch((error) => {
        this.dispatch("set_snackbar", {
          show: true,
          message: "Error fetching comments",
          type: "error",
        });
        throw error;
      });
  },

  async likeComment({ commit, state }, payload) {
    if (!this.getters.semiAuthenticated) {
      await this.dispatch("anonymous_login");
    }
    let batch = firebase.firestore().batch();
    let comment = firebase
      .firestore()
      .collection("lists")
      .doc(payload.list_id)
      .collection("items")
      .doc(payload.item_id)
      .collection("comments")
      .doc(payload.comment_id);

    batch.set(comment.collection("likers").doc(state.user.id), {
      user: state.user.id,
    });
    batch.update(comment, {
      likes: firebase.firestore.FieldValue.increment(1),
    });
    batch.commit().catch((error) => {
      this.dispatch("set_snackbar", {
        show: true,
        message: "sorry. An error occured",
        type: "error",
      });
    });
  },

  async unlikeComment({ commit, state }, payload) {
    let batch = firebase.firestore().batch();
    let comment = firebase
      .firestore()
      .collection("lists")
      .doc(payload.list_id)
      .collection("items")
      .doc(payload.item_id)
      .collection("comments")
      .doc(payload.comment_id);

    batch.delete(comment.collection("likers").doc(state.user.id));
    batch.update(comment, {
      likes: firebase.firestore.FieldValue.increment(-1),
    });
    batch.commit().catch((error) => {
      this.dispatch("set_snackbar", {
        show: true,
        message: "sorry. An error occured",
        type: "error",
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
          .then((doc) => {
            return doc.exists;
          })
          .catch((_) => {
            //no action needed
          });
  },

  async upload_reply({ commit, state }, payload) {
    if (!this.getters.semiAuthenticated) {
      await this.dispatch("anonymous_login");
    }
    let batch = firebase.firestore().batch();
    let comment = firebase
      .firestore()
      .collection("lists")
      .doc(payload.list_id)
      .collection("items")
      .doc(payload.item_id)
      .collection("comments")
      .doc(payload.comment_id);
    let reply = comment.collection("replies").doc();

    batch.set(reply, {
      content: payload.reply,
      user: { id: state.user.id, username: state.user.username },
      created: firebase.firestore.FieldValue.serverTimestamp(),
    });
    batch.update(comment, {
      replies_count: firebase.firestore.FieldValue.increment(1),
    });

    return batch
      .commit()
      .then(() => {
        this.dispatch("update_activities", {
          type: "reply",
          comment: {
            id: payload.comment_id,
            content: payload.comment_content,
          },
          reply: {
            id: reply.id,
            content: payload.reply,
          },
          item: {
            id: payload.item_id,
            name: payload.item_name,
          },
          list: {
            id: payload.list_id,
            title: payload.list_title,
          },
          ...payload.commenter,
        });
      })
      .then(() => {
        return {
          id: reply.id,
          data: () => {
            return {
              content: payload.reply,
              user: { id: state.user.id, username: state.user.username },
              created: firebase.firestore.Timestamp.fromDate(new Date()),
            };
          },
        };
      })
      .catch((error) => {
        this.dispatch("set_snackbar", {
          show: true,
          message: "sorry. Could not upload reply. Try again",
          type: "error",
        });
        throw error;
      });
  },

  async fetch_replies({ commit }, payload) {
    let db = firebase
      .firestore()
      .collection("lists")
      .doc(payload.list_id)
      .collection("items")
      .doc(payload.item_id)
      .collection("comments")
      .doc(payload.comment_id)
      .collection("replies")
      .orderBy("created", "desc");
    let query;

    if (payload.lastDoc) {
      query = db.startAfter(payload.lastDoc).limit(payload.limit);
    } else {
      query = db.limit(payload.limit);
    }

    return await query
      .get()
      .then((querySnapshot) => {
        return querySnapshot.docs;
      })
      .catch((error) => {
        this.dispatch("set_snackbar", {
          show: true,
          message: "Error fetching replies",
          type: "error",
        });
        throw error;
      });
  },

  async likeReply({ commit, state }, payload) {
    if (!this.getters.semiAuthenticated) {
      await this.dispatch("anonymous_login");
    }
    let batch = firebase.firestore().batch();
    let reply = firebase
      .firestore()
      .collection("lists")
      .doc(payload.list_id)
      .collection("items")
      .doc(payload.item_id)
      .collection("comments")
      .doc(payload.comment_id)
      .collection("replies")
      .doc(payload.reply_id);

    batch.set(reply.collection("likers").doc(state.user.id), {
      user: state.user.id,
    });
    batch.update(reply, {
      likes: firebase.firestore.FieldValue.increment(1),
    });
    batch.commit().catch((_) => {
      //no action needed
    });
  },

  async unlikeReply({ state }, payload) {
    let batch = firebase.firestore().batch();
    let reply = firebase
      .firestore()
      .collection("lists")
      .doc(payload.list_id)
      .collection("items")
      .doc(payload.item_id)
      .collection("comments")
      .doc(payload.comment_id)
      .collection("replies")
      .doc(payload.reply_id);

    batch.delete(reply.collection("likers").doc(state.user.id));
    batch.update(reply, {
      likes: firebase.firestore.FieldValue.increment(-1),
    });
    batch.commit().catch((_) => {
      //no action needed
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
          .then((doc) => {
            return doc.exists;
          })
          .catch((_) => {
            //no action needed
          });
  },
};

export default comments;
