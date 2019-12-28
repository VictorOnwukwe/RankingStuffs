<template>
  <div>
    <v-list class="mt-4 px-2">
      <div v-for="(activity, index) in activities" :key="index">
        <activity
          :activity="{ id: activity.id, ...activity.data() }"
          :isProfile="isProfile"
          :user="user"
          :index="index"
        ></activity>
      </div>
    </v-list>
    <v-layout justify-center>
      <m-progress v-if="fetching"></m-progress>
    </v-layout>
  </div>
</template>

<script>
import Activity from "./Activity";
export default {
  components: {
    Activity
  },
  props: {
    isProfile: Boolean,
    user: Object
  },
  data() {
    return {
      activities: [],
      fetching: false
    };
  },
  methods: {
    fetchActivities() {
      this.fetching = true;
      this.$store
        .dispatch("fetch_user_activities", {
          timestamp: "now",
          user: this.user
        })
        .then(activities => {
          this.activities = this.activities.concat(activities);
          this.fetching = false;
        });
    },
    fetchMoreActivities() {
      this.$store
        .dispatch("fetch_user_activities", {
          timestamp: this.activities[this.activities.length - 1].created,
          user: this.user
        })
        .then(activities => {
          this.activities = this.activities.concat(activities);
        });
    }
  },
  created() {
    this.fetchActivities();
  }
};
</script>
