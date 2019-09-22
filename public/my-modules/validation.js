let validations = {
  length: function(input, len) {
    return input.length > len
      ? "Not more than " + len + " characters required"
      : true;
  }
};
