<template>
    <v-card flat tile>
      <v-layout wrap>
        <v-flex xs12 lg8 offset-lg-2>
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
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 mt-n5>
                  <v-text-field
                    outlined
                    label="Last Name"
                    prepend-inner-icon="mdi-account"
                    persistent-hint
                    color="brand"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 mt-n4>
                  <v-text-field
                    outlined
                    label="Username"
                    prepend-inner-icon="mdi-account"
                    persistent-hint
                    color="brand"
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
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 mt-n4>
                  <v-autocomplete
                    prepend-inner-icon="mdi-heart"
                    :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                    label="Interests"
                    multiple
                    hint="What type of lists would you like to see"
                    outlined
                    color="brand"
                  ></v-autocomplete>
                </v-flex>
                <v-flex xs12 mt-n4>
                  <v-textarea
                    outlined
                    label="Bio"
                    prepend-inner-icon="mdi-account"
                    no-resize
                    auto-grow
                    color="brand"
                  ></v-textarea>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>

        <v-flex xs12 lg8 offset-lg-2>
          <v-card tile flat>
            <p class="title">Posts</p>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex>
                  <v-layout align-center>
                    <v-flex xs5 sm4>
                      <p>Who should see my Favorites?</p>
                    </v-flex>
                    <v-flex xs7 sm8 ml-2>
                      <v-select
                        prepend-inner-icon="mdi-account-multiple"
                        :items="['Only Me','Followers', 'Everyone']"
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
                        prepend-inner-icon="mdi-account-multiple"
                        :items="['Only Me','Followers', 'Everyone']"
                        outlined
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>

      <v-card-actions>
        <v-layout>
          <v-flex xs12 lg8 offset-lg-2>
            <v-btn class="brand" color="primary" text @click="dialog = false">Save</v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
</template>

<script>
export default {
  data() {
    return {
      date: null,
      menu: false
    };
  },

  methods: {
    save(date) {
      this.$refs.menu.save(date);
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
