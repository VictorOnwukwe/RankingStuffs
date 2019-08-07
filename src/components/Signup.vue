<template>
  <div>
    <v-card class="mx-auto px-2 py-4" max-width="500px" flat color="background">
      <v-form id="form" v-model="valid">
        <v-text-field
          v-model="email"
          label="E-mail"
          :rules="rules.email"
          required
          color="brand"
          validate-on-blur
          outline
          clearable
        ></v-text-field>

        <v-text-field
          v-model="username"
          label="Username"
          validate-on-blur
          color="brand"
          @focus="getUsernames()"
          :rules="username_rules"
          outline
          clearable
        ></v-text-field>

        <v-text-field
          v-model="password"
          :counter="8"
          label="Password"
          type="password"
          :rules="rules.password"
          validate-on-blur
          required
          color="brand"
          outline
          clearable
        ></v-text-field>
      </v-form>

      <v-layout justify-start mt-3>
        <v-btn @click="emailSignup()" class="mx-0" color="button primary--text">
          <span v-if="!is_loading">Sign up</span>
          <v-progress-circular indeterminate :value="80" :size="25" :width="3" v-if="is_loading"></v-progress-circular>
        </v-btn>
      </v-layout>

      <div style="text-align:center; color:var(--link)">
        <br />OR SIGN UP WITH
      </div>
      <br />

      <v-layout wrap>
        <v-flex xs6 offset-xs3>
          <v-btn @click="socialSignup('G')" block class="primary--text" color="#F14336">GOOGLE</v-btn>
        </v-flex>
        <v-flex xs6 offset-xs3>
          <v-btn
            @click="socialSignup('F')"
            block
            class="primary--text"
            color="blue darken-3"
          >FACEBOOK</v-btn>
        </v-flex>
      </v-layout>

      <!-- <v-btn @click="testSwal()">Test swal</v-btn> -->

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
      password: "",
      username: "",
      correct: false,
      valid: false,
      rules: Rules,
      is_loading: false,
      usernames: [],
      username_rules: [
        v =>
          !this.usernames.includes(v) ||
          "Sorry. This username is already taken",

        v =>
          v == "" ||
          v.length >= 3 ||
          "Sorry. Username must have at least three characters"
      ],
      fetched_usernames: false
    };
  },

  methods: {
    async getUsernames(){
     this.usernames = await this.$store.dispatch("fetch_all_usernames")
    },
    testSwal() {
      const Toast = Swal.mixin({
        toast: true,
        position: "center",
        showConfirmButton: false,
        timer: 3000
      });

      Toast.fire({
        type: 'error',
        html: '<div style="margin-left:8px" class="alert-font">Incorrect Password. Please check your password</div>',
        background: 'primary'
      });
    },

    async emailSignup() {
      if (!this.valid) {
        let form = document.getElementById("form");

        form.classList.add("animated", "shake", "faster");
        form.addEventListener("animationend", () => {
          form.classList.remove("animated", "shake", "faster");
        });
      } else {
        let element = document.getElementById("form");

        this.is_loading = true;

        await this.$store
          .dispatch("emailSignup", {
            credentials: {
              email: this.email,
              password: this.password,
              username: this.username.toLowerCase().replace(/\s/g, '')
            },
            all_usernames: this.usernames
          })
          .catch(error => {
            this.is_loading = false;
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
                }
              });
            } else {
              console.log(error);
            }
          });
      }
    },

    async socialSignup(type) {
      this.$store
        .dispatch("socialLogin", type)
        .catch(error => {
          swal("Signup Unsuccessful", {
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
.login-link {
  text-decoration: none;
}
.login-link:hover {
  text-decoration: underline;
}

a {
  text-decoration: none;
}

.my-facebook {
  background-color: blue;
  color: white;
  padding: 0.5em 1em;
}
</style>

