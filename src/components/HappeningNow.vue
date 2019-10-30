<template>
  <v-list>
    <happening-event v-for="(event, index) in happenings" :key="index" :event="event.data()"></happening-event>
  </v-list>
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
      happenings: []
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
        firebase.firestore().collection("happening").doc("data").collection("collection").orderBy("created", "desc").limit(10).get().then(query => {
          // console.log(query.docs);
          this.updateHappenings(query.docs);
        })
      });
  },
  beforeDestroy(){
    firebase
      .firestore()
      .collection("happening")
      .doc("data")
      .onSnapshot({ includeMetadataChanges: true }, doc => {
        console.log("left");
      });
  }
};
</script>