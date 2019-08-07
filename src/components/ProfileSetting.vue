<template>
    <v-card>
      <v-card-title>
        <span class="headline">User Profile</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field label="First Name" required outline color="brand"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-text-field label="Last Name" persistent-hint outline color="brand"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <v-textarea label="About me" no-resize outline color="brand"></v-textarea>
            </v-flex>
            <v-flex xs12 sm6>
              <v-autocomplete
                :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                label="Interests"
                multiple
                hint="What type of lists would you like to see"
                outline
                color="brand"
              ></v-autocomplete>
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
export default {};
</script>

<style scoped>
</style>
