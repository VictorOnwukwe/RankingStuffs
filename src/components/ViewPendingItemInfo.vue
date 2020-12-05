<template>
  <div>
    <v-dialog fullscreen persistent v-model="dialog">
      <v-card>
        <v-toolbar style="position:fixed;width:100%;z-index:3" color="brand">
          <v-row>
            <v-flex xs12 sm8 offset-sm2>
              <v-row class="px-3">
                <v-icon color="white" @click="close()">mdi-arrow-left</v-icon>
                <v-toolbar-title class="ml-4 white--text"
                  >Pending Item Info</v-toolbar-title
                >
              </v-row>
            </v-flex>
          </v-row>
        </v-toolbar>
        <v-row
          ><v-flex xs12 sm8 offset-sm2>
            <div style="margin-top:5em">
              <v-card-text>
                <div class="font-weight-bold brand--text">
                  Name
                </div>
                <h2 class="ptd font-weight-medium">
                  {{ info.item.name }}
                </h2>
                <div class="mt-6">
                  <div v-if="info.update.about">
                    <div class="brand--text font-weight-medium">
                      Former About
                    </div>
                    <div class="pre-wrap">{{
                        info.item.about
                          ? info.item.about
                          : "No former about"
                      }}
                    </div>
                    <div class="brand--text font-weight-medium mt-3">
                      New About
                    </div>
                    <div class="pre-wrap">{{ info.update.about }}</div>
                  </div>

                  <div class="mt-6" v-if="info.update.category">
                    <div class="brand--text font-weight-medium">
                      Former Category
                    </div>
                    <div>
                      {{
                        info.item.category
                          ? info.item.category
                          : "No former category"
                      }}
                    </div>
                    <div class="brand--text font-weight-medium mt-3">
                      New Category
                    </div>
                    <div>{{ info.update.category }}</div>
                  </div>

                  <div class="mt-6" v-if="info.update.references">
                    <div class="brand--text font-weight-medium">
                      Former References
                    </div>
                    <div v-if="info.item.references">
                      <div
                        v-for="(reference, index) in info.item.references"
                        :key="index"
                      >
                        <p>{{ reference }}</p>
                      </div>
                    </div>
                    <div v-else>No previous references</div>
                    <div class="brand--text font-weight-medium mt-3">
                      New References
                    </div>
                    <div v-if="info.update.references">
                      <div
                        v-for="(reference, index) in info.update.references"
                        :key="index"
                      >
                        <p>{{ reference }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </v-card-text>
              <v-card-text v-if="showDisapproveOptions">
                <div class="brand--text">Reason For Disapproval?</div>
                <v-radio-group v-model="disapprovalReason">
                  <v-radio
                    label="Information is wrong"
                    value="for containing wrong information"
                  ></v-radio>
                  <v-radio
                    label="Already Exists"
                    value="for containing no significantly new information"
                  ></v-radio>
                  <v-radio
                    label="Info is not elaborate"
                    value="for not being elaborate"
                  ></v-radio>
                </v-radio-group>
                <m-btn
                  text
                  @click="
                    (showDisapproveOptions = false), (disapprovalReason = '')
                  "
                  >back</m-btn
                >
              </v-card-text>
            </div>
            <v-card-actions>
              <m-btn text @click="close()">Cancel</m-btn>
              <v-spacer></v-spacer>
              <m-btn
                text
                @click="disapprove()"
                :disabled="showDisapproveOptions && disapprovalReason == ''"
                >{{
                  showDisapproveOptions ? "Continue Disapproval" : "Disapprove"
                }}</m-btn
              >
              <m-btn :loading="approving" text @click="approve()"
                >Approve</m-btn
              >
            </v-card-actions>
          </v-flex></v-row
        >
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    info: Object,
  },
  data() {
    return {
      dialog: true,
      approving: false,
      showDisapproveOptions: false,
      disapprovalReason: "",
      oldItem: {},
      newInfo: {},
    };
  },
  methods: {
    approve() {
      this.approving = true;
      this.$store.dispatch("update_item_info", this.info).then(() => {
        this.approving = false;
        this.$store.dispatch("set_snackbar", {
          show: true,
          message: "Info approved successfully",
          type: "success",
        });
        this.$store.dispatch("delete_pending_item_info", this.info.id);
        this.$emit("success");
        this.$store.dispatch("send_notification", {
          type: "item-info-approved",
          data: {
            type: "item-info-approved",
            item: { id: this.id, name: this.newInfo.item.name },
          },
          recipient: this.newInfo.user.id,
        });
      });
    },
    disapprove() {
      if (this.showDisapproveOptions) {
        // this.$store.dispatch("delete_pending_item_info", this.info.id);
        this.$store.dispatch("update_pending_state", {
          type: "pending_item_infos",
          id: this.update.id,
        });
        this.$store.dispatch("send_notification", {
          type: "item-info-disapproved",
          data: {
            type: "item-info-disapproved",
            item: { id: this.id, name: this.newInfo.item.name },
            reason: this.disapprovalReason,
          },
          recipient: this.newInfo.user.id,
        });
        return;
      }
      this.showDisapproveOptions = true;
    },
    close() {
      this.$emit("close");
    },
  },
  computed: {
    id(){
      return this.newInfo.item.name
        .toLowerCase()
        .trim()
        .replace(/ /g, "-");
    }
  },
  created(){
    this.newInfo = { ...this.info };
    this.oldInfo = { ...this.info };
  }
};
</script>
