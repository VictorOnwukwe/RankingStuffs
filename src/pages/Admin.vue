<template>
  <div>
    <v-row :column="$vuetify.breakpoint.smAndDown">
      <v-flex shrink>
        <v-navigation-drawer permanent class="mr-2">
          <v-list dense>
            <v-list-item exact to="/admin">
              <v-list-item-icon>
                <v-icon>$vuetify.icons.list-approved</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Pending Lists</v-list-item-content>
            </v-list-item>
            <v-list-item to="/admin/pending-demands">
              <v-list-item-icon>
                <v-icon>$vuetify.icons.demand</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Pending Demands</v-list-item-content>
            </v-list-item>
            <v-list-item to="/admin/pending-list-items">
              <v-list-item-icon>
                <v-icon>$vuetify.icons.item-approved</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Pending List Items</v-list-item-content>
            </v-list-item>
            <v-list-item to="/admin/pending-item-images">
              <v-list-item-icon>
                <v-icon>$vuetify.icons.item-image-approved</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Pending Item Images</v-list-item-content>
            </v-list-item>
            <v-list-item to="/admin/pending-item-infos">
              <v-list-item-icon>
                <v-icon>$vuetify.icons.item-info-approved</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Pending Item Infos</v-list-item-content>
            </v-list-item>
            <v-list-item to="/admin/lists">
              <v-list-item-icon>
                <v-icon>$vuetify.icons.list-approved</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Lists</v-list-item-content>
            </v-list-item>
            <v-list-item to="/admin/flagged">
              <v-list-item-icon>
                <v-icon>$vuetify.icons.flag</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Flagged</v-list-item-content>
            </v-list-item>
          </v-list>

          <v-btn
            :loading="categorizing"
            class="my-4 ml-4"
            @click="categorize()"
            disabled
            >Categorize</v-btn
          >
          <v-btn
            :loading="populating"
            class="my-4 ml-4"
            @click="populate()"
            disabled
            >Populate</v-btn
          >
          <v-btn
            :loading="populating"
            class="my-4 ml-4"
            @click="setVotes()"
            disabled
            >Set Votes</v-btn
          >
        </v-navigation-drawer>
      </v-flex>
      <v-flex grow>
        <v-card flat>
          <router-view></router-view>
        </v-card>
      </v-flex>
    </v-row>
  </div>
</template>
<script>
import categories from "../my-modules/js/categories";
export default {
  data() {
    return {
      categorizing: false,
      populating: false
    };
  },
  methods: {
    categorize() {
      this.categorizing = true;
      this.$store.dispatch("upload_categories", categories).then(() => {
        this.categorizing = false;
      });
    },
    populate() {
      this.populating = true;
      this.$store.dispatch("populateAlgolia", categories).then(() => {
        this.populating = false;
      });
    },
    setVotes(){
      this.$store.dispatch("set_votes");
    }
  }
};
</script>
