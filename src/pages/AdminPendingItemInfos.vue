<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      sort-by="created"
      class="elevation-1"
      :loading="fetching"
    >
      <template v-slot:top>
        <v-toolbar class="mb-6" flat color="white">
          <v-toolbar-title class="font-weight-bold primary--text"
            >items</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-col cols="4">
            <v-select
              v-model="show"
              class="mt-9"
              outlined
              max-width="200px"
              label="Show"
              :items="itemTypes"
              item-text="text"
            ></v-select>
          </v-col>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-menu left>
          <template v-slot:activator="{ on }">
            <v-icon small class="" v-on="on">
              fa-ellipsis-v
            </v-icon>
          </template>
          <v-list>
            <v-list-item @click="initView(item)">
              <v-list-item-icon>
                <v-icon>fa-eye</v-icon>
              </v-list-item-icon>
              <v-list-item-content>View</v-list-item-content></v-list-item
            >
            <v-list-item @click="deleteItemInfo(item.id)">
              <v-list-item-icon>
                <v-icon v-if="!deleting">fa-trash</v-icon>
                <m-progress v-else></m-progress>
              </v-list-item-icon>
              <v-list-item-content>Delete</v-list-item-content></v-list-item
            >
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
    <view-item
      v-if="viewDialog"
      @close="viewDialog = false"
      @success="deleteItemInfo(currentItem.id)"
      :info="currentItem"
    ></view-item>
    <v-snackbar v-model="successful" top
      >{{ successMessage }}
      <v-spacer></v-spacer>
      <m-btn text color="primary lighten-4" @click="successful = false"
        >OK</m-btn
      >
    </v-snackbar>
  </div>
</template>
<script>
import ViewPendingItemInfo from "../components/ViewPendingItemInfo";
export default {
  layout: "admin",
  components: {
    "view-item": ViewPendingItemInfo,
  },
  data: () => ({
    page: 1,
    pageCount: 5,
    itemsPerPage: 50,
    headers: [
      {
        text: "Name",
        align: "left",
        sortable: false,
        value: "item.name",
      },
      { text: "Creator", value: "user.username" },
      { text: "Actions", value: "action", sortable: false, align: "center" },
    ],
    items: [],
    itemTypes: [
      { text: "All items", value: "all" },
      { text: "Admins", value: "admins" },
      { text: "Blocked items", value: "blocked" },
      { text: "Active items", value: "active" },
    ],
    show: "all",
    currentItem: {},
    fetching: false,
    successful: false,
    successMessage: "Action completed successfully!",
    viewDialog: false,
    deleting: false
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.fetching = true;
      this.$store
        .dispatch("fetch_pending_item_infos", {
          limit: 50,
          lastDoc: false,
        })
        .then((items) => {
          this.items = items;
          this.fetching = false;
        });
    },
    initView(item) {
      this.currentItem = item;
      this.viewDialog = true;
    },
    deleteItemInfo(id) {
      this.deleting = true;
      this.$store
        .dispatch("delete_pending_item_info", id)
        .then(() => {
          const index = this.items.indexOf((d) => d.id === id);
          this.items.splice(index, 1);
          this.deleting = false;
        })
        .catch((_) => {
          this.deleting = false;
        });
    },
  },
};
</script>
