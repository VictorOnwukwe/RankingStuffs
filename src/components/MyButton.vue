<template>
  <v-btn
    :color="color"
    :block="block"
    :small="small"
    :dark="dark"
    :disabled="disabled"
    :loading="loading"
    :outlined="outlined"
    :depressed="depressed"
    :rounded="rounded"
    @click="click()"
    :text="text"
    :fab="fab"
  >
    <slot></slot>
  </v-btn>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    text: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: "accent"
    },
    dark: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    depressed: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },
    block: {
        type: Boolean,
        default: false
    },
    small: {
        type: Boolean,
        default: false
    },
    fab: {
        type: Boolean,
        default: false
    }
  },
  methods: {
    click() {
      this.$emit("click");
    }
  }
};
</script>
