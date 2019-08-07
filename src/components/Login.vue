<template>
  <div id="main-div">
    <v-card class="mx-auto px-2 py-4" flat max-width="500px" color="background">
      <v-form v-model="valid" id="form">
        <v-text-field
          v-model="email"
          :rules="rules.email"
          validate-on-blur
          label="E-mail"
          required
          color="brand"
          outline
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
          outline
          clearable
        ></v-text-field>
      </v-form>
      <v-layout justify-start>
        <v-btn @click="emailLogin" color="button primary--text" id="login-button" class="mt-4 mx-0">
          <span v-if="!is_loading">Login</span>
          <v-progress-circular indeterminate :value="80" :size="25" :width="3" v-if="is_loading"></v-progress-circular>
        </v-btn>
      </v-layout>

      <div style="text-align:center; color:var(--button)">
        <br />OR LOGIN WITH
      </div>
      <br />
      <v-layout wrap>
        <v-flex xs8 offset-xs2>
          <v-btn @click="socialLogin('G')" block class="red--text" color="primary darken-1">GOOGLE</v-btn>
        </v-flex>
        <v-flex xs8 offset-xs2>
          <v-btn
            @click="socialLogin('F')"
            block
            class="blue--text text--darken-3"
            color="primary darken-1"
          >FACEBOOK</v-btn>
        </v-flex>
      </v-layout>
      <div>
        <br />Not a member yet?
        <router-link to="/signup" class="signup-link link--text text--darken-1">SIGN UP</router-link>
      </div>
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
                timer: 3000,
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

#main-div {
  background-color: inherit;
}

#main-div.btn {
  background-color: red;
}
</style>
