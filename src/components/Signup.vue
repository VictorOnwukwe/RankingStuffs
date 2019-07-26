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

        <v-text-field
          v-model="username"
          label="Username"
          validate-on-blur
          color="brand"
          @focus="getUsernames()"
          :rules="username_rules"
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
      password: "",
      username: "",
      correct: false,
      valid: false,
      rules: Rules,
      is_loading: false,
      usernames: [],
      username_rules: [
        v =>
          (!this.usernames.includes(v)) || "This username is already taken",

        v => (v=="" || v.length >= 3) || "Sorry. Username must have at least three characters"
      ],
      fetched_usernames: false
    };
  },

  methods: {
    async getUsernames() {
      if (!this.fetched_usernames) {
        this.$store
          .dispatch("fetch_all_usernames")
          .then(result => {
            this.usernames = result;
            this.fetched_usernames = true;
            console.log("Fetched Users");
          })
          .catch(error => {});
      }
      return;
    },

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
          .dispatch("emailSignup", {credentials: {
            email: this.email,
            password: this.password,
            username: this.username.toLowerCase()
          },
          all_usernames: this.usernames
          })
          .then(() => {
            this.$router.go(-1);
          })
          .catch(error => {
            if (error.code === "auth/email-already-in-use") {
              swal(
                "Sorry. This email already exists. Did you signup with your social account? Try our social login",
                {
                  error: "warning"
                }
              );
            } else if (error.message === "username exists") {
              swal("Sorry. This username already exists", {
                error: "warning"
              });
            }
          });
      }
    },

    async socialSignup(type) {
      this.$store
        .dispatch("socialLogin", type)
        .then(() => {
          this.$router.push(-1);
        })
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

#icon {
}
</style>

