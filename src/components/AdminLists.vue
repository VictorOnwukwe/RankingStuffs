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
          <!-- <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on"
                >New Item</v-btn
              >
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Dessert name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.created"
                        label="created"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.email"
                        label="email (g)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.phone"
                        label="phone (g)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.adCount"
                        label="adCount (g)"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog> -->
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
            <v-list-item @click="initDelete(item)">
              <v-list-item-icon>
                <v-icon>fa-trash</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Delete</v-list-item-content>
            </v-list-item>
            <v-list-item link>
              <v-list-item-icon>
                <v-icon>fa-eye</v-icon>
              </v-list-item-icon>
              <v-list-item-content>View</v-list-item-content></v-list-item
            >
            <v-list-item @click="initBlock(item)">
              <v-list-item-icon>
                <v-icon>fa-list-slash</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Block</v-list-item-content>
            </v-list-item>
            <v-list-item link @click="initAdmin(item)">
              <v-list-item-icon>
                <v-icon>fa-list-shield</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Make Admin</v-list-item-content>
            </v-list-item>
            <v-list-item @click="initMail(item)">
              <v-list-item-icon>
                <v-icon>fa-envelope</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Send Mail</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
    <!-- <v-pagination
      v-model="page"
      class="mt-4"
      :length="pageCount"
      @input="fetchData()"
    ></v-pagination> -->

    <!-- <send-mail
      v-if="mailDialog"
      :recipient="currentlist.email"
      @success="mailSuccess"
      @close="mailDialog = false"
    ></send-mail>
    <delete-list
      v-if="deleteDialog"
      :list="currentlist"
      @success="deleteSuccess"
      @close="deleteDialog = false"
    ></delete-list>
    <block-list
      v-if="blockDialog"
      :list="currentlist"
      @success="blockSuccess"
      @close="blockDialog = false"
    ></block-list>
    <make-admin
      v-if="adminDialog"
      :list="currentlist"
      @success="adminSuccess"
      @close="adminDialog = false"
    ></make-admin> -->
    <v-snackbar v-model="successful" top
      >{{ successMessage }}
      <v-spacer></v-spacer>
      <m-btn
        text
        :color="'primary lighten-4'"
        @click="successful = false"
      ></m-btn>
    </v-snackbar>
  </div>
</template>
<script>
// import SendMail from '../../components/admin/SendMail'
// import Deletelist from '../../components/admin/Deletelist'
// import Blocklist from '../../components/admin/Blocklist'
// import MakeAdmin from '../../components/admin/MakeAdmin'
export default {
  layout: "admin",
  components: {
    // SendMail,
    // Deletelist,
    // Blocklist,
    // MakeAdmin
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
      { text: "Creator", value: "user" },
      { text: "Rating", value: "rating" },
      { text: "Popularity", value: "popularity" },
      { text: "Category", value: "category" },
      { text: "No of Items", value: "item_count" },
      { text: "Actions", value: "action", sortable: false, align: "center" }
    ],
    lists: [],
    listTypes: [
      { text: "All lists", value: "all" },
      { text: "Admins", value: "admins" },
      { text: "Blocked lists", value: "blocked" },
      { text: "Active lists", value: "active" }
    ],
    editedIndex: -1,
    show: "all",
    adminDialog: false,
    deleteDialog: false,
    blockDialog: false,
    mailDialog: false,
    currentlist: {},
    fetching: false,
    successful: false,
    successMessage: "Action completed successfully!"
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
        .dispatch("fetch_lists", {
          limit: 20,
          lastDoc: false
        })
        .then(lists => {
          this.lists = lists.map(list => list.data());
        }).catch(_ => {})
    },

    mailSuccess(message) {
      this.successMessage = message;
      this.successful = true;
      this.mailDialog = false;
    },
    initAdmin(list) {
      this.adminDialog = true;
      this.currentlist = list;
    },
    adminSuccess(message) {
      this.successMessage = message;
      this.successful = true;
      this.adminDialog = false;
    },
    initMail(list) {
      this.mailDialog = true;
      this.currentlist = list;
    },
    initDelete(list) {
      this.deleteDialog = true;
      this.currentlist = list;
    },
    deleteSuccess(message) {
      this.successMessage = message;
      this.successful = true;
      this.deleteDialog = false;
    },
    initBlock(list) {
      this.blockDialog = true;
      this.currentlist = list;
    },
    blockSuccess(message) {
      this.successMessage = message;
      this.successful = true;
      this.blockDialog = false;
    },
    fetchData() {
      this.fetching = true;
      const temp = this.lists;
      this.lists = [];
      setTimeout(() => {
        this.lists = temp;
        this.fetching = false;
      }, 3000);
    }
  }
};
</script>
