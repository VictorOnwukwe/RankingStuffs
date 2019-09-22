<template>
  <v-card @click="goNotification()" tile outlined flat width="100%" class="pa-2 blue lighten-4">
    <v-card-text>
      <v-layout>
        <v-flex>
          <span>{{notification.message}}</span>
        </v-flex>
        <v-flex shrink>
          <v-layout style="width:30px" class="primary-text-dark" justify-end>{{created}}</v-layout>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
const moment = require("moment");
import convertMoment from "../../public/my-modules/convertMoment";
export default {
  props: {
    notification: Object
  },
  data() {
    return {};
  },
  methods: {
    goNotification() {
      switch (this.notification.type) {
        case "reply":
          this.$router.push({
            path: "/lists/" + this.notification.list_id,
            query: {
              notification: true,
              item_id: this.notification.item_id
            }
          });
          break;

        case "follow":
          this.$router.push({
            path: "/" + this.notification.user + "/profile"
          });
          break;

        case "demand-created":
          this.$router.push({
            path: "/lists/" + this.notification.list_id
          });
          break;
      }
    }
  },
  computed: {
    created() {
      return convertMoment.getShortTime(this.notification.created);
    }
  },
  created(){
    
  }
};
</script>

<style scoped>
</style>