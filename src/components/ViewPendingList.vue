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
                  >Pending List</v-toolbar-title
                >
              </v-row>
            </v-flex>
          </v-row>
        </v-toolbar>
        <v-row class="px-3"
          ><v-flex xs12 sm8 offset-sm2>
            <div style="margin-top:5em">
              <v-card-text v-if="!showEdit">
                <div class="font-weight-bold brand--text">
                  Title
                </div>
                <p class="ptd font-weight-medium" style="font-size:1.4em">
                  {{ newList.title }}
                </p>
                <div class="font-weight-bold brand--text">
                  Description
                </div>
                <p class="ptd" style="white-space:pre-wrap">{{ newList.description }}</p>

                <p>
                  <span class="font-weight-bold brand--text">Category: </span
                  ><span class="ptd">{{ newList.category }}</span>
                </p>
                <p>
                  <span class="font-weight-bold brand--text">SubCategory: </span
                  ><span class="ptd">{{ newList.subCategory }}</span>
                </p>
                <div class="mt-12">
                  <p class="font-weight-bold brand--text">Items:</p>
                  <div v-for="(item, index) in newList.items" :key="index">
                    <v-divider class="grey lighten-2"></v-divider>
                    <p class="font-weight-bold ptd">Item {{ index + 1 }}</p>
                    <p>
                      <span class="grey--text text--darken-2 font-weight-medium"
                        >Name:</span
                      >
                      <span
                        class="text-capitalize font-weight-bold"
                        style="font-size:1.2em"
                      >
                        {{ item.name }}
                      </span>
                    </p>
                    <div v-if="item.userImage">
                      <v-img
                        :src="item.userImage.low"
                        max-width="200px"
                      ></v-img>
                    </div>
                    <p>
                      <span class="grey--text text--darken-2 font-weight-medium"
                        >info:</span
                      >
                      {{ item.info }}
                    </p>
                    <p>
                      <span
                        class="grey--text text--darken-2 font-weight-medium pre-wrap"
                        >Comment:</span
                      >
                      <span class="italic ptd">{{ item.comment }} </span>
                    </p>
                    <v-checkbox
                      v-if="!newList.items[index].info"
                      label="link"
                      v-model="newList.items[index].isLink"
                    ></v-checkbox>
                  </div>
                  <v-checkbox
                    class="mt-4"
                    @change="setAllLinks()"
                    label="Set All Links"
                    v-model="allLinks"
                  ></v-checkbox>
                </div>
              </v-card-text>
              <v-card-text v-if="showEdit">
                <v-text-field
                  outlined
                  label="Title"
                  P
                  v-model="newList.title"
                ></v-text-field>
                <v-textarea
                  outlined
                  label="Description"
                  v-model="newList.description"
                ></v-textarea>
                <v-row class="px-3">
                  <v-flex xs6>
                    <v-select
                      outlined
                      v-model="newList.category"
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
                      v-model="newList.subCategory"
                      label="Sub-Category"
                      :items="subCategories"
                      item-text="name"
                    ></v-select>
                  </v-flex>
                </v-row>

                <div>
                  <div
                    class="mt-6"
                    v-for="(item, index) of list.items"
                    :key="index"
                  >
                    <p class="font-weight-bold ptd">Item {{ index + 1 }}</p>
                    <v-text-field
                      outlined
                      label="Name"
                      v-model="newList.items[index].name"
                    ></v-text-field>
                    <v-checkbox
                      class="mt-n4"
                      v-if="!newList.items[index].info"
                      label="link"
                      v-model="newList.items[index].isLink"
                    ></v-checkbox>
                  </div>

                  <v-checkbox
                    class=""
                    @change="setAllLinks()"
                    label="Set All Links"
                    v-model="allLinks"
                  ></v-checkbox>
                </div>
              </v-card-text>
              <v-card-text v-if="showDisapproveOptions">
                <div class="brand--text">Reason For Disapproval?</div>
                <v-radio-group v-model="disapprovalReason">
                  <v-radio
                    label="Too many errors"
                    value="for having too many errors"
                  ></v-radio>
                  <v-radio
                    label="Too offensive"
                    value="for being offensive"
                  ></v-radio>
                  <v-radio
                    label="List Already Exists"
                    :value="`because a similar list already exists.`"
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
              <m-btn :loading="deleting" text @click="deleteList()">delete</m-btn>
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
                depressed
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
import _ from "lodash";
export default {
  props: {
    list: Object,
  },
  data() {
    return {
      dialog: true,
      approving: false,
      disapproving: false,
      oldList: {},
      newList: {
        title: "",
        description: "",
        category: "",
        subCategory: "",
      },
      showEdit: false,
      showDisapproveOptions: false,
      disapprovalReason: "",
      allLinks: false,
      deleting: false
    };
  },
  methods: {
    approve() {
      this.approving = true;
      this.$store.dispatch("upload_list", this.newList).then(() => {
        this.approving = false;
        this.$store.dispatch("set_snackbar", {
          show: true,
          message: "List approved successfully",
          type: "success",
        });
      this.$emit("deleteCurrent");
        this.$store.dispatch("delete_pending_list", this.list.pend_id);
        this.$store.dispatch("send_notification", {
          type: "list-approved",
          data: {
            type: "list-approved",
            list: { id: this.newList.id, title: this.newList.title },
          },
          recipient: this.newList.user.id,
        });
      });
    },
    async disapprove() {
      if (this.showDisapproveOptions) {
        this.disapproving = true;
        // this.$store.dispatch("delete_pending_list", this.list.pend_id);
        this.$store.dispatch("update_pending_state", {
          type: "pending_lists",
          id: this.list.id,
        });
        await this.$store.dispatch("send_notification", {
          type: "list-disapproved",
          data: {
            type: "list-disapproved",
            list: { title: this.newList.title },
            reason: this.disapprovalReason,
          },
          recipient: this.newList.user.id,
        });
        this.disapproving = false;
        this.showDisapproveOptions = false;
        return;
      }
      this.showDisapproveOptions = true;
    },
    setAllLinks() {
      for (let i = 0; i < this.newList.items.length; i++) {
        if (this.newList.items[i].info) continue;
        this.newList.items[i].isLink = this.allLinks;
      }
    },
    close() {
      this.$emit("close");
    },
    edit() {
      if (this.showEdit) {
        for (let a = 0; a < this.newList.items.length; a++) {
          if (this.newList.items[a].name != this.oldList.items[a].name)
            this.newList.items[a].info = null;
        }
        this.showEdit = false;
        return;
      }
      this.showEdit = true;
    },
    async deleteList(){
      this.deleting = true;
      await this.$store.dispatch("delete_pending_list", this.list.pend_id);
      this.deleting = false;
      this.$emit("deleteCurrent");
    }
  },
  computed: {
    categories() {
      return this.$store.getters.categories;
    },
    subCategories() {
      if (this.newList.category == "") {
        return;
      }
      return this.categories.find((cat) => cat.name == this.newList.category)
        .subs;
    },
  },
  created() {
    this.newList = _.cloneDeep(this.list);
    this.oldList = _.cloneDeep(this.list);
  },
};
</script>
