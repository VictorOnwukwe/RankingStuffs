<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="elements"
      sort-by="created"
      class="elevation-1"
      :loading="fetching"
    >
      <template v-slot:top>
        <v-toolbar class="mb-6" flat color="white">
          <v-toolbar-title class="font-weight-bold primary--text"
            >FLAGGED</v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-col cols="4">
            <v-select
              v-model="show"
              class="mt-9"
              outlined
              max-width="200px"
              label="Show"
              :items="elementTypes"
              item-text="text"
              @change="fetchElements()"
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

    <view-flagged
      v-if="view"
      :element="currentElement"
      @close="view = false"
    ></view-flagged>
  </div>
</template>
<script>
import ViewFlagged from "../components/ViewFlagged";
export default {
  components: {
    ViewFlagged
  },
  data() {
    return {
      elements: [],
      headers: [
        {
          text: "Type",
          value: "type"
        },
        { text: "Created", value: "created" },
        { text: "Action", value: "action", sortable: false, align: "center" }
      ],
      fetching: false,
      elementTypes: [
        { value: "all", text: "All" },
        { value: "comment", text: "Comments" },
        { value: "list", text: "Lists" },
        { value: "item", text: "Items" },
        { value: "item-detail", text: "Item Details" },
        { value: "reply", text: "Replies" },
        { value: "image", text: "Images" }
      ],
      show: "all",
      currentElement: {},
      view: false,
      lastDoc: undefined
    };
  },
  methods: {
    fetchElements() {
      this.fetching = true;
      this.$store
        .dispatch("fetch_flagged", { limit: 20, sort: this.show })
        .then(elements => {
          this.lastDoc = elements[elements.length - 1];
          this.elements = elements.map(element => {
            return {
              id: element.id,
              ...element.data()
            };
          });
          this.fetching = false;
        }).catch(_ => {
          this.fetching = false;
        })
    },
    initView(item) {
      this.currentElement = item;
      this.view = true;
    },
    fetchMore() {
      this.fetching = true;
      this.$store
        .dispatch("fetch_flagged", {
          limit: 20,
          sort: this.show,
          lastDoc: this.lastDoc
        })
        .then(elements => {
          this.lastDoc = elements[elements.length - 1];
          this.elements = this.elements.concat(
            elements.map(element => {
              return {
                id: element.id,
                ...element.data()
              };
            })
          );
          this.fetching = false;
        }).catch(_ => {
          this.fetching = false;
        })
    }
  },
  created() {
    this.fetchElements();
  }
};
</script>
