<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="demands"
      sort-by="created"
      class="elevation-1"
      :loading="fetching"
    >
      <template v-slot:top>
        <v-toolbar class="mb-6" flat color="white">
          <v-toolbar-title class="font-weight-bold primary--text"
            >Demands</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-col cols="4">
            <v-select
              v-model="show"
              class="mt-9"
              outlined
              max-width="200px"
              label="Show"
              :items="demandTypes"
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
    <view-demand
      v-if="viewDialog"
      @close="viewDialog = false"
      @deleteCurrent="deleteDemand(currentDemand.id)"
      :demand="currentDemand"
    ></view-demand>
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
import ViewPendingDemand from "../components/ViewPendingDemand";
export default {
  layout: "admin",
  components: {
    "view-demand": ViewPendingDemand,
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
        value: "title",
      },
      { text: "Creator", value: "user.username" },
      { text: "Category", value: "category" },
      { text: "Actions", value: "action", sortable: false, align: "center" },
    ],
    demands: [],
    demandTypes: [
      { text: "All demands", value: "all" },
      { text: "Admins", value: "admins" },
      { text: "Blocked demands", value: "blocked" },
      { text: "Active demands", value: "active" },
    ],
    show: "all",
    adminDialog: false,
    deleteDialog: false,
    blockDialog: false,
    mailDialog: false,
    currentDemand: {},
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
        .dispatch("fetch_pending_demands", {
          limit: 50,
          lastDoc: false,
        })
        .then((demands) => {
          this.demands = demands.map((demand) => {
            return {
              id: demand.id,
              ...demand.data(),
            };
          });
          this.fetching = false;
        });
    },
    initView(demand) {
      this.currentDemand = demand;
      this.viewDialog = true;
    },
    deleteDemand(id) {
      this.deleting = true;
      this.$store
        .dispatch("delete_pending_demand", id)
        .then(() => {
          const index = this.demands.indexOf((d) => d.id === id);
          this.demands.splice(index, 1);
          this.deleting = false;
        })
        .catch((_) => {
          this.deleting = false;
        });
    },
  },
};
</script>
