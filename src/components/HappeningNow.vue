<template>
  <div>
    <v-list v-if="fetched" class="mt-2">
      <happening-event
        v-for="(event, index) in happenings"
        :key="index"
        :event="event.data()"
        :index="index"
      ></happening-event>
    </v-list>
    <v-layout v-else justify-center class="py-4">
      <m-progress></m-progress>
    </v-layout>
  </div>
</template>

<script>
import firebase, { firestore } from "firebase/app";
import "firebase/firestore";
import HappeningEvent from "./HappeningEvent";
export default {
  components: {
    HappeningEvent
  },
  data() {
    return {
      happenings: [],
      fetched: false
    };
  },
  methods: {
    updateHappenings(docs) {
      this.happenings = docs;
    }
  },
  mounted() {
    firebase
      .firestore()
      .collection("happening")
      .doc("data")
      .onSnapshot({ includeMetadataChanges: true }, doc => {
        firebase
          .firestore()
          .collection("happening")
          .doc("data")
          .collection("collection")
          .orderBy("created", "desc")
          .limit(5)
          .get()
          .then(query => {
            this.fetched = true;
            this.updateHappenings(query.docs);
          });
      });
  },
  beforeDestroy() {
    firebase
      .firestore()
      .collection("happening")
      .doc("data")
      .onSnapshot({ includeMetadataChanges: true }, doc => {});
  }
};
</script>
