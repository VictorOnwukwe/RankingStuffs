<template>
  <div>
    <v-layout>
      <v-flex shrink>
        <v-navigation-drawer permanent class="mr-2">
          <v-list dense>
            <v-list-item exact to="/admin">
              <v-list-item-icon>
                <v-icon>fa-flag</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Pending Lists</v-list-item-content>
            </v-list-item>
            <v-list-item to="/admin/pending-demands">
              <v-list-item-icon>
                <v-icon>fa-flag</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Pending Demands</v-list-item-content>
            </v-list-item>
            <v-list-item to="/admin/pending-list-items">
              <v-list-item-icon>
                <v-icon>fa-flag</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Pending List Items</v-list-item-content>
            </v-list-item>
            <v-list-item to="/admin/pending-item-images">
              <v-list-item-icon>
                <v-icon>fa-list-alt</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Item Images</v-list-item-content>
            </v-list-item>
            <v-list-item to="/admin/lists">
              <v-list-item-icon>
                <v-icon>fa-list-alt</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Lists</v-list-item-content>
            </v-list-item>
            <v-list-item to="/admin/pending-item-infos">
              <v-list-item-icon>
                <v-icon>fa-user</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Item Infos</v-list-item-content>
            </v-list-item>
            <v-list-item to="/admin/flagged">
              <v-list-item-icon>
                <v-icon>fa-flag</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Flagged</v-list-item-content>
            </v-list-item>
          </v-list>

          <v-btn :loading="categorizing" class="mt-4 ml-4" @click="categorize()"
            >Categorize</v-btn
          >
        </v-navigation-drawer>
      </v-flex>
      <v-flex grow>
        <v-card flat>
          <router-view></router-view>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
import categories from "../../public/my-modules/categories";
export default {
  data() {
    return {
      categorizing: false
    };
  },
  methods: {
    categorize() {
      this.categorizing = true;
      this.$store.dispatch("upload_categories", categories).then(() => {
        this.categorizing = false;
      });
    }
  }
};
</script>
