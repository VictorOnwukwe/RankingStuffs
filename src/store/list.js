import firebase from "firebase/app";

const list = {
  async upload_pending_list({ state }, list) {
    let pending = firebase.firestore().collection("pending_lists");

    return await pending
      .add(list)
      .then(() => {
        return true;
      })
      .catch((error) => {
        throw error;
      });
  },

  async fetch_pending_lists({ state }, payload) {
    let pending = firebase.firestore().collection("pending_lists");
    return pending
      .limit(payload.limit)
      .get()
      .then((query) => {
        return query.docs;
      })
      .catch((error) => {
        throw error;
      });
  },

  async delete_pending_list({ state }, id) {
    firebase
      .firestore()
      .collection("pending_lists")
      .doc(id)
      .delete()
      .catch((error) => {
        throw error;
      });
  },

  async upload_list({ state, dispatch }, list) {
    let db = firebase.firestore();
    let dbList = firebase.firestore().collection("lists");
    let batch = firebase.firestore().batch();
    let length = list.items.length;
    let votes = (length * (length + 1)) / 2;

    let popularity = votes / 3;

    let others = {};
    let features = [];

    list.description !== ""
      ? (others = { description: list.description })
      : null;
    list.selfModerated ? (others = { self_moderated: true }) : null;
    // list.tags !== [] ? (others = { tags: list.tags, ...others }) : null;
    if (list.category === "") {
      list.category = "Miscellaneous";
    } else {
      if (list.subCategory === "") {
        null;
      } else {
        others = {
          sub_category: list.subCategory,
          ...others,
        };
      }
    }

    batch.set(dbList.doc(list.id), {
      //add properties to list
      title: list.title,
      votes: votes,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      creator: list.user,
      rating: 0,
      raters_count: 0,
      item_count: length,
      preview_image: list.preview_image,
      votable: list.votable,
      type: list.type,
      category: list.category,
      comment_count: 0,
      popularity: popularity,
      rating_score: 0,
      voters_count: 1,
      views: 0,
      net_vote: votes,
      upvotes: votes,
      ...others,
    });

    let promises = [];
    //loops through all items received. Uploads each item as a new document in lists/list id/items collection
    for (let i = 0; i < list.items.length; i++) {
      promises.push(
        dispatch("add_list_item", {
          list: list,
          user: list.user,
          net_vote: list.items.length - i,
          item: list.items[i],
          first_addition: true,
          rank: i + 1,
        }).then((details) => {
          if (details.info) {
            features.push(details.info);
          }
        })
      );
    }

    await Promise.all(promises);

    batch.set(db.collection("list_features").doc(list.id), {
      items: features,
    });

    // batch.set(db.collection("list_keywords").doc(list.id), {
    //   words: list.keywords,
    //   title: list.title,
    // });

    batch.update(db.collection("user_details").doc(list.user.id), {
      lists: firebase.firestore.FieldValue.increment(1),
    });
    batch.update(db.collection("categories").doc(list.category), {
      list_count: firebase.firestore.FieldValue.increment(1),
    });
    if (list.subCategory !== "") {
      let subID = encrypt(list.subCategory);
      batch.update(
        db
          .collection("categories")
          .doc(list.category)
          .collection("subs")
          .doc(subID),
        { list_count: firebase.firestore.FieldValue.increment(1) }
      );
    }

    await batch.commit().then(() => {
      const algoliaIndex = algoliaClient.initIndex("lists");
      algoliaIndex.saveObject({
        objectID: list.id,
        title: list.title,
      });

      if (list.demanded) {
        this.dispatch("send_notification", {
          type: "demand-created",
          list: { id: list.id, title: list.title, user: list.user },
          demand_id: list.demand_id,
          title: list.title,
        }).then(() => {
          this.dispatch("delete_demand", list.demand_id);
        });
      }
      let image = {};
      list.preview_image ? (image = { image: list.preview_image.low }) : null;
      this.dispatch("update_activities", {
        type: "list",
        list: {
          title: list.title,
          id: list.id,
          ...image,
        },
        recipient: list.user.id,
      }).catch((error) => {
        this.dispatch("set_snackbar", {
          show: true,
          message: "Ooops. An error occured while uploading list",
          type: "error",
        });
        throw error;
      });
      // if (!list.personal) {
      //   this.dispatch("update_happening", {
      //     type: "list",
      //     list: {
      //       title: list.title,
      //       id: list.id,
      //       ...image
      //     }
      //   });
      // }
    });
  },

  async rate_list({ state }, payload) {
    let db = firebase.firestore();
    let batch = db.batch();
    let list = db.collection("lists").doc(payload.list.id);
    let newRating;
    if (!this.getters.semiAuthenticated) {
      await this.dispatch("anonymous_login");
    }
    return db
      .runTransaction(async (transaction) => {
        return transaction.get(list).then((doc) => {
          newRating =
            Math.round(
              ((doc.data().rating * doc.data().raters_count + payload.rating) /
                (doc.data().raters_count + 1)) *
                10
            ) / 10;
          let ratingScore, exp;
          exp = (doc.data().raters_count + 1) / 144;
          ratingScore = newRating + 5 * (1 - Math.pow(2.718, exp));

          transaction.update(list, {
            rating: newRating,
            raters_count: firebase.firestore.FieldValue.increment(1),
            rating_score: ratingScore,
          });
          transaction.set(
            db
              .collection("lists")
              .doc(payload.list.id)
              .collection("raters")
              .doc(state.user.id),
            {
              user: state.user.id,
              rating: payload.rating,
              created: firebase.firestore.FieldValue.serverTimestamp(),
            }
          );
        });
      })
      .then(() => {
        let image = {};
        payload.list.preview_image
          ? (image = { image: payload.list.preview_image.url.low })
          : null;

        this.dispatch("update_activities", {
          type: "rate",
          rating: payload.rating,
          raters_count: payload.list.raters_count,
          list: {
            title: payload.list.title,
            id: payload.list.id,
            ...image,
          },
        });
        // this.dispatch("update_happening", {
        //   type: "rate",
        //   rating: payload.rating,
        //   raters_count: payload.list.raters_count,
        //   list: {
        //     title: payload.list.title,
        //     id: payload.list.id,
        //     ...image
        //   }
        // });
        this.dispatch("update_popularity", payload.list.id);
        return newRating;
      });
  },

  async check_rated({ state }, id) {
    if (!this.getters.semiAuthenticated) {
      return false;
    }
    return await firebase
      .firestore()
      .collection("lists")
      .doc(id)
      .collection("raters")
      .doc(state.user.id)
      .get()
      .then((doc) => {
        return doc.data();
      });
  },

  async update_list_preview({ state }, payload) {
    firebase
      .firestore()
      .collection("lists")
      .doc(payload.id)
      .update({
        preview_image: payload.image,
      });
  },

  async add_pending_list_item({ state }, payload) {
    let db = firebase.firestore();

    db.collection("pending_list_items").add({
      ...payload,
      user: { id: state.user.id, username: state.user.username },
    });
  },

  async fetch_pending_list_items({ state }, payload) {
    let db = firebase.firestore();

    return db
      .collection("pending_list_items")
      .limit(payload.limit)
      .get()
      .then((query) => {
        return query.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
      });
  },

  async delete_pending_list_item({ state }, id) {
    firebase
      .firestore()
      .collection("pending_list_items")
      .doc(id)
      .delete()
      .catch((error) => {
        console.log(error);
      });
  },

  async add_list_item({ state, dispatch }, payload) {
    let db = firebase.firestore();
    let batch = db.batch();

    let list = firebase
      .firestore()
      .collection("lists")
      .doc(payload.list.id);
    let itemID = encrypt(payload.item.name.toLowerCase());
    let user, low_url, high_url, others;

    payload.user
      ? (user = payload.user)
      : (user = { id: state.user.id, username: state.user.username });

    others = {};

    if (payload.item.userImage && !payload.item.isLink) {
      let low_image, high_image;

      low_image = await firebase
        .storage()
        .ref(
          "lists/" +
            payload.list.id +
            "/items/" +
            itemID +
            "/" +
            1 +
            "/low.jpeg"
        )
        .put(getBlob(payload.item.userImage.low));
      high_image = await firebase
        .storage()
        .ref(
          "lists/" +
            payload.list.id +
            "/items/" +
            itemID +
            "/" +
            1 +
            "/high.jpeg"
        )
        .put(getBlob(payload.item.userImage.high));

      low_url = await low_image.ref.getDownloadURL();
      high_url = await high_image.ref.getDownloadURL();
      others = {
        image: {
          url: { low: low_url, high: high_url },
          user: user,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          source: payload.item.userImage.source,
        },
      };
    }

    let ID;

    if (!payload.item.info && payload.item.isLink) {
      dispatch("add_db_item", { item: payload.item, user: user });
      ID = itemID;
    } else if (payload.item.info) {
      ID = payload.item.info;
      payload.item.isLink = true;
    } else {
      ID = false;
    }
    let rank;

    if (payload.first_addition) {
      rank = payload.rank;
    } else {
      rank = await list.get().then((list) => {
        return list.data().item_count;
      });
    }

    ID ? (others = { info: ID }) : null;
    payload.item.comment && payload.item.comment !== ""
      ? (others = { note: payload.item.comment, ...others })
      : null;

    batch.set(list.collection("items").doc(itemID), {
      rank: rank,
      name: payload.item.name,
      net_vote: payload.net_vote,
      upvotes: payload.net_vote,
      downvotes: 0,
      list_id: payload.list.id,
      comment_count: 0,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      user: user.id,
      is_link: payload.item.isLink,
      ...others,
    });

    if (!payload.first_addition) {
      let data = {};
      if (!(await this.dispatch("check_list_voted", payload.list.id))) {
        data = {
          voters_count: firebase.firestore.FieldValue.increment(1),
        };
      }
      batch.update(list, {
        votes: firebase.firestore.FieldValue.increment(payload.net_vote),
        item_count: firebase.firestore.FieldValue.increment(1),
        ...data,
      });
      batch.set(list.collection("voters").doc(user.id), {
        created: firebase.firestore.FieldValue.serverTimestamp(),
      });
      batch.update(db.collection("list_features").doc(payload.list.id), {
        items: firebase.firestore.FieldValue.arrayUnion(ID),
      });
    }

    return batch
      .commit()
      .then(() => {
        if (!payload.first_addition) {
          this.dispatch("update_activities", {
            type: "item",
            item: {
              info: ID,
              name: payload.item.name,
            },
            list: {
              id: payload.list.id,
              title: payload.list.title,
            },
            recipient: user.id,
          });
          return {
            data() {
              return {
                info: ID,
                rank: payload.rank,
                name: payload.item.name,
                net_vote: payload.net_vote,
                upvotes: payload.net_vote,
                downvotes: 0,
                list_id: payload.list.id,
                comment_count: 0,
                created: firebase.firestore.FieldValue.serverTimestamp(),
                user: user.id,
                is_link: payload.item.isLink,
              };
            },
            id: itemID,
          };
        } else {
          if (ID) {
            return { info: ID };
          } else {
            return {};
          }
        }
      })
      .catch((error) => {
        throw error;
      });
  },

  async add_db_item({ commit }, payload) {
    let db = firebase.firestore();
    let id = encrypt(payload.item.name.toLowerCase());
    return await db
      .collection("items")
      .doc(id)
      .get()
      .then(async (item) => {
        if (item.exists) {
          return "exists";
        } else {
          return await db
            .collection("items")
            .doc(id)
            .set({
              name: payload.item.name,
              media_count: 0,
              keywords: payload.item.keywords,
            })
            .then(() => {
              const algoliaIndex = algoliaClient.initIndex("items");
              algoliaIndex.saveObject({
                objectID: id,
                title: payload.item.name,
              });
              db.collection("items")
                .doc(id)
                .collection("contributors")
                .doc(payload.user.id)
                .set(payload.user);
            })
            .then(() => {
              if (payload.item.userImage) {
                this.dispatch("upload_item_image", {
                  image: payload.item.userImage,
                  item: { id: id, ...payload.item },
                  isUrl: true,
                });
              }
              return id;
            });
        }
      });
  },

  async set_item_rank({ commit }, payload) {
    firebase
      .firestore()
      .collection("lists")
      .doc(payload.list_id)
      .collection("items")
      .doc(payload.item_id)
      .update({
        rank: payload.rank,
      });
  },

  async fetch_item_rank({ commit }, payload) {
    return firebase
      .firestore()
      .collection("lists")
      .doc(payload.list_id)
      .collection("items")
      .doc(payload.item.id)
      .get()
      .then((doc) => {
        return doc.data();
      });
  },

  async update_popularity({ state }, id) {
    let db = firebase.firestore();
    let list = firebase
      .firestore()
      .collection("lists")
      .doc(id);
    let popularity;

    db.runTransaction(async (transaction) => {
      await transaction.get(list).then((list) => {
        if (list.data().votable) {
          popularity =
            (Math.round(
              (list.data().votes +
                2 * list.data().raters_count +
                list.data().comment_count +
                list.data().views * 4) /
                4
            ) *
              100) /
            100;
        } else {
          popularity =
            Math.round(
              (2 * list.data().raters_count +
                list.data().comment_count +
                list.data().views) *
                4
            ) / 3;
        }
      });

      transaction.update(list, {
        popularity: popularity,
      });
    });
  },

  async fetch_complete_list({ commit, state }, id) {
    let db = firebase
      .firestore()
      .collection("lists")
      .doc(id);
    let list = {};

    return db
      .get()
      .then((doc) => {
        list = {
          id: doc.id,
          ...doc.data(),
        };
      })
      .then(async () => {
        await db
          .collection("items")
          .orderBy("net_vote", "desc")
          .orderBy("created")
          .limit(50)
          .get()
          .then(async (querySnapshot) => {
            list.items = querySnapshot.docs;
          });
      })
      .then(() => {
        return list;
      });
  },

  async fetch_list({ state }, id) {
    return await firebase
      .firestore()
      .collection("lists")
      .doc(id)
      .get()
      .then((doc) => {
        return doc.exists ? { id: id, ...doc.data() } : false;
      });
  },

  async fetch_list_with_items({ state }, id) {
    return await firebase
      .firestore()
      .collection("lists")
      .doc(id)
      .get()
      .then(async (doc) => {
        return {
          id: id,
          ...doc.data(),
          items: await this.dispatch("fetch_list_items", {
            list_id: id,
            limit: 3,
          }),
        };
      });
  },

  async fetch_list_items({ commit }, payload) {
    let list = firebase
      .firestore()
      .collection("lists")
      .doc(payload.list_id);
    let query;
    if (payload.lastDoc) {
      query = list
        .collection("items")
        .orderBy("net_votes", "desc")
        .orderBy("created")
        .startAfter(payload.lastDoc);
    } else {
      query = list
        .collection("items")
        .orderBy("net_vote", "desc")
        .orderBy("created");
    }

    return query
      .limit(payload.limit)
      .get()
      .then((query) => {
        return query.docs;
      });
  },

  async favorite_item({ state }, payload) {
    let db = firebase.firestore();
    let batch = db.batch();
    let low_url;
    let others = {};
    let user = { username: state.user.username, id: state.user.id };
    let overriden = false;

    if (payload.item.userImage) {
      let low_image;

      low_image = await firebase
        .storage()
        .ref(
          "users/" +
            state.user.id +
            "/favorites/" +
            payload.category +
            "/low.jpeg"
        )
        .put(getBlob(payload.item.userImage.low));

      low_url = await low_image.ref.getDownloadURL();
      others = {
        image: {
          url: low_url,
          user: user.id,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          source: payload.item.userImage.source,
        },
      };
      overriden = true;
    }

    let data = {};

    if (payload.item.info) {
      data = { info: payload.item.info };
    }

    payload.comment && payload.comment !== ""
      ? (data = { comment: payload.comment })
      : null;

    let dbUser = db.collection("user_details").doc(state.user.id);
    let fav = dbUser
      .collection("favorites")
      .doc("data")
      .collection("items")
      .doc(payload.category);

    batch.set(fav, {
      name: payload.item.name,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      ...data,
      ...others,
    });
    if (!payload.existing)
      batch.update(dbUser, {
        favorite_items: firebase.firestore.FieldValue.increment(1),
      });
    else {
      if (payload.existing.data().image && !overriden)
        firebase
          .storage()
          .ref(
            "/users/" +
              state.user.id +
              "/favorites/" +
              payload.existing.id +
              "/low.jpeg"
          )
          .delete();
    }

    await batch.commit().catch((error) => {
      this.dispatch("set_snackbar", {
        show: true,
        message: "sorry. An error occured",
        type: "error",
      });
      throw error;
    });
  },

  async unfavorite_item({ state }, payload) {
    let db = firebase.firestore();
    let batch = db.batch();
    let loc = firebase
      .firestore()
      .collection("user_details")
      .doc(state.user.id)
      .collection("favorites")
      .doc("data");

    batch.delete(loc.collection("items").doc(payload));
    batch.update(db.collection("user_details").doc(state.user.id), {
      favorite_items: firebase.firestore.FieldValue.increment(-1),
    });
    batch.commit().catch((error) => {
      this.dispatch("set_snackbar", {
        show: true,
        message: "sorry. An error occured",
        type: "error",
      });
    });
  },

  async fetch_favorite_items({ state }, payload) {
    if (payload.timestamp == "now") {
      payload.timestamp = new firebase.firestore.Timestamp.now();
    }
    return firebase
      .firestore()
      .collection("user_details")
      .doc(payload.user)
      .collection("favorites")
      .doc("data")
      .collection("items")
      .where("created", "<", payload.timestamp)
      .limit(payload.limit)
      .get()
      .then((query) => {
        return query.docs;
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

  async fetch_favorite_lists({ state }, payload) {
    if (!payload.timestamp) {
      payload.timestamp = new firebase.firestore.Timestamp.fromDate(new Date());
    }
    return firebase
      .firestore()
      .collection("user_details")
      .doc(payload.user)
      .collection("favorites")
      .doc("data")
      .collection("lists")
      .orderBy("created", "desc")
      .where("created", "<", payload.timestamp)
      .limit(payload.limit)
      .get()
      .then((query) => {
        return query.docs;
      });
  },

  async favorite_list({ state }, payload) {
    let auth = firebase.auth();
    if (!auth.currentUser && !auth.currentUser.isAnonymous) {
      return;
    }
    let user = firebase
      .firestore()
      .collection("user_details")
      .doc(state.user.id);
    let favorites = user.collection("favorites/data/lists");

    let batch = firebase.firestore().batch();

    batch.set(favorites.doc(payload.id), {
      created: firebase.firestore.FieldValue.serverTimestamp(),
      list: payload.id,
    });

    batch.update(user, {
      favorite_lists: firebase.firestore.FieldValue.increment(1),
    });

    batch.commit().catch((_) => {
      //no action needed
    });
  },

  async unfavorite_list({ state }, payload) {
    let db = firebase.firestore();
    let batch = db.batch();
    let loc = firebase
      .firestore()
      .collection("user_details")
      .doc(state.user.id)
      .collection("favorites")
      .doc("data");
    let user = db.collection("user_details").doc(state.user.id);

    batch.delete(loc.collection("lists").doc(payload));
    batch.update(user, {
      favorite_lists: firebase.firestore.FieldValue.increment(-1),
    });

    batch.commit().catch((_) => {
      //no action needed
    });
  },

  async check_list_favorited({ state }, payload) {
    if (!this.getters.semiAuthenticated) {
      return false;
    }
    return await firebase
      .firestore()
      .collection("user_details")
      .doc(state.user.id)
      .collection("favorites")
      .doc("data")
      .collection("lists")
      .doc(payload)
      .get()
      .then((doc) => {
        return doc.exists;
      })
      .catch((_) => {
        //no action needed
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
      .then(async (querySnapshot) => {
        return await querySnapshot.docs;
      })
      .catch((_) => {
        //no activity needed
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
      .then(async (querySnapshot) => {
        return await querySnapshot.docs;
      })
      .catch((_) => {
        this.dispatch("set_snackbar", {
          show: true,
          message: "sorry. An error occured",
          type: "error",
        });
        throw error;
      });
  },

  async fetch_user_lists({ state }, payload) {
    let db = firebase.firestore().collection("lists");
    let search;

    search = db.where("creator.id", "==", payload.user);

    return search
      .orderBy("created", "desc")
      .limit(payload.limit)
      .get()
      .then((query) => {
        return query.docs;
      });
  },

  async fetch_user_demands({ state }, payload) {
    let db = firebase.firestore().collection("demands");
    if (!payload.timestamp) {
      payload.timestamp = new firebase.firestore.Timestamp.now();
    }
    return db
      .where("user", "==", payload.user)
      .where("created", "<", payload.timestamp)
      .orderBy("created", "desc")
      .limit(payload.limit)
      .get()
      .then((query) => {
        return query.docs;
      });
  },

  async upload_pending_item_info({ state }, update) {
    await firebase
      .firestore()
      .collection("pending_item_infos")
      .add({
        created: firebase.firestore.FieldValue.serverTimestamp(),
        ...update,
      })
      .catch((_) => {
        this.dispatch("set_snackbar", {
          show: true,
          type: "error",
          message: "Sorry. An error occured",
        });
      });
  },

  async fetch_pending_item_infos({ state }) {
    return firebase
      .firestore()
      .collection("pending_item_infos")
      .limit(50)
      .get()
      .then((query) => {
        return query.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
      });
  },

  async delete_pending_item_info({ state }, id) {
    await firebase
      .firestore()
      .collection("pending_item_infos")
      .doc(id)
      .delete();
  },

  async update_item_info({ state }, payload) {
    if (!this.getters.semiAuthenticated) {
      await this.dispatch("anonymous_login");
    }
    let batch = firebase.firestore().batch();
    let itemLoc = firebase
      .firestore()
      .collection("items")
      .doc(payload.item.id);

    batch.update(itemLoc, payload.update);
    batch.set(itemLoc.collection("contributors").doc(payload.user.id), {
      id: payload.user.id,
      username: payload.user.username,
    });
    batch
      .commit()
      .then(() => {
        this.dispatch("update_activities", {
          type: "item-update",
          item: {
            info: payload.item.id,
            name: payload.item.name,
          },
          recipient: payload.user.id,
        });
      })
      .catch((_) => {
        this.dispatch("set_snackbar", {
          show: true,
          message: "Sorry. An error occured",
          type: "error",
        });
        throw _;
      });
  },

  async upload_pending_item_image({ state }, update) {
    await firebase
      .firestore()
      .collection("pending_item_images")
      .add({
        created: firebase.firestore.FieldValue.serverTimestamp(),
        ...update,
      })
      .catch((_) => {
        this.dispatch("set_snackbar", {
          show: true,
          type: "error",
          message: "Sorry. An error occured",
        });
        throw _;
      });
  },

  async fetch_pending_item_images({ state }) {
    return firebase
      .firestore()
      .collection("pending_item_images")
      .limit(50)
      .get()
      .then((query) => {
        return query.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
      });
  },

  async delete_pending_item_image({ state }, id) {
    await firebase
      .firestore()
      .collection("pending_item_images")
      .doc(id)
      .delete();
  },

  async upload_item_image({ state }, update) {
    let itemLoc = firebase
      .firestore()
      .collection("items")
      .doc(update.item.id);

    let low_image, high_image, low_url, high_url, low_loc, high_loc;
    let batch = firebase.firestore().batch();

    low_loc = firebase
      .storage()
      .ref("items/" + update.item.id + "/" + 1 + "/low.jpeg");
    low_image = await low_loc.put(getBlob(update.image.low)).catch((error) => {
      //
    });
    high_loc = firebase
      .storage()
      .ref("items/" + update.item.id + "/" + 1 + "/high.jpeg");
    high_image = await high_loc
      .put(getBlob(update.image.high))
      .catch((error) => {
        //
      });

    low_url = await low_image.ref.getDownloadURL();
    high_url = await high_image.ref.getDownloadURL();
    let media = itemLoc.collection("media").doc();

    batch.set(media, {
      source: update.image.source,
      url: {
        low: low_url,
        high: high_url,
      },
      votes: 1,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      user: update.image.user,
    });

    let upload;
    update.item.image
      ? (upload = {
          media_count: firebase.firestore.FieldValue.increment(1),
        })
      : (upload = {
          media_count: firebase.firestore.FieldValue.increment(1),
          image: {
            id: media.id,
            url: {
              low: low_url,
              high: high_url,
            },
            user: update.image.user,
            source: update.image.source,
            created: firebase.firestore.FieldValue.serverTimestamp(),
          },
        });
    batch.update(itemLoc, upload);

    return batch.commit().then(() => {
      if (!update.isUrl) {
        this.dispatch("update_activities", {
          type: "item-update",
          item: {
            info: update.item.id,
            name: update.item.name,
            image: low_url,
          },
          recipient: update.image.user.id,
        });
      }
      return {
        url: {
          high: high_url,
          low: low_url,
        },
        source: update.image.source,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        id: media.id,
        user: update.image.user,
      };
    });
  },

  async fetch_item({ commit }, id) {
    let item = firebase
      .firestore()
      .collection("items")
      .doc(id);
    return item.get().then((docref) => {
      return { id: docref.id, ...docref.data() };
    });
  },

  async fetch_item_featured({ state }, id) {
    return firebase
      .firestore()
      .collection("list_features")
      .where("items", "array-contains", id)
      .get()
      .then((query) => {
        return query.docs;
      });
    // return firebase
    //   .firestore()
    //   .collection("list_features")
    //   .where("featured_items", "array-contains", id)
    //   .get()
    //   .then(query => {
    //     return query.docs.map(doc => {
    //       return { id: doc.id, ...doc.data() };
    //     });
    //   });
  },

  async fetch_item_image({ state }, payload) {
    return firebase
      .firestore()
      .collection("items")
      .doc(payload.item_id)
      .collection("media")
      .doc(payload.image_id)
      .get()
      .then((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
  },

  async convert_keywords({ state }) {
    let lists = firebase.firestore().collection("lists");
    let keywords = firebase.firestore().collection("list_keywords");

    lists
      .get()
      .then((query) => {
        query.docs.forEach((doc) => {
          keywords.doc(doc.id).set({
            words: doc.data().keywords,
            title: doc.data().title,
          });
        });
      })
      .catch((error) => {
        //no activity needed
      });
  },
};

export default list;
