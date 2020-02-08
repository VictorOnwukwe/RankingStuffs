const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const request = require("request").defaults({ encoding: null });

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.fetchImage = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    console.log("in cors");
    console.log("url" + req.query.imgurl);
    request.get(req.query.imgurl, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        let data =
          "data:" +
          response.headers["content-type"] +
          ";base64," +
          new Buffer(body).toString("base64");
        console.log(data);
        res.send(data);
      } else {
        console.log(error);
        res.send("Error in code");
      }
    });
  });
});
