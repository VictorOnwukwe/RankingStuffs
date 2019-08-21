<template>
  <v-card max-width="800px" flat tile>
    <v-card-title>
      <span class="headline">User Profile</span>
    </v-card-title>
    <v-card-text>
      <v-container grid-list-md>
        <v-layout wrap>
          <v-flex xs12 sm6>
            <v-text-field
              filled
              label="First Name"
              prepend-inner-icon="mdi-account"
              required
              color="brand"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field
              filled
              label="Last Name"
              prepend-inner-icon="mdi-account"
              persistent-hint
              color="brand"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 sm6>
            <v-text-field
              filled
              label="Username"
              prepend-inner-icon="mdi-account"
              persistent-hint
              color="brand"
            ></v-text-field>
          </v-flex>
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
                  filled
                  v-model="date"
                  label="Birthday date"
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
          <v-flex xs12 sm6>
            <v-select
              :items="['Good', 'Bad', 'Great']"
              prepend-inner-icon="mdi-earth"
              filled
              color="brand"
              label="Country"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm6>
            <v-autocomplete
              prepend-inner-icon="mdi-heart"
              :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
              label="Interests"
              multiple
              hint="What type of lists would you like to see"
              filled
              color="brand"
            ></v-autocomplete>
          </v-flex>
          <v-flex xs12>
            <v-textarea filled label="About Me" no-resize auto-grow color="brand"></v-textarea>
          </v-flex>
        </v-layout>
      </v-container>
      <small>*indicates required field</small>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
      <v-btn color="blue darken-1" text @click="dialog = false">Save</v-btn>
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
