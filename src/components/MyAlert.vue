<template>
  <v-alert
    :icon="icon"
    transition="scale-transition"
    :value="value"
    :color="type"
    border="left"
    dense
    text
  >
    <v-row align="center">
      <v-col class="grow">{{message}}</v-col>
      <v-col class="shrink">
        <v-btn small @click="act()" outlined :color="type">{{action}}</v-btn>
      </v-col>
    </v-row>
  </v-alert>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: "..."
    },
    type: {
      type: String,
      default: "success"
    },
    action: {
        type: String,
        default: "OK"
    },
    value: {
        type: Boolean,
        default: false
    }
  },
  data(){
      return {
          icon: "fa-check-circle"
      }
  },
  methods: {
    setup() {
      switch (this.type) {
        case "success":
          this.icon = "fa-check-circle";
          break;
        case "error":
          this.icon = "fa-times-circle";
          break;
        case "info":
          this.icon = "fa-exclamation-circle";
          break;
        case "warning":
          this.icon = "fa-exclamation-triangle";
          break;
        case "question":
          this.icon = "fa-question-circle";
          break;
      }
    },
    act(){
        this.$emit("act");
    }
  },
  mounted(){
      this.setup()
  }
};
</script>