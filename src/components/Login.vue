<template>
  <div id="main-div">
    <v-card flat max-width="500px" color="white">
      <v-card-title class="title font-weight-bold" style="position:sticky;z-index:2;top:0;background:#F4F4F4;border-bottom:1px solid grey">
      Login
      <v-spacer></v-spacer>
      <v-icon class="close" @click="close()">mdi-close</v-icon>
    </v-card-title>
      <v-card-text class="mt-7">
        <v-form v-model="valid" id="form">
          <v-text-field
            v-model="email"
            :rules="rules.email"
            validate-on-blur
            label="E-mail"
            required
            color="brand"
            outlined
            clearable
          ></v-text-field>

          <v-text-field
            v-model="password"
            :rules="rules.password"
            validate-on-blur
            :counter="8"
            label="Password"
            type="password"
            required
            color="brand"
            outlined
            clearable
          ></v-text-field>

          <v-btn @click="emailLogin" color="button primary--text" id="login-button" class="mx-0">
            <span class="primary--text font-weight-bold" v-if="!is_loading">Login</span>
            <v-progress-circular indeterminate :value="80" :size="25" :width="3" v-if="is_loading"></v-progress-circular>
          </v-btn>
        </v-form>

        <div style="text-align:center; color:var(--button)">
          <br />OR LOGIN WITH
        </div>
        <br />
        <v-layout wrap>
          <v-flex xs6 offset-xs3>
            <v-btn @click="socialLogin('G')" block class="primary--text font-weight-bold" color="#F14336">GOOGLE</v-btn>
          </v-flex>
          <v-flex xs6 offset-xs3>
            <v-btn
              @click="socialLogin('F')"
              block
              class="primary--text mt-3 font-weight-bold"
              color="blue darken-3"
            >FACEBOOK</v-btn>
          </v-flex>
        </v-layout>
        <div>
          <br />Not a member yet?
          <router-link to="/signup" class="signup-link link--text text--darken-1">SIGN UP</router-link>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Rules from "../rules";
import { setTimeout } from "timers";
import firebase from "firebase/app";
import "firebase/auth";

export default {
  data() {
    return {
      email: "",
      valid: false,
      password: "",
      rules: Rules,
      is_loading: false
    };
  },

  methods: {
    emailLogin() {
      if (!this.valid) {
        let form = document.getElementById("form");

        form.classList.add("animated", "shake", "faster");
        form.addEventListener("animationend", () => {
          form.classList.remove("animated", "shake", "faster");
        });
      } else {
        this.is_loading = true;

        this.$store
          .dispatch("emailLogin", {
            email: this.email,
            password: this.password
          })
          .catch(error => {
            this.is_loading = false;
            if (error.code == "auth/wrong-password") {
              const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000
              });

              Toast.fire({
                type: "error",
                title: "Incorrect Password..."
              });
            } else if (error.code == "auth/user-not-found") {
              const Toast = Swal.mixin({
                toast: true,
                position: "center",
                showConfirmButton: false,
                timer: 3000
              });

              Toast.fire({
                type: "error",
                html:
                  '<div style="margin-left:8px" class="alert-font">Incorrect email... Please check your email</div>'
              });
            }
          });
      }
    },
    socialLogin(type) {
      this.$store.dispatch("socialLogin", type).catch(error => {
        swal("Login Unsuccessful", {
          icon: "error"
        });
      });
    },
    close(){
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
@import url("../../public/my-modules/animations.css");
</style>

<style scoped>
.signup-link {
  text-decoration: none;
}
.signup-link:hover {
  text-decoration: underline;
}
</style>
