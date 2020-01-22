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
                  >Pending Demand</v-toolbar-title
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
                  Title
                </div>
                <p class="ptd font-weight-medium">
                  {{ oldDemand.title }}
                </p>
                <div class="font-weight-bold brand--text">
                  Comment
                </div>
                <p class="ptd">
                  {{ oldDemand.comment }}
                </p>

                <p>
                  <span class="font-weight-bold brand--text">Category: </span
                  ><span class="ptd">{{ oldDemand.category }}</span>
                </p>
                <p>
                  <span class="font-weight-bold brand--text">SubCategory: </span
                  ><span class="ptd">{{ oldDemand.subCategory }}</span>
                </p>
              </v-card-text>
              <v-card-text v-if="showEdit">
                <v-text-field
                  outlined
                  label="Title"
                  v-model="newDemand.title"
                ></v-text-field>
                <v-row class="px-3">
                  <v-flex xs6>
                    <v-select
                      outlined
                      v-model="newDemand.category"
                      label="Category"
                      :items="categories"
                      item-text="name"
                      class="mr-1"
                    ></v-select>
                  </v-flex>
                  <v-flex xs6>
                    <v-select
                      outlined
                      class="ml-1"
                      v-model="newDemand.subCategory"
                      label="Sub-Category"
                      :items="subCategories"
                      item-text="name"
                    ></v-select>
                  </v-flex>
                </v-row>
              </v-card-text>
              <v-card-text v-if="showDisapproveOptions">
                <div class="brand--text">Reason For Disapproval?</div>
                <v-radio-group v-model="disapprovalReason">
                  <v-radio label="Too many errors" value="error"></v-radio>
                  <v-radio label="Too offensive" value="offensive"></v-radio>
                  <v-radio label="List Already Exists" value="exists"></v-radio>
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
              <m-btn text @click="edit()"
                >{{ showEdit ? "Save " : "" }}Edit</m-btn
              >
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
    demand: Object
  },
  data() {
    return {
      dialog: true,
      approving: false,
      oldDemand: {},
      newDemand: {
        title: "",
        comment: "",
        category: "",
        subCategory: ""
      },
      showEdit: false,
      showDisapproveOptions: false,
      disapprovalReason: ""
    };
  },
  methods: {
    approve() {
      this.approving = true;
      this.$store.dispatch("demand_list", this.newDemand).then(() => {
        this.approving = false;
        this.$store.dispatch("delete_pending_demand", this.demand.id);
        this.$store.dispatch("send_notification", {
          type: "demand-approved",
          data: {
            type: "demand-approved",
            demand: { id: this.demand.id, title: this.newDemand.title }
          },
          recipient: this.newDemand.user.id
        });
      });
    },
    disapprove() {
      if (this.showDisapproveOptions) {
        this.$store.dispatch("delete_pending_list", this.list.id);
        this.$store.dispatch("send_notification", {
          type: "demand-disapproved",
          data: {
            type: "demand-disapproved",
            demand: { title: this.newDemand.title },
            reason: this.disapprovalReason
          },
          recipient: this.newDemand.user.id
        });
        return;
      }
      this.showDisapproveOptions = true;
    },
    close() {
      this.$emit("close");
    },
    edit() {
      if (this.showEdit) {
        this.oldDemand = { ...this.newDemand };
        this.showEdit = false;
        return;
      }
      this.showEdit = true;
    }
  },
  computed: {
    categories() {
      return this.$store.getters.categories;
    },
    subCategories() {
      if (this.newDemand.category == "") {
        return;
      }
      return this.categories.find(cat => cat.name == this.newDemand.category)
        .subs;
    }
  },
  created() {
    this.newDemand = { ...this.demand };
    this.oldDemand = { ...this.demand };
  }
};
</script>
