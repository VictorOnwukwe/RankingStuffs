<template>
  <div>
    <div id="user">
      <div id="logged-in" v-if="authenticated">
        <div>
          <v-avatar @click="goProfile()" size="25">
            <img :src="user.profile_pic" />
          </v-avatar>
        </div>
        <div id="logout">
          <a @click="logout()">Logout</a>
        </div>
      </div>
      <div v-else>
        <a @click="login_dialog=true">Login</a>
        <a @click="signup_dialog=true">Register</a>
      </div>
    </div>

    
  </div>
</template>

<script>
import Login from "./Login";
import Signup from "./Signup";
export default {
  components: {
    Login,
    Signup
  },
  data() {
    return {
      login_dialog: false,
      signup_dialog: false
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    authenticated() {
      return this.$store.getters.getAuthenticated;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
  }
};
</script>

<style scoped>
#logout{
    display: none;
}
#user {
  height: 3.125em;
  width: 5em;
  position: fixed;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4;
}
@media (min-width: 30em) {
    #logout{
        display: block;
    }
    #user{
        width: 10em;
    }
}
#user>div {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
