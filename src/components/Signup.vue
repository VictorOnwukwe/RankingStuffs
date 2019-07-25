<template>
  <div>
    <v-card class="mx-auto mt-4 px-2" max-width="500px" flat color="background">
      <v-form id="form" v-model="valid">
        <v-text-field
          v-model="email"
          label="E-mail"
          :rules="rules.email"
          required
          color="brand"
          validate-on-blur
        ></v-text-field>

        <v-text-field v-model="username" label="Username" color="brand"></v-text-field>

        <v-text-field
          v-model="password"
          :counter="8"
          label="Password"
          type="password"
          :rules="rules.password"
          validate-on-blur
          required
          color="brand"
        ></v-text-field>
      </v-form>

      <v-layout justify-start mt-3>
        <v-btn @click="emailSignup()" class="mx-0" color="button primary--text">
          <span v-if="!is_loading">Sign up</span>
          <v-progress-circular indeterminate :value="80" :size="25" :width="3" v-if="is_loading"></v-progress-circular>
        </v-btn>
      </v-layout>

      <v-dialog v-model="errorExists" absolute max-width="400" transition="scale-transition" origin="center center">
        <v-card>
          <v-card-text>{{errorMessage}}</v-card-text>
          <v-card-actions class="justify-center">
            <v-btn flat class="black--text" @click="errorExists = false">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <div style="text-align:center; color:var(--link)">
        <br />OR SIGN UP WITH
      </div>
      <br />

      <v-layout wrap>
        <v-flex xs8 offset-xs2>
          <v-btn @click="socialSignup('G')" block class="red--text" color="primary darken-1">GOOGLE</v-btn>
        </v-flex>
        <v-flex xs8 offset-xs2>
          <v-btn
            @click="socialSignup('F')"
            block
            class="blue--text text--darken-3"
            color="primary darken-1"
          >FACEBOOK</v-btn>
        </v-flex>
      </v-layout>

      <p>
        <br />Already a member?
        <router-link to="/login" class="login-link link--text">LOGIN</router-link>
      </p>
    </v-card>
  </div>
</template>

<script>
import Rules from "../rules";

export default {
  data() {
    return {
      email: "",
      errorExists: false,
      errorMessage: "",
      password: "",
      username: "",
      correct: false,
      valid: false,
      rules: Rules,
      is_loading: false
    };
  },

  methods: {
    async emailSignup() {
      if (!this.valid) {
        let form = document.getElementById("form");

        form.classList.add("shake");
        setTimeout(() => {
          form.classList.remove("shake");
        }, 300);
      } else {
        let element = document.getElementById("form");

        this.is_loading = true;

        await this.$store
          .dispatch("emailSignup", {
            email: this.email,
            password: this.password,
            username: this.username
          })
          .then(() => {
            this.$router.push({ path: "/profile" });
          })
          .catch(error => {
            if (error.code == "auth/email-already-in-use") {
              this.errorMessage = "Sorry. This email already exists"
              setTimeout(() => {
                this.errorExists = true;
                this.is_loading = false;
              }, 2000);
            }
            else if(error.message == "username exists"){
              this.errorMessage = "Sorry. This username already exists";
              setTimeout(() => {
                this.errorExists = true;
                this.is_loading = false;
              }, 2000);
            }
          });


      }
    },

    async socialSignup(type) {
      await this.$store.dispatch("socialLogin", type);
      this.$router.push({ path: "/userarea" });
    }
  }
};
</script>

<style scoped>
@import url("../../public/my-modules/animations.css");
</style>


<style scoped>
.login-link {
  text-decoration: none;
}
.login-link:hover {
  text-decoration: underline;
}

#icon {
}
</style>

