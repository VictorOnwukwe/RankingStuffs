<template>
  <v-dialog max-width="500px" persistent v-model="dialog">
    <v-card>
      <v-card-title class="brand--text">Flag Comment</v-card-title>
      <v-card-text>
        <div class="grey lighten-4 grey--text text--darken-2 pa-4 mb-4">
          {{ flaggedItem.content }}
        </div>
        <div>Reason for flagging?</div>
        <v-radio-group @change="otherReason = ''" v-model="flagReason">
          <v-radio
            :label="'This ' + this.type + ' is offensive'"
            value="offensive"
          ></v-radio>
          <v-radio
            :label="'This ' + this.type + ' is explicit'"
            value="explicit"
          ></v-radio>
          <v-radio label="Some other reason" value="other"></v-radio>
        </v-radio-group>

        <div v-if="flagReason == 'other'">
          <v-textarea
            v-model="otherReason"
            color="brand"
            outlined
            label="Specify Other Reason"
            no-resize
          ></v-textarea>
        </div>

        <alert
          :value="error"
          :type="'error'"
          :message="'Sorry. An error occured'"
          @act="error = false"
        ></alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <m-btn
          text
          @click="close(), (flagReason = ''), (otherReason = '')"
          >Cancel</m-btn
        >
        <m-btn
          @click="flag()"
          :loading="loading"
          text
          :disabled="
            flagReason == '' || (flagReason == 'other' && otherReason == '')
          "
          >Flag</m-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    flaggedItem: Object,
    type: String,
    path: Object
  },
  data() {
    return {
      dialog: true,
      flagReason: "",
      otherReason: "",
      loading: false,
      error: false
    };
  },
  methods: {
    flag() {
      this.loading = true;
      let optional = {};
      if (this.flagReason == "other") {
        optional = { comment: this.otherReason };
      }
      this.$store
        .dispatch("flag", {
          type: this.type,
          path: this.path,
          flaggedItem: this.flaggedItem,
          reason: this.flagReason,
          ...optional
        })
        .then(() => {
          this.loading = false;
          this.$emit("success");
        })
        .catch(error => {
          this.error = true;
        });
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>
