<template>
  <div>
    <div class="navbar">
      <div class="navbar-inner">
        <h3 id="name" @click='goHome()'>
          Naija
          <br />Top Ten
        </h3>
        <ul class="nav-links">
          <li>
            <a href="#">All Lists</a>
          </li>
          <li>
            <a href="#">Newest</a>
          </li>
          <li>
            <a href="#">Add List</a>
          </li>
          <li>
            <a href="#">For You</a>
          </li>
        </ul>
        <div class="user-search">
          <div class="user">
            <a @click="goLogin()">Login</a>
            <a @click="goSignup()">Sign up</a>
          </div>
          <div class="nav-search">
            <input type="text" />
            <v-icon class="search-button" @click="toggleSidebar()">search</v-icon>
          </div>
          <v-icon class="menu-icon" medium @click="navDrawer=!navDrawer">menu</v-icon>
        </div>
      </div>
    </div>

    <v-navigation-drawer
      div="nav-drawer"
      class="grey lighten-2"
      v-model="navDrawer"
      width="200px"
      temporary
      absolute
    >
      <v-list>
        <v-list-tile @click>
          <v-list-tile-content>
            <v-list-tile-title color="gray">Add List</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider></v-divider>
        
        <v-list-tile @click>
          <v-list-tile-content>
            <v-list-tile-title>Newest</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider></v-divider>

        <v-list-tile @click>
          <v-list-tile-content>
            <v-list-tile-title>Add List</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider></v-divider>

        <v-list-tile @click>
          <v-list-tile-content>
            <v-list-tile-title>For you</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-divider></v-divider>

      </v-list>
    </v-navigation-drawer>
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
      this.$router.push({path: '/login'});
    },

    goSignup() {
      this.$router.push({path: '/signup'});
    },

    goHome(){
        this.$router.push({path: '/'});
    }
  }
};
</script>

<style scoped>
a {
  text-decoration: none;
}

#name{
    cursor: pointer;
}

.hidden {
  display: none;
}

.navbar {
  background-color: hsl(0, 10%, 91%);
  padding: 0.5em;
  border-bottom: 5px solid darkgray;
  align-self: center;
}

.navbar-inner {
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.navbar-inner h3 {
  margin: 0;
  padding: 0;
  text-transform: uppercase;
  color: var(--accent);
}

.nav-links {
  list-style: none;
  padding-left: 0;
  display: none;
}

@media (min-width: 40em) {
  .nav-links {
    display: flex;
  }
}

.nav-links a {
  display: block;
  padding: 0.5em 1em;
  color: var(--text-primary);
  transition: filter 0.2s ease-in;
  font-size: 0.9em;
}

@media (min-width: 43.75em) {
  .nav-links a {
    font-size: 1em;
  }
}

.nav-links a:hover {
  color: var(--accent);
}

.user {
  
}
.user-search {
  display: flex;
  align-items: center;
}

.menu-icon {
  color: var(--accent);
  margin-left: 0.4em;
  margin-right: 0.2em;
  display: inline-block;
}

@media (min-width: 40em) {
  .menu-icon {
    display: none;
  }
}

.user a {
  display: none;
  margin-right: 1em;
  color: var(--accent);
  font-weight: bold;
  transition: filter 0.2s ease-in;
}

@media (min-width: 47.5em) {
  .user a {
    display: inline-block;
  }
}

.nav-search {
  display: grid;
  grid-template-columns: 7fr 1fr;
  border-radius: 0.2em;
  background-color: var(--divider);
  padding: 0.5em;
  height: 2.5em;
}

.nav-search>input{
    
}

.search-button{
    margin-left: 0.2em;
}

.sidebar {
  position: absolute;
  right: 0;
  top: 4.8em;
  background-color: var(--primary-dark);
  height: calc(100vh - 4.8em);
  padding: 0;
  margin: 0;
}

.sidebar-links {
  list-style-type: none;
  padding-left: 0;
}

.sidebar-links a {
  display: block;
  padding: 1em 0;
  padding-right: 9em;
  padding-left: 1em;
  color: black;
  border-bottom: 1px solid gray;
}

#nav-drawer {
  background-color: var(--primary-dark)
}
</style>