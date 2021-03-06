<template>
  <div>
    <v-card flat max-width="500px" color="white">
      <v-card-title
        class="title font-weight-bold"
        style="position:sticky;z-index:2;top:0;background:#F4F4F4;border-bottom:1px solid grey"
      >
        Signup
        <v-spacer></v-spacer>
        <v-icon class="close" @click="$store.dispatch('set_signup', false)"
          >mdi-close</v-icon
        >
      </v-card-title>
      <v-card-text class="mt-7">
        <v-form id="form" v-model="valid">
          <v-text-field
            v-model="email"
            label="E-mail"
            :rules="[...rules.email]"
            required
            color="brand"
            outlined
            clearable
            id="email"
            @keyup.enter="focus('username')"
          ></v-text-field>

          <v-text-field
            v-model="username"
            label="Username"
            color="brand"
            :rules="[
              rules.required,
              rules.username,
              rules.maxLength(15, 'Username'),
              rules.minLength(3, 'Username'),
              rules.username,
            ]"
            :error-messages="usernameErrors"
            outlined
            clearable
            id="username"
            @keyup.enter="focus('password')"
          ></v-text-field>

          <v-text-field
            v-model="password"
            :counter="8"
            label="Password"
            type="password"
            :rules="rules.password"
            required
            color="brand"
            outlined
            clearable
            id="password"
            @keyup.enter="focus('confirmpassword')"
          ></v-text-field>

          <v-text-field
            v-model="confirmPassword"
            :counter="8"
            label="Confirm Password"
            type="password"
            :rules="[...rules.password, checkConfirm]"
            required
            color="brand"
            :disabled="password == ''"
            outlined
            clearable
            id="confirmpassword"
          ></v-text-field>

          <v-layout align-center>
            <v-checkbox required v-model="accepted"></v-checkbox>
            <span class="caption ptd"
              >I have read and accepted rankingstuffs'
              <router-link target="_blank" :to="'/privacy-policy'"
                >Privacy Policy</router-link
              >
              and
              <router-link target="_blank" :to="'/terms-and-conditions'"
                >Terms and Conditions</router-link
              ></span
            >
          </v-layout>

          <m-btn
            :dark="valid && accepted"
            :disabled="!valid || !accepted"
            :loading="eloading"
            @click="emailSignup()"
            class="mx-0"
            >Sign Up</m-btn
          >
        </v-form>

        <div class="mt-12 mb-8 px-6" style="position:relative">
          <v-divider class="grey lighten-1"></v-divider>
          <div
            style="position:absolute;right:46.5%;top:-1.35em"
            class="std white pa-2"
          >
            OR
          </div>
        </div>
        <v-layout justify-center>
          <v-hover v-slot:default="{ hover }">
            <v-btn
              :loading="gloading"
              :outlined="!hover"
              depressed
              fab
              color="red white--text"
              class="mr-1"
              @click="socialSignup('G')"
            >
              <v-icon>mdi-google</v-icon>
            </v-btn>
          </v-hover>
          <v-hover v-slot:default="{ hover }">
            <v-btn
              @click="socialSignup('F')"
              :loading="floading"
              :outlined="!hover"
              depressed
              class="ml-1"
              fab
              :color="'blue darken-3 white--text'"
            >
              <v-icon>mdi-facebook</v-icon>
            </v-btn>
          </v-hover>
        </v-layout>

        <!-- <v-btn @click="testSwal()">Test swal</v-btn> -->

        <p>
          <br />Already a member?
          <a class="underline" @click="$store.dispatch('set_login', true)"
            >LOGIN</a
          >
        </p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Rules from "../rules";
let _ = require("lodash");

export default {
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      correct: false,
      valid: false,
      rules: Rules,
      eloading: false,
      usernameErrors: [],
      gloading: false,
      floading: false,
      accepted: false,
    };
  },

  methods: {
    checkConfirm(val) {
      return val == this.password || "Passwords don't match";
    },

    async emailSignup() {
      this.eloading = true;

      await this.$store
        .dispatch("emailSignup", {
          email: this.email.toLowerCase().trim(),
          password: this.password,
          username: this.username.replace(/\s/g, ""),
        })
        .then(() => {
          this.close();
        })
        .catch((error) => {
          this.eloading = false;
          if (error.code === "auth/email-already-in-use") {
            Swal.fire({
              type: "info",
              html:
                "<div>" +
                '<h1 style="margin-top:-10px; margin-bottom:10px">Oops...</h1>' +
                "<p>This email already exists. You may have previously signed in with a social platform. Continue to sign in with Facebook or google</p>" +
                '<button id="facebook" style="background-color:#1565C0" class="alert-button">FACEBOOK</button><br>' +
                '<button id="google" style="background-color:#F14336" class="alert-button">GOOGLE</button>' +
                "</div>",
              showCloseButton: true,
              showConfirmButton: false,
              focusCancel: true,
              background: "#f4f4f4",
              onBeforeOpen: () => {
                const content = Swal.getContent();
                const $ = content.querySelector.bind(content);

                const facebook = $("#facebook");
                const google = $("#google");

                facebook.addEventListener("click", () => {
                  this.socialSignup("F");
                  Swal.close();
                });

                google.addEventListener("click", () => {
                  this.socialSignup("G");
                  Swal.close();
                });
              },
            });
          } else {
            this.$store.dispatch("set_snackbar", {
              show: true,
              message: "Sorry. An error occured",
              type: "error",
            });
          }
        });
    },

    async socialSignup(type) {
      type === "G" ? (this.gloading = true) : (this.floading = true);
      this.$store
        .dispatch("socialLogin", type)
        .then(() => {
          type === "G" ? (this.gloading = false) : (this.floading = false);
          this.close();
        })
        .catch((_) => {
          this.gloading = this.floading = false;
          this.dispatch("setSnackbar", {
            show: true,
            message: "sorry. An error occured",
            type: "error",
          });
          this.close();
        });
    },

    checkUsername: _.debounce(async function() {
      await this.$store
        .dispatch("username_valid", this.username)
        .then((empty) => {
          this.usernameErrors = empty ? [] : "Sorry. Username already exists";
        });
    }, 1000),

    close() {
      this.$store.dispatch("set_signup", false);
    },
    focus(elem) {
      document.querySelector("#" + elem).focus();
    },
  },
  computed: {},
  watch: {
    username() {
      this.checkUsername();
    },
    password() {
      this.confirmPassword = "";
    },
  },
};
</script>
