<template>
  <div>
    <div id="brand-header" class="brand">
      <h1 @click="goHome()" class="primary--text">Naija Top Ten</h1>
      <div id="search" class="primary">
        <input type="text" placeholder="Search..."/>
        <v-icon>mdi-magnify</v-icon>
      </div>
    </div>
    <!-- <v-toolbar color="primary">
      <v-toolbar-items>
        <div class="center">
          <a href="#" class="link--text">Newest</a>
          <a href="#" class="link--text">Suggest List</a>
        </div>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <div class="flex center">
          <a @click="goLogin()" class="dark_text--text">Login</a>
          <a @click="goSignup()" class="dark_text--text">Sign up</a>
        </div>
      </v-toolbar-items>
    </v-toolbar> -->

    <div id="navbar-container">
      <div id="navbar">
        <div>
          <a href="#" class="link--text">Popular</a>
          <a href="#" class="link--text">Latest</a>
        </div>

        <div>
          <a @click="goCreate()" class="link--text">Create List</a>
          <a @click="goList()" class="link--text">Test List</a>
        </div>

        <div>
          <a @click="goLogin()" class="dark_text--text">Login</a>
          <a @click="goSignup()" class="dark_text--text">Sign up</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navDrawer: null
    };
  },

  methods: {
    goLogin() {
      this.$router.push({ path: "/login" });
    },

    goSignup() {
      this.$router.push({ path: "/signup" });
    },

    goHome() {
      this.$router.push({ path: "/" });
    },

    goUserProfile() {
      this.$router.push({ path: "/profile" });
    },

    goCreate(){
      this.$router.push({path: "/create"});
    },
    goList(){
      this.$router.push({path: "/lists/jknM6pu73V7xtxP7pguV"}) ;
    }
  },

  computed: {
    authenticated() {
      return this.$store.state.authenticated;
    }
  }
};
</script>

<style scoped>
#brand-header {
  padding: 0.6em;
  position: relative;
}

#brand-header>h1{
  text-shadow: 2px 2px 2px black;
  cursor: pointer;
}

#search{
  display: flex;
  max-width: 800px;
  margin: 0 auto;
  border-radius: var(--border-radius);
}
#search>input{
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


#navbar-container{
  padding: 0.9em 1.2em;
  box-shadow: 0px 3px 5px darkgrey;
  background-color: var(--primary);
}
#navbar{
  display: flex;
  max-width: 1080px;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
}

a{
  text-decoration: none;
}

div a+a{
  margin-left: 1em;
}
</style>