<template>
  <div id="main-div">
    <v-card class="mx-auto mt-4 px-2" flat max-width="500px" color="background">
      <v-form v-model="valid" id="form">
        <v-text-field
          v-model="email"
          :rules="rules.email"
          validate-on-blur
          label="E-mail"
          required
          color="brand"
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
          clearable
        ></v-text-field>
      </v-form>
      <v-layout justify-start>
        <v-btn @click="emailLogin" color="button primary--text" id="login-button" class="mt-4 mx-0">
          <span v-if="!is_loading">Login</span>
          <v-progress-circular indeterminate :value="80" :size="25" :width="3" v-if="is_loading"></v-progress-circular>
        </v-btn>
      </v-layout>

      <!-- <div style="width:50px; height:50px" class="button darken-2"></div> -->

      <v-dialog v-model="errorExists" absolute max-width="400" transition="scale-transition" origin="center center">
        <v-card>
          <v-card-text>{{errorMessage}}</v-card-text>
          <v-card-actions class="justify-center">
            <v-btn flat class="white black--text" @click="errorExists = false">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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

export default {
  data() {
    return {
      email: "",
      errorExists: false,
      errorMessage: "",
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

        //add shake animation to form on failure to validate
        form.classList.add("shake");

        //remove shake animation after 0.8 secs
        setTimeout(() => {
          form.classList.remove("shake");
        }, 300);
      } else {
        this.is_loading = true;

        this.$store
          .dispatch("emailLogin", {
            email: this.email,
            password: this.password
          })
          .then(() => {
            this.$router.push({ path: "/" });
          })
          .catch(error => {
            if (error.code == "auth/wrong-password") {
              this.errorMessage = "The password is incorrect. Did you signup with your social account? Try our social login";
              setTimeout(() => {
                this.errorExists = true;
                this.is_loading = false;
              }, 1000)
            } else if (error.code == "auth/user-not-found") {
              this.errorMessage = "The Email has not been registered on this site. Please recheck your email...";
              setTimeout(() => {
                this.errorExists = true;
                this.is_loading = false;
              }, 1000)
            }
          });
      }
    },
    socialLogin(type) {
      this.$store.dispatch("socialLogin", type);
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

#main-div.btn{
  background-color: red;
}
</style>
