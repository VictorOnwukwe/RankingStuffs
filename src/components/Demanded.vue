<template>
  <div class="main">
    <v-hover v-slot:default="{ hover }">
      <v-card tile class="primary" :elevation="hover ? 4 : 0">
        <v-layout>
          <v-flex>
            <div>
              <v-card-title class="" style>
                <v-layout column>
                  <h2 class="title text-capitalize brand--text" style="line-height: 1.3">{{demand.title}}</h2>
                  <span class="subtitle-2 primary-text-dark mt-2" style>
                    {{waitingMessage}}
                  </span>
                </v-layout>
              </v-card-title>
              <v-card-text style="margin-bottom:1.5em" class="subtitle-1">
                <a
                  class="secondary-text-dark font-weight-bold"
                >{{!demand.anonymous ? demand.creator.username : "anonymous"}}</a>
                <p class="secondary-text-dark" style="font-style:italic">{{demand.comment}}</p>
              </v-card-text>
              <v-layout v-if="hover" style="position:absolute; bottom:16px; right:16px">
                <v-btn
                  v-if="!waiting"
                  @click="joinWaiters()"
                  class="pointer"
                  small
                  color="brand"
                  outlined
                >Queue</v-btn>
                <!-- <v-btn v-else small color="brand" outlined>Queueing</v-btn> -->
                <v-btn @click="create()" class="pointer ml-2" color="brand white--text" small>Create</v-btn>
              </v-layout>
            </div>
          </v-flex>
        </v-layout>
      </v-card>
    </v-hover>
    <v-dialog></v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    demand: Object
  },
  data() {
    return {
      waiting: false
    };
  },
  methods: {
    create() {
      this.$router.push({
        path: "/create",
        query: { demanded: true, id: this.demand.id, title: this.demand.title }
      });
    },
    joinWaiters() {
      this.$store.dispatch("join_demanders", this.demand.id).then(() => {
        this.demand.waiters_count++;
        this.waiting = true;
      });
    },
    setWaiting() {
      this.$store.dispatch("checkWaiting", this.demand.id).then(result => {
        this.waiting = result;
      });
    }
  },
  computed: {
    waitingMessage(){
      if(this.waiting){
        if(this.demand.waiters_count > 1){
          if(this.demand.waiters_count > 2){
            return "You and " + (this.demand.waiters_count - 1) + " other people are waiting for this list";
          }else{
            return "You and 1 other person is waiting for this list";
          }
        }else{
          return "You are waiting for this list";
        }
      }else{
        if(this.demand.waiters_count === 1){
          return "1 person is waiting for this list";
        }else{
          return this.demand.waiters_count + " people are waiting for this list"
        }
      }
    }
  },
  created() {
    this.setWaiting();
  }
};
</script>

<style scoped>
p {
  line-height: 1.2em;
}
.main{}
</style>