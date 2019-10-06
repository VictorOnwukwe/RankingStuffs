<template>
  <div>
    <v-card flat max-width="500px" color="white">
      <v-card-title
        class="title font-weight-bold"
        style="position:sticky;z-index:2;top:0;background:#F4F4F4;border-bottom:1px solid grey"
      >
        Signup
        <v-spacer></v-spacer>
        <v-icon class="close" @click="close()">mdi-close</v-icon>
      </v-card-title>
      <v-card-text class="mt-7">
        <v-form id="form" v-model="valid">
          <v-text-field
            v-model="email"
            label="E-mail"
            :rules="rules.email"
            required
            color="brand"
            outlined
            clearable
          ></v-text-field>

          <v-text-field
            v-model="username"
            label="Username"
            color="brand"
            :error-messages="usernameErrors"
            outlined
            clearable
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
          ></v-text-field>

          <v-btn
            :dark="valid"
            :disabled="!valid"
            color="brand darken-1"
            :loading="eloading"
            @click="emailSignup()"
            class="mx-0"
          >Sign Up</v-btn>
        </v-form>

        <div style="text-align:center; color:var(--link)">
          <br />OR SIGN UP WITH
        </div>
        <br />

        <v-layout wrap>
          <v-flex xs6 offset-xs3>
            <v-btn @click="socialSignup('G')" :loading="gloading" block dark color="#F14336">GOOGLE</v-btn>
          </v-flex>
          <v-flex xs6 offset-xs3>
            <v-btn
              @click="socialSignup('F')"
              block
              dark
              :loading="floading"
              class="mt-3"
              color="blue darken-3"
            >FACEBOOK</v-btn>
          </v-flex>
        </v-layout>

        <!-- <v-btn @click="testSwal()">Test swal</v-btn> -->

        <p>
          <br />Already a member?
          <a class="underline" @click="login()">LOGIN</a>
        </p>
      </v-card-text>
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
      password: "",
      username: "",
      correct: false,
      valid: false,
      rules: Rules,
      eloading: false,
      usernameErrors: [],
      gloading: false,
      floading: false
    };
  },

  methods: {
    usernameRules(username) {
      if (username == "" || username.length < 3 || this.usernameValid) {
        return true;
      } else {
        return "Sorry. This username is already taken...";
      }
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

        this.eloading = true;

        await this.$store
          .dispatch("emailSignup", {
            email: this.email,
            password: this.password,
            username: this.username.toLowerCase().replace(/\s/g, "")
          })
          .then(() => {
            this.close();
            this.$router.go();
          })
          .catch(error => {
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
                }
              });
            } else {
              console.log(error);
            }
          });
      }
    },

    async socialSignup(type) {
      type === "G" ? (this.gloading = true) : (this.floading = true);
      this.$store
        .dispatch("socialLogin", type)
        .then(() => {
          this.close();
          this.$router.go();
        })
        .catch(error => {
          this.gloading = this.floading = false;
          swal("Signup Unsuccessful", {
            icon: "error"
          });
        });
    },

    async checkUsername() {
      await this.$store
        .dispatch("username_valid", this.username)
        .then(empty => {
          this.usernameErrors = empty ? [] : "Username already exists";
        });
    },

    close() {
      this.$emit("close");
    },
    login() {
      this.$emit("login");
    }
  },
  computed: {},
  watch: {
    username(val) {
      this.checkUsername();
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

