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
                  <div class="font-weight-bold brand--text">
                    Image
                  </div>
                  <m-img
                    :aspectRatio="null"
                    :width="'250px'"
                    :src="update.image.high"
                  ></m-img>
                </div>
              </v-card-text>
              <v-card-text v-if="showDisapproveOptions">
                <div class="brand--text">Reason For Disapproval?</div>
                <v-radio-group v-model="disapprovalReason">
                  <v-radio
                    label="Information is wrong"
                    value="wrong-info"
                  ></v-radio>
                  <v-radio label="Already Exists" value="exists"></v-radio>
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
              <m-btn
                :loading="approving"
                text
                @click="approve()"
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
    update: Object
  },
  data() {
    return {
      dialog: true,
      approving: false,
      showDisapproveOptions: false,
      disapprovalReason: ""
    };
  },
  methods: {
    approve() {
      this.approving = true;
      this.$store.dispatch("upload_item_image", this.update).then(() => {
        this.approving = false;
        this.$store.dispatch("set_snackbar", {
          show: true,
          message: "Image approved successfully",
          type: "success"
        });
        this.$store.dispatch("delete_pending_item_image", this.update.id);
        this.$emit("success");
        // this.$store.dispatch("send_notification", {
        //   type: "item-approved",
        //   data: {
        //     type: "item-approved",
        //     item: { id: this.id, name: this.newItem.item.name },
        //     list: { id: this.item.list.id, title: this.item.list.title }
        //   },
        //   recipient: this.newItem.user.id
        // });
      });
    },
    disapprove() {
      if (this.showDisapproveOptions) {
        this.$store.dispatch("delete_pending_item_image", this.update.id);
        // this.$store.dispatch("send_notification", {
        //   type: "item-disapproved",
        //   data: {
        //     type: "item-disapproved",
        //     item: { id: this.id, title: this.newItem.item.name },
        //     list: { id: this.item.list.id, title: this.item.list.title },
        //     reason: this.disapprovalReason
        //   },
        //   recipient: this.newItem.user.id
        // });
        return;
      }
      this.showDisapproveOptions = true;
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>
