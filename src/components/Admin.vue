<template>
  <div>
    <v-row>
      <v-flex shrink>
        <v-navigation-drawer permanent dark class="mr-2">
          <v-list dense>
            <v-list-item to="/admin/pending-lists">
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
              <v-list-item-content>Pending Items</v-list-item-content>
            </v-list-item>
            <v-list-item @click="">
              <v-list-item-icon>
                <v-icon>fa-list-alt</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Lists</v-list-item-content>
            </v-list-item>
            <v-list-item @click="">
              <v-list-item-icon>
                <v-icon>fa-list-alt</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Items</v-list-item-content>
            </v-list-item>
            <v-list-item @click="">
              <v-list-item-icon>
                <v-icon>fa-user</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Users</v-list-item-content>
            </v-list-item>
            <v-list-item to="/admin/flagged">
              <v-list-item-icon>
                <v-icon>fa-flag</v-icon>
              </v-list-item-icon>
              <v-list-item-content>Flagged</v-list-item-content>
            </v-list-item>
          </v-list>
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
export default {};
</script>
