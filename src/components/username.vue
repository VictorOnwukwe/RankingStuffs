<template>
  <div>
    <span @click="showUser = true" class="pointer" :class="color">{{
      user.username
    }}</span>
    <v-dialog v-model="showUser" max-width="400px">
      <preview-user @close="showUser = false" :id="user.id"></preview-user>
    </v-dialog>
  </div>
</template>
<script>
import PreviewUser from "../components/PreviewUser";
export default {
  components: {
    PreviewUser
  },
  props: {
    user: Object,
    color: {
      type: String,
      default: "brand--text text--lighten-1"
    }
  },
  data() {
    return {
      showUser: false
    };
  }
};
</script>
