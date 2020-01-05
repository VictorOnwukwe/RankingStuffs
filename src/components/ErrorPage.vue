<template>
  <div>
    <v-layout style="height:80vh" justify-center align-center>
      <v-layout align-center column>
        <v-icon size="5em" color="grey lighten-1">far fa-frown</v-icon>
        <div class="htd mt-2">Sorry... An error occured</div>
        <div class="mt-8">
          Check your internet connection and
          <a @click="retry()" class="underline">Try again</a>
        </div>
      </v-layout>
    </v-layout>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    retry() {
      this.$router.go(-1);
    }
  }
};
</script>
