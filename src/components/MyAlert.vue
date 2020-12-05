<template>
  <v-alert
    transition="scale-transition"
    :value="value"
    :color="type"
    border="left"
    dense
    text
  >
    <v-row align="center">
      <v-col class="shrink mb-auto">
        <v-icon
          :color="type"
          :style="{ transform: bigIcon ? 'scale(1.5)' : '' }"
          >{{ computedIcon }}</v-icon
        >
      </v-col>
      <v-col class="grow">{{ message }}</v-col>
      <v-col class="shrink" v-if="action">
        <m-btn small @click="act()" outlined :color="type">{{ action }}</m-btn>
      </v-col>
    </v-row>
  </v-alert>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: "...",
    },
    type: {
      type: String,
      default: "success",
    },
    action: {
      type: String | Boolean,
      default: "OK",
    },
    value: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String | Boolean,
      default: false,
    },
    bigIcon: Boolean,
  },
  methods: {
    act() {
      this.$emit("act");
    },
  },
  computed: {
    computedIcon() {
      if (this.icon) return this.icon;
      else {
        let t = this.type;
        if (t == "success") return "fa-check-circle";
        else if (t == "error") return "fa-times-circle";
        else if (t == "info") return "fa-exclamation-circle";
        else if (t == "warning") return "fa-exclamation-triangle";
        else if (t == "question") return "fa-question-circle";
        else return "";
      }
    },
  },
};
</script>
