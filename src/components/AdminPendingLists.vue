<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="lists"
      sort-by="created"
      class="elevation-1"
      :loading="fetching"
    >
      <template v-slot:top>
        <v-toolbar class="mb-6" flat color="white">
          <v-toolbar-title class="font-weight-bold primary--text"
            >LISTS</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-col cols="4">
            <v-select
              v-model="show"
              class="mt-9"
              outlined
              max-width="200px"
              label="Show"
              :items="listTypes"
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
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
    <view-list
      v-if="viewDialog"
      @close="viewDialog = false"
      :list="currentList"
    ></view-list>
    <v-snackbar v-model="successful" top
      >{{ successMessage }}
      <v-spacer></v-spacer>
      <m-btn text :color="'primary lighten-4'" @click="successful = false"
        >OK</m-btn
      >
    </v-snackbar>
  </div>
</template>
<script>
import ViewPendingList from "./ViewPendingList";
export default {
  layout: "admin",
  components: {
    "view-list": ViewPendingList
  },
  data: () => ({
    page: 1,
    pageCount: 5,
    itemsPerPage: 50,
    headers: [
      {
        text: "Title",
        align: "left",
        sortable: false,
        value: "title"
      },
      { text: "Creator", value: "user.username" },
      { text: "Category", value: "category" },
      { text: "Actions", value: "action", sortable: false, align: "center" }
    ],
    lists: [],
    listTypes: [
      { text: "All lists", value: "all" },
      { text: "Admins", value: "admins" },
      { text: "Blocked lists", value: "blocked" },
      { text: "Active lists", value: "active" }
    ],
    show: "all",
    currentList: {},
    fetching: false,
    successful: false,
    successMessage: "Action completed successfully!",
    viewDialog: false
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.$store
        .dispatch("fetch_pending_lists", {
          limit: 20,
          lastDoc: false
        })
        .then(lists => {
          this.lists = lists.map(list => {
            return {
              pend_id: list.id,
              ...list.data()
            };
          });
        });
    },
    initView(list) {
      this.currentList = list;
      this.viewDialog = true;
    }
  }
};
</script>
