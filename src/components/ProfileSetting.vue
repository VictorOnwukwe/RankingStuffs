<template>
  <v-card tile class="">
    <v-card-title
      class="top-bar"
      style="position:sticky;z-index:2;top:0;background:#F4F4F4;border-bottom:1px solid grey; font-size:1em"
    >
      Edit Profile
      <v-spacer></v-spacer>
      <v-icon class="close" ref="close" @click="close()">mdi-close</v-icon>
    </v-card-title>
    <v-card-text class="mt-4">
      <v-layout wrap>
        <v-form v-model="valid" ref="form">
          <v-container grid-list-sm class="pa-0">
            <v-layout wrap pt-4>
              <v-flex xs12>
                <v-text-field
                  outlined
                  required
                  color="brand"
                  v-model="name"
                  prepend-inner-icon="mdi-account"
                  label="Name"
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
                  </v-flex>-->
              <v-flex xs12 sm6>
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
                      readonly
                      v-on="on"
                      color="brand"
                      label="Date of Birth"
                      prepend-inner-icon="event"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    :landscape="$vuetify.breakpoint.xs ? false : true"
                    ref="picker"
                    v-model="date"
                    :max="new Date().toISOString().substr(0, 10)"
                    min="1950-01-01"
                    @change="save"
                    color="brand"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12 sm6 pa>
                <v-text-field
                  outlined
                  color="brand"
                  v-model="city"
                  prepend-inner-icon="mdi-map-marker"
                  label="City"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 pa>
                <v-text-field
                  outlined
                  color="brand"
                  v-model="state"
                  label="State"
                  prepend-inner-icon="mdi-map-marker"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 pa>
                <v-autocomplete
                  :items="countries"
                  item-text="name"
                  outlined
                  color="brand"
                  v-model="country"
                  label="Country"
                  prepend-inner-icon="mdi-earth"
                  return-object
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12 sm6 pa>
                <v-select
                  :items="['Male', 'Female']"
                  outlined
                  color="brand"
                  v-model="sex"
                  label="Sex"
                  prepend-inner-icon="mdi-gender-male-female"
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
              <v-flex xs12>
                <v-textarea
                  outlined
                  no-resize
                  auto-grow
                  color="brand"
                  v-model="bio"
                  :rules="[rules.maxLength(200)]"
                  counter="200"
                  label="Bio"
                  prepend-inner-icon="mdi-account"
                ></v-textarea>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>

        <!-- <v-flex xs12 lg10 offset-lg-1>
          <v-card tile  class="mt-4">
            <p class="headline">Permissions</p>
            <v-container grid-list-md class="pa-0">
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
        </v-flex>-->
      </v-layout>
      <alert
        :type="'success'"
        :message="'Profile Updated'"
        :value="showSuccess"
        @act="uploadSuccess()"
      ></alert>
    </v-card-text>
    <v-card-actions>
      <m-btn
        :loading="uploading"
        :disabled="!valid || !input"
        @click="setProfile()"
        >Save</m-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import countries from "../my-modules/js/countries";
import Rules from "../rules";
export default {
  props: {
    user: Object,
  },
  data() {
    return {
      date: null,
      menu: false,
      name: "",
      country: null,
      interests: [],
      sex: "",
      bio: "",
      username: "",
      g_favorites: "Everyone",
      g_lists: "Everyone",
      g_DOB: "Everyone",
      g_country: "Everyone",
      city: "",
      state: "",
      uploading: false,
      showSuccess: false,
      rules: Rules,
      valid: false,
    };
  },

  methods: {
    save(date) {
      this.$refs.menu.save(date);
    },
    setProfile() {
      this.uploading = true;
      let data = {};
      let main = {};
      if (this.name !== "") {
        main = { name: this.name, ...main };
      }
      if (this.country !== null) {
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
      if (this.city !== "") {
        main = { city: this.city, ...main };
      }
      if (this.state !== "") {
        main = { state: this.state, ...main };
      }
      if (this.sex !== "") {
        main = { sex: this.sex, ...main };
      }

      data = {
        main: main,
        ...data,
      };

      this.$store
        .dispatch("set_profile", main)
        .then(() => {
          this.uploading = false;
          this.showSuccess = true;
        })
        .catch((_) => {
          this.uploading = false;
          this.$store.dispatch("set_snackbar", {
            show: true,
            message: "Sorry. An error occured while updating profile",
            type: "error",
          });
        });
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
        g_DOB: this.g_DOB,
      };

      this.$store.dispatch("set_permissions", main).then(() => {});
    },
    close() {
      this.$emit("close");
    },
    uploadSuccess() {
      this.close();
      this.$emit("updated");
    },
  },
  computed: {
    countries() {
      return countries;
    },
    input() {
      return (
        this.name.trim() !== "" ||
        this.country !== null ||
        this.sex.trim() !== "" ||
        this.bio.trim() !== "" ||
        this.date !== null ||
        this.city.trim() !== "" ||
        this.state.trim() !== ""
      );
    },
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
  },
};
</script>
