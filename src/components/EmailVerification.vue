<template>
  <div class="mt-10">
    <h3 style="margin-bottom: 50vh">
      <span class="accent--text">Congratulations!!!</span> Your account has been
      verified. Click <router-link :to="'/'">here</router-link> to go home...
    </h3>
  </div>
</template>
<script>
export default {
  computed: {
    valid() {
      return this.$route.query.mode || false;
    },
  },
  mounted() {
    
  },
};
</script>
