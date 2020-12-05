let functions = {
  pad: function(n) {
    n < 10 ? "0" + n : n;
  },

  currentDate: function() {
    let date = new Date();

    let currentDate =
      date.getFullYear() +
      "-" +
      this.pad(date.getMonth()) +
      "-" +
      this.pad(date.getDate());
    return currentDate;
  },

  currentTime: function() {
    let time = new Date();

    let currentTime =
      "T" +
      this.pad(time.getHours()) +
      ":" +
      this.pad(time.getMinutes()) +
      ":" +
      this.pad(time.getSeconds());
    return currentTime;
  },

  timezoneOffset: function() {
    return new Date().getTimezoneOffset();
  },

  date: function() {
    return new Date(this.currentDate() + this.currentTime());
  },

  todayDate: function(n){
      
  }
};

export default functions;
