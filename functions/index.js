const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const request = require("request").defaults({ encoding: null });
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.getAlgoliaDetails = functions.https.onCall((data, context) => {
  return {
    appid: functions.config().algolia.appid,
    apikey: functions.config().algolia.apikey,
  };
});
