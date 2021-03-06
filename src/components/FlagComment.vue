<template>
  <v-dialog max-width="600px" persistent v-model="dialog">
    <v-card>
      <v-card-title
        class="brand lighten-2 white--text text-capitalize"
        style="position:sticky;top:0;z-index:2;border-bottom:1px solid black"
      >
        Flag {{ type }}
        <v-spacer></v-spacer>
        <v-icon color="white" @click="close()">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <div class="grey lighten-4 grey--text text--darken-2 pa-4 my-4">
          {{ flaggedItem.content }}
        </div>
        <div class="brand--text">Reason for flagging?</div>
        <v-radio-group @change="otherReason = ''" v-model="flagReason">
          <v-radio value="offensive">
            <template v-slot:label>
              <div class="ptd">
                <span class="font-weight-bold">Abusive</span> - This
                {{ type }} directs derogatory and abusive statements at another
                user.
              </div>
            </template>
          </v-radio>
          <v-radio value="explicit" class="mt-2">
            <template v-slot:label>
              <div class="ptd">
                <span class="font-weight-bold">Explicit</span> - This
                {{ type }} contains vulgar language.
              </div>
            </template>
          </v-radio>
          <v-radio value="obsolete" class="mt-2">
            <template v-slot:label>
              <div class="ptd">
                <span class="font-weight-bold">Obsolete</span> - This
                {{ type }} does not relate to/contribute to the item.
              </div>
            </template>
          </v-radio>
          <v-radio value="off-topic" class="mt-2">
            <template v-slot:label>
              <div class="ptd">
                <span class="font-weight-bold">Off Topic</span> - This
                {{ type }} does not relate to/contribute to the context of the
                list.
              </div>
            </template>
          </v-radio>
          <v-radio
            label="Some other reason"
            value="other"
            class="mt-2"
          ></v-radio>
        </v-radio-group>

        <div v-if="flagReason == 'other'" class="mt-2">
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
        <m-btn
          @click="flag()"
          :loading="loading"
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
