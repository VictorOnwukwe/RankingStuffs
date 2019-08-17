<template>
  <div class="affix">
  <div id="main">

    <div id="navbar-container">
      <div id="navbar">
        <div>
          <a @click="goPopular()" class="">Popular</a>
          <a @click="goLatest()" class="">Latest</a>
          <a @click="goLatest()" class="">On Demand</a>
        </div>

        <div>
          <a @click="goCreate()" class="">Create List</a>
          <a @click="goList()" class="">Test List</a>
        </div>
      </div>
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
      navDrawer: null,
      login_dialog: false,
      signup_dialog: false
    };
  },

  methods: {

    goPopular() {
      this.$router.push({ path: "/popular-lists" });
    },

    goLatest() {
      this.$router.push({ path: "/latest-lists" });
    },

    goHome() {
      this.$router.push({ path: "/" });
    },

    goUserProfile() {
      this.$router.push({ path: "/profile" });
    },

    goCreate() {
      this.$router.push({ path: "/create" });
    },
    goList() {
      this.$router.push({ path: "/lists/jknM6pu73V7xtxP7pguV" });
    },
    logout() {
      this.$store.dispatch("logout");
    }
  },

  computed: {
    authenticated() {
      return this.$store.getters.getAuthenticated;
    },

    user() {
      return this.$store.getters.getUser;
    }
  }
};
</script>

<style scoped>
.affix{
  position: sticky;
  top: 0;
  z-index: 3;
}
#main{
  width: calc(100% + 2em);
}
div>a{
  padding-bottom: 0.2em;
}
div>a:hover{
  border-bottom: 5px solid var(--brand);
}
#brand-header {
  padding: 0.6em;
  position: relative;
}

#brand-header > h1 {
  text-shadow: 2px 2px 2px black;
  cursor: pointer;
}

#search {
  display: flex;
  max-width: 800px;
  margin: 0 auto;
  border-radius: var(--border-radius);
}
#search > input {
  color: var(--dark-text);
  padding: 0.5em;
  flex-grow: 1;
}

.center {
  align-self: center;
}

div.flex {
  display: flex;
}

#navbar-container {
  padding: 0.9em 1.2em;
  /* box-shadow: 0px 3px 5px darkgrey; */
  background-image: linear-gradient(90deg, rgb(5, 26, 53), rgb(8, 47, 99));
  height: 50px;
  border-bottom: 5px solid var(--brand);
}
#navbar {
  display: flex;
  max-width: 1080px;
  margin: 0 auto;
  align-items: center;
  justify-content: space-around;
}

a {
  text-decoration: none;
}

div a + a {
  margin-left: 1em;
}

.user-details * + * {
  margin-left: 0.5em;
}
</style>