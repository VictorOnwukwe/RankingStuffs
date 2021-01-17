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
                  >Pending List Submission</v-toolbar-title
                >
              </v-row>
            </v-flex>
          </v-row>
        </v-toolbar>
        <v-row
          ><v-flex xs12 sm8 offset-sm2>
            <div style="margin-top:5em">
              <v-card-text v-if="!showEdit">
                <div class="font-weight-bold brand--text">
                  Name
                </div>
                <p class="ptd font-weight-medium">
                  {{ oldItem.item.name }}
                </p>
                <div v-if="oldItem.item.userImage">
                  <div class="font-weight-bold brand--text">
                    Image
                  </div>
                  <m-img
                    :aspectRatio="null"
                    :width="'250px'"
                    :src="oldItem.item.userImage.high"
                  ></m-img>
                </div>

                <div v-if="oldItem.item.comment" class="mt-4">
                  <div class="font-weight-bold brand--text">
                    Comment
                  </div>
                  <p>{{ oldItem.item.comment }}</p>
                </div>

                <p>
                  <span class="font-weight-bold brand--text">List: </span
                  ><span class="ptd text-capitalize font-weight-medium">{{
                    oldItem.list.title
                  }}</span>
                </p>
                <p>
                  <span class="font-weight-bold brand--text">Rank: </span>
                  <span class="ptd">{{ oldItem.rank }}</span>
                </p>
                <v-checkbox
                  v-if="!newItem.item.info"
                  v-model="newItem.item.isLink"
                  label="Is Link"
                ></v-checkbox>
              </v-card-text>
              <v-card-text v-if="showEdit">
                <v-text-field
                  outlined
                  label="Name"
                  v-model="newItem.item.name"
                ></v-text-field>
                <v-checkbox
                  v-if="!newItem.item.info"
                  v-model="newItem.item.isLink"
                  label="Is Link"
                ></v-checkbox>
              </v-card-text>
              <v-card-text v-if="showDisapproveOptions">
                <div class="brand--text">Reason For Disapproval?</div>
                <v-radio-group v-model="disapprovalReason">
                  <v-radio
                    label="Does not belong"
                    value="for being off topic"
                  ></v-radio>
                  <v-radio
                    label="Already Exists"
                    value="because it already exists on the list"
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
              <m-btn :loading="deleting" text @click="deleteItem()">Delete</m-btn>
              <v-spacer></v-spacer>
              <m-btn text @click="edit()"
                >{{ showEdit ? "Save " : "" }}Edit</m-btn
              >
              <m-btn
                text
                @click="disapprove()"
                :disabled="showDisapproveOptions && disapprovalReason == ''"
                :loading="disapproving"
                >{{
                  showDisapproveOptions ? "Continue Disapproval" : "Disapprove"
                }}</m-btn
              >
              <m-btn
                :loading="approving"
                :disabled="showEdit"
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
    item: Object,
  },
  data() {
    return {
      dialog: true,
      approving: false,
      disapproving: false,
      oldItem: {},
      newItem: {},
      showEdit: false,
      showDisapproveOptions: false,
      disapprovalReason: "",
      deleting: false
    };
  },
  methods: {
    approve() {
      this.approving = true;
      this.$store.dispatch("add_list_item", this.newItem).then(() => {
        this.approving = false;
        this.$store.dispatch("set_snackbar", {
          show: true,
          message: "List approved successfully",
          type: "success",
        });
        this.$store.dispatch("delete_pending_list_item", this.item.id);
      this.$emit("deleteCurrent");
        this.$store.dispatch("send_notification", {
          type: "item-approved",
          data: {
            type: "item-approved",
            item: { id: this.id, name: this.newItem.item.name },
            list: { id: this.item.list.id, title: this.item.list.title },
          },
          recipient: this.newItem.user.id,
        });
      });
    },
    async disapprove() {
      if (this.showDisapproveOptions) {
        this.disapproving = true;
        // this.$store.dispatch("delete_pending_list_item", this.item.id);
        this.$store.dispatch("update_pending_state", {
          type: "pending_list_items",
          id: this.item.id,
        });
        console.log("disapproving");
        await this.$store
          .dispatch("send_notification", {
            type: "item-disapproved",
            data: {
              type: "item-disapproved",
              item: { id: this.id, name: this.newItem.item.name },
              list: { id: this.item.list.id, title: this.item.list.title },
              reason: this.disapprovalReason,
            },
            recipient: this.newItem.user.id,
          })
          .catch((e) => {
            console.log(e);
          });
        this.disapproving = false;
        this.showDisapproveOptions = false;
        return;
      } else this.showDisapproveOptions = true;
    },
    close() {
      this.$emit("close");
    },
    edit() {
      if (this.showEdit) {
        this.oldItem = { ...this.newItem };
        this.showEdit = false;
        return;
      }
      this.showEdit = true;
    },
    async deleteItem(){
      this.deleting = true;
      await this.$store.dispatch("delete_pending_list_item", this.item.id);
      this.deleting = false;
      this.$emit("deleteCurrent");
    }
  },
  computed: {
    id() {
      return this.encrypt(this.newItem.name.toLowerCase().trim());
    },
  },
  created() {
    this.newItem = { ...this.item };
    this.oldItem = { ...this.item };
  },
};
</script>
