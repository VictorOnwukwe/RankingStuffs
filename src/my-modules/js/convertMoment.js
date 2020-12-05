
let moment = require("moment");

let functions = {
  getShortTime: function(time) {
    let result = moment(time.toDate()).fromNow();
    if (result.includes("second")) {
      return (
        (result[0] !== "a" ? result.slice(0, result.indexOf(" ")) : "1") + "s"
      );
    } else if (result.includes("minute")) {
      return (
        (result[0] !== "a" ? result.slice(0, result.indexOf(" ")) : "1") + "m"
      );
    } else if (result.includes("hour")) {
      return (
        (result[0] !== "a" ? result.slice(0, result.indexOf(" ")) : "1") + "h"
      );
    } else if (result.includes("day")) {
      return (
        (result[0] !== "a" ? result.slice(0, result.indexOf(" ")) : "1") + "d"
      );
    } else if (result.includes("week")) {
      return (
        (result[0] !== "a" ? result.slice(0, result.indexOf(" ")) : "1") + "w"
      );
    } else if (result.includes("month")) {
      return (
        (result[0] !== "a" ? result.slice(0, result.indexOf(" ")) : "1") +
        "mo"
      );
    } else if (result.includes("year")) {
      return (
        (result[0] !== "a" ? result.slice(0, result.indexOf(" ")) : "1") + "y"
      );
    } else {
      return "null";
    }
  }
};

export default functions;