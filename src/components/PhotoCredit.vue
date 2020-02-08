<template>
  <v-menu absolute offset-y open-on-click>
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <slot />
      </div>
    </template>
    <div class="tip pa-2 white--text">
      Photo by
      <a :href="credit.creator.link" class="white--text">{{
        credit.creator.name
      }}</a>
      on
      <a :href="credit.imageLink" class="white--text">unsplash</a>
    </div>
  </v-menu>
</template>
<script>
export default {
  props: {
    credit: Object
  }
};
</script>
<style scoped>
.tip {
  background-color: rgba(36, 39, 41, 0.8);
  font-size: 0.8em;
}
</style>
