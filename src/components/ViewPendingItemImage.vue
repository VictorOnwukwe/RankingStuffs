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
                  >Pending Item Image</v-toolbar-title
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
                  {{ update.item.name }}
                </h2>
                <div class="mt-6">
                  <div class="font-weight-bold brand--text mb-4">
                    Image
                  </div>
                  <m-img
                    :aspectRatio="null"
                    :width="'250px'"
                    :src="update.image.high"
                  ></m-img>
                </div>
                <div class="font-weight-bold brand--text">
                  Created
                </div>
                <div>{{ created() }}</div>
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
                    value="because it already exists"
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
              <m-btn :loading="deleting"
                text
                @click="deleteImage()"
                >Delete</m-btn
              >
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
let moment = require("moment");
export default {
  props: {
    update: Object,
  },
  data() {
    return {
      dialog: true,
      approving: false,
      showDisapproveOptions: false,
      disapprovalReason: "",
      newUpdate: {},
      oldUpdate: {},
      deleting: false
    };
  },
  methods: {
    async approve() {
      this.approving = true;
      await this.$store
        .dispatch("upload_item_image", this.update)
        .then((item) => {
          this.approving = false;
          this.$store.dispatch("set_snackbar", {
            show: true,
            message: "Image approved successfully",
            type: "success",
          });
          this.$store.dispatch("delete_pending_item_image", this.update.id);
      this.$emit("deleteCurrent");
          this.$store.dispatch("send_notification", {
            type: "item-image-approved",
            data: {
              type: "item-image-approved",
              item: {
                id: this.newUpdate.item.id,
                name: this.newUpdate.item.name,
              },
              displayImage: item.url.low,
            },
            recipient: this.newUpdate.user.id,
          });
        });
    },
    disapprove() {
      if (this.showDisapproveOptions) {
        // this.$store.dispatch("delete_pending_item_image", this.update.id);
        this.$store.dispatch("update_pending_state", {
          type: "pending_item_images",
          id: this.update.id,
        });
        this.$store.dispatch("send_notification", {
          type: "item-image-disapproved",
          data: {
            type: "item-image-disapproved",
            item: {
              id: this.newUpdate.item.id,
              name: this.newUpdate.item.name,
            },
            displayImage: this.update.image.low,
            reason: this.disapprovalReason,
          },
          recipient: this.newUpdate.user.id,
        });
        this.showDisapproveOptions = false;
        return;
      }
      this.showDisapproveOptions = true;
    },
    close() {
      this.$emit("close");
    },
    created() {
      return moment(this.update.created.toDate()).toDate();
    },
    async deleteImage(){
      this.deleting = true;
      await this.$store.dispatch("delete_pending_item_image", this.update.id);
      this.deleting = false;
      this.$emit("deleteCurrent");
    }
  },
  created() {
    this.newUpdate = { ...this.update };
    this.oldUpdate = { ...this.update };
  },
};
</script>
