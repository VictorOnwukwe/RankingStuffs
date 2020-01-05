<template>
  <div id="main-div">
    <v-card flat max-width="500px" color="white">
      <v-card-title
        class="title font-weight-bold"
        style="position:sticky;z-index:2;top:0;background:#F4F4F4;border-bottom:1px solid grey"
      >
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

          <m-btn
            @click="emailLogin"
            :loading="eloading"
            id="login-button"
            class="mx-0"
            >Login</m-btn
          >
        </v-form>

        <div style="text-align:center;" class=""><br />OR</div>
        <br />
        <div class="mb-2" style="text-align:center;">
          Login with your social account
        </div>
        <v-layout justify-center>
          <v-btn
            :loading="gloading"
            outlined
            fab
            color="red"
            class="mr-1"
            @click="socialLogin('G')"
          >
            <v-icon>mdi-google</v-icon>
          </v-btn>
          <v-btn
            @click="socialLogin('F')"
            :loading="floading"
            outlined
            class="ml-1"
            fab
            :color="'blue darken-3'"
          >
            <v-icon>mdi-facebook-box</v-icon>
          </v-btn>
        </v-layout>
        <div>
          <br />Not a member yet?
          <a class="underline" @click="goSignup()">SIGN UP</a>
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
      eloading: false,
      gloading: false,
      floading: false
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
        this.eloading = true;

        this.$store
          .dispatch("emailLogin", {
            email: this.email,
            password: this.password
          })
          .then(() => {
            this.close();
          })
          .catch(error => {
            this.eloading = false;
            if (error.code == "auth/wrong-password") {
              const Toast = Swal.mixin({
                toast: true,
                position: "center",
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
      type === "G" ? (this.gloading = true) : (this.floading = true);
      this.$store
        .dispatch("socialLogin", type)
        .then(() => {
          this.gloading = this.floading = false;
        })
        .catch(error => {
          this.gloading = this.floading = false;
          swal("Login Unsuccessful", {
            icon: "error"
          });
        });
    },
    close() {
      this.$emit("close");
    },
    goSignup() {
      this.$emit("signup");
    }
  }
};
</script>

<style scoped>
@import url("../../public/my-modules/animations.css");
</style>
