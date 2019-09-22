<template>
  <v-card flat tile class>
    <v-card-title class="title font-weight-bold" style="position:sticky;z-index:2;top:0;background:#F4F4F4;border-bottom:1px solid grey">
      Edit Profile
      <v-spacer></v-spacer>
      <v-icon class="close" @click="close()">mdi-close</v-icon>
    </v-card-title>
    <v-card-text class="mt-4">
      <v-layout wrap>
        <v-flex xs12>
          <v-card flat tile>
            <p class="headline">Profile</p>
            <v-container grid-list-sm>
              <v-layout wrap pt-4>
                <v-flex xs12>
                  <v-text-field
                    filled
                    label="Name"
                    prepend-inner-icon="mdi-account"
                    required
                    color="brand"
                    v-model="name"
                  ></v-text-field>
                </v-flex>
                <!-- <v-flex xs12 sm6 mt-n4>
                  <v-text-field
                    outlined
                    label="Username"
                    prepend-inner-icon="mdi-account"
                    persistent-hint
                    color="brand"
                    v-model="username"
                  ></v-text-field>
                </v-flex> -->
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
                        filled
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
                    :items="countries"
                    item-text="name"
                    prepend-inner-icon="mdi-earth"
                    filled
                    color="brand"
                    label="Country"
                    v-model="country"
                    return-object
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 mt-n4 pa>
                  <v-select
                    :items="['Male', 'Female',]"
                    prepend-inner-icon="mdi-gender-male-female"
                    filled
                    color="brand"
                    label="Sex"
                    v-model="sex"
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
                </v-flex>-->
                <v-flex xs12 mt-n4>
                  <v-textarea
                    filled
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
              <v-btn color="brand white--text" @click="setProfile()">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex xs12 lg10 offset-lg-1>
          <v-card tile flat class="mt-4">
            <p class="headline">Permissions</p>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex>
                  <v-layout align-center>
                    <v-flex xs12 sm8 ml-2>
                      <v-select
                        label="Favorites"
                        color="brand"
                        v-model="g_favorites"
                        prepend-inner-icon="mdi-account-multiple"
                        :items="['Followers', 'Everyone']"
                        filled
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>

                <v-flex>
                  <v-layout align-center>
                    <v-flex xs12 sm8 ml-2>
                      <v-select
                        label="Lists"
                        color="brand"
                        v-model="g_lists"
                        prepend-inner-icon="mdi-account-multiple"
                        :items="['Followers', 'Everyone']"
                        filled
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>

                <v-flex>
                  <v-layout align-center>
                    <v-flex xs12 sm8 ml-2>
                      <v-select
                        label="Birth Details"
                        color="brand"
                        v-model="g_DOB"
                        prepend-inner-icon="mdi-account-multiple"
                        :items="['Followers', 'Everyone']"
                        filled
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>

                <v-flex>
                  <v-layout align-center>
                    <v-flex xs12 sm8 ml-2>
                      <v-select
                        label="Country"
                        v-model="g_country"
                        color="brand"
                        prepend-inner-icon="mdi-account-multiple"
                        :items="['Followers', 'Everyone']"
                        filled
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>
            <v-card-actions>
              <v-layout>
                <v-flex xs12 lg10>
                  <v-btn class="brand white--text" @click="setPermissions()">Save</v-btn>
                </v-flex>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import countries from "../../public/my-modules/countries";
export default {
  props: {
    user: Object
  },
  data() {
    return {
      date: null,
      menu: false,
      name: "",
      country: {},
      interests: [],
      sex: "",
      bio: "",
      username: "",
      g_favorites: "Everyone",
      g_lists: "Everyone",
      g_DOB: "Everyone",
      g_country: "Everyone"
    };
  },

  methods: {
    save(date) {
      this.$refs.menu.save(date);
    },
    setProfile() {
      let data = {};
      let main = {};
      if (this.name !== "") {
        main = { name: this.name, ...main };
      }
      if (this.country !== {}) {
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
      if (this.sex !== ""){
        main = {sex: this.sex, ...main};
      }

      data = {
        main: main,
        ...data
      };

      this.$store.dispatch("set_profile", main).then(() => {});
    },
    setPermissions() {
      let main;
      switch (this.g_favorites) {
        case "Everyone":
          this.g_favorites = true;
          break;
        case "Followers":
          this.g_favorites = false;
          break;
      }
      switch (this.g_lists) {
        case "Everyone":
          this.g_lists = true;
          break;
        case "Followers":
          this.g_lists = false;
          break;
      }
      switch (this.g_DOB) {
        case "Everyone":
          this.g_DOB = true;
          break;
        case "Followers":
          this.g_DOB = false;
          break;
      }

      main = {
        g_favorites: this.g_favorites,
        g_lists: this.g_lists,
        g_DOB: this.g_DOB
      };

      this.$store.dispatch("set_permissions", main).then(() => {});
    },
    close(){
      this.$emit("closeMe");
    }
  },
  computed: {
    countries(){
      return countries;
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
.close{
  color: gray
}
.close:hover{
  color: red;
}
</style>
