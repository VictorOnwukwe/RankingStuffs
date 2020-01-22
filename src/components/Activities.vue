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
      <v-icon v-else-if="!complete" size="32" @click="fetchMoreActivities(20)"
        >mdi-plus-circle-outline</v-icon
      >
      <div v-else-if="complete && activities.length > 0" class="htd">
        No more Activities
      </div>
      <empty
        v-else
        :message="'No Activities'"
        :height="'13em'"
        :icon="'fa-list-alt'"
      ></empty>
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
      fetching: false,
      complete: false
    };
  },
  methods: {
    fetchActivities(limit) {
      this.fetching = true;
      this.$store
        .dispatch("fetch_user_activities", {
          user: this.user,
          limit: limit
        })
        .then(activities => {
          this.activities = this.activities.concat(activities);
          this.fetching = false;
          if (activities.length < limit) {
            this.complete = true;
          }
        }).catch(_ => {
          this.fetching = false;
        })
    },
    fetchMoreActivities(limit) {
      this.fetching = true;
      this.$store
        .dispatch("fetch_user_activities", {
          lastDoc: this.activities[this.activities.length - 1],
          user: this.user,
          limit: limit
        })
        .then(activities => {
          this.activities = this.activities.concat(activities);
          this.fetching = false;
          if (activities.length < limit) {
            this.complete = true;
          }
        }).catch(_ => {
          this.fetching = false;
        })
    }
  },
  created() {
    this.fetchActivities(20);
  }
};
</script>
