<template>
  <div id="main-div">
    <v-card flat max-width="500px" color="white">
      <v-card-title
        class="title font-weight-bold"
        style="position:sticky;z-index:2;top:0;background:#F4F4F4;border-bottom:1px solid grey"
      >
        Login
        <v-spacer></v-spacer>
        <v-icon class="close" @click="$store.dispatch('set_login', false)"
          >mdi-close</v-icon
        >
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

        <div style="text-align:center;" class="mb-4 ptd"><br />OR</div>
        <v-layout justify-center>
          <v-hover v-slot:default="{ hover }">
            <v-btn
              :loading="gloading"
              :outlined="!hover"
              depressed
              fab
              color="red white--text"
              class="mr-1"
              @click="socialLogin('G')"
            >
              <v-icon>mdi-google</v-icon>
            </v-btn>
          </v-hover>
          <v-hover v-slot:default="{ hover }">
            <v-btn
              @click="socialLogin('F')"
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
        <div class="ptd">
          <br />Not a member yet?
          <a class="underline" @click="$store.dispatch('set_signup', true)"
            >SIGN UP</a
          >
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Rules from "../rules";
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
            this.eloading = false;
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
          this.close();
        })
        .catch(_ => {
          this.gloading = this.floading = false;
          this.$store.dispatch("set_snackbar", {
            show: true,
            message: "Sorry. An error occured",
            type: "error"
          });
          this.close();
        });
    },
    close() {
      this.$store.dispatch("set_login", false);
    }
  }
};
</script>

<style scoped>
@import url("../../public/my-modules/animations.css");
</style>
