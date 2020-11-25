let Rules = {
  email: [
    (v) => !!v || "Please enter your email",
    (v) =>
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        v.trim()
      ) || "Please enter a valid email",
  ],
  minLength: (len, field) => (v) =>
    (v || "").length >= len
      ? true
      : len == 1
      ? field
        ? field + " is required"
        : "This field" + " is required"
      : `${
          field ? field : "This field"
        } should contain at least ${len} characters`,
  maxLength: (len, field) => (v) =>
    (v || "").length <= len ||
    `${field ? field : "This field"} should contain at most ${len} characters`,
  password: [
    (v) => !!v || "Please enter your password",
    (v) =>
      (v && v.length >= 8) || "Password should contain at least 8 characters",
  ],
  required: (field) => (v) =>
    !!v || `${field ? field : "This field"} is required`,
  username: (v) => v.match(/^[ A-Za-z0-9_]*$/) || "Invalid Username",
};

export default Rules;
