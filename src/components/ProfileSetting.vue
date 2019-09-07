<template>
  <v-card flat tile>
    <v-layout wrap>
      <v-flex xs12 lg10 offset-lg-1>
        <v-card flat tile>
          <p class="title">Profile</p>
          <v-container grid-list-sm>
            <v-layout wrap pt-4>
              <v-flex xs12 sm6 mt-n5>
                <v-text-field
                  outlined
                  label="First Name"
                  prepend-inner-icon="mdi-account"
                  required
                  color="brand"
                  v-model="firstName"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 mt-n5>
                <v-text-field
                  outlined
                  label="Last Name"
                  prepend-inner-icon="mdi-account"
                  persistent-hint
                  color="brand"
                  v-model="lastName"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 mt-n4>
                <v-text-field
                  outlined
                  label="Username"
                  prepend-inner-icon="mdi-account"
                  persistent-hint
                  color="brand"
                  v-model="username"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 mt-n4>
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  full-width
                  min-width="290px"
                  color="brand"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      outlined
                      v-model="date"
                      label="Date Of Birth"
                      prepend-inner-icon="event"
                      readonly
                      v-on="on"
                      color="brand"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    ref="picker"
                    v-model="date"
                    :max="new Date().toISOString().substr(0, 10)"
                    min="1950-01-01"
                    @change="save"
                    color="brand"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 sm6 mt-n4 pa>
                <v-select
                  :items="['Good', 'Bad', 'Great']"
                  prepend-inner-icon="mdi-earth"
                  outlined
                  color="brand"
                  label="Country"
                  v-model="country"
                ></v-select>
              </v-flex>
              <!-- <v-flex xs12 sm6 mt-n4>
                <v-autocomplete
                  prepend-inner-icon="mdi-heart"
                  :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                  label="Interests"
                  multiple
                  hint="What type of lists would you like to see"
                  outlined
                  color="brand"
                  v-model="interests"
                ></v-autocomplete>
              </v-flex> -->
              <v-flex xs12 mt-n4>
                <v-textarea
                  outlined
                  label="Bio"
                  prepend-inner-icon="mdi-account"
                  no-resize
                  auto-grow
                  color="brand"
                  v-model="bio"
                ></v-textarea>
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-actions>
            <v-btn color="brand" @click="setProfile()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>

      <v-flex xs12 lg10 offset-lg-1>
        <v-card tile flat>
          <p class="title">Permissions</p>
          <v-container grid-list-md>
            <v-layout wrap>

              <v-flex>
                <v-layout align-center>
                  <v-flex xs5 sm4>
                    <p>Who should see my Favorites?</p>
                  </v-flex>
                  <v-flex xs7 sm8 ml-2>
                    <v-select
                      v-model="g_favorites"
                      prepend-inner-icon="mdi-account-multiple"
                      :items="['Followers', 'Everyone']"
                      outlined
                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-flex>

              <v-flex>
                <v-layout align-center>
                  <v-flex xs5 sm4>
                    <p>Who should see my lists?</p>
                  </v-flex>
                  <v-flex xs7 sm8 ml-2>
                    <v-select
                      v-model="g_lists"
                      prepend-inner-icon="mdi-account-multiple"
                      :items="['Followers', 'Everyone']"
                      outlined
                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-flex>

              <v-flex>
                <v-layout align-center>
                  <v-flex xs5 sm4>
                    <p>Who should see my Birth Details?</p>
                  </v-flex>
                  <v-flex xs7 sm8 ml-2>
                    <v-select
                      v-model="g_DOB"
                      prepend-inner-icon="mdi-account-multiple"
                      :items="['Followers', 'Everyone']"
                      outlined
                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-flex>

              <v-flex>
                <v-layout align-center>
                  <v-flex xs5 sm4>
                    <p>Who should see my Country?</p>
                  </v-flex>
                  <v-flex xs7 sm8 ml-2>
                    <v-select
                      prepend-inner-icon="mdi-account-multiple"
                      :items="['Followers', 'Everyone']"
                      outlined
                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-actions>
            <v-layout>
              <v-flex xs12 lg10 offset-lg-1>
                <v-btn class="brand" text @click="setPermissions()">Save</v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      date: null,
      menu: false,
      firstName: "",
      lastName: "",
      country: "",
      interests: [],
      bio: "",
      username: "",
      g_favorites: "Everyone",
      g_lists: "Everyone",
      g_DOB: "Everyone"
    };
  },

  methods: {
    save(date) {
      this.$refs.menu.save(date);
    },
    setProfile() {
      let data = {};
      let main = {};
      if (this.firstName !== "") {
        main = { firstName: this.firstName, ...main };
      }
      if (this.lastName !== "") {
        main = { lastName: this.lastName, ...main };
      }
      if (this.country !== "") {
        main = { country: this.country, ...main };
      }
      if (this.bio !== "") {
        main = { bio: this.bio, ...main };
      }
      if (this.date !== null) {
        main = { DOB: this.date, ...main };
      }
      if (this.interests.length > 0) {
        data = { interests: this.interests };
      }

      data = {
        main: main,
        ...data
      };

      this.$store.dispatch("set_profile", main).then(() => {});
    },
    setPermissions(){
      let main;
      switch(this.g_favorites){
        case "Everyone": this.g_favorites = true; break;
        case "Followers": this.g_favorites = false; break;
      }
      switch(this.g_lists){
        case "Everyone": this.g_lists = true; break;
        case "Followers": this.g_lists = false; break;
      }
      switch(this.g_DOB){
        case "Everyone": this.g_DOB = true; break;
        case "Followers": this.g_DOB = false; break;
      }

      main = {
        g_favorites: this.g_favorites,
        g_lists: this.g_lists,
        g_DOB: this.g_DOB
      }

      this.$store.dispatch("set_profile", main).then(() => {});
    }
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    }
  }
};
</script>

<style scoped>
</style>
