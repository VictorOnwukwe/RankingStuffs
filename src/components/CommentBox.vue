<template>
  <textarea
    class="text"
    @focus="resize, sendFocused(true)"
    @blur="sendFocused(false)"
    v-model="val"
    :style="computedStyles"
  ></textarea>
</template>

<script>
export default {
  name: "CommentBox",

  created() {
    this.updateVal(); // fill val with initial value passed via the same name prop
  },

  mounted() {
    this.resize(); // perform initial height adjustment
  },

  props: {
    /*
     * Property to accept value from parent
     */
    value: {
      type: [String, Number],
      default: ""
    },

    /*
     * Allow to enable/disable auto resizing dynamically
     */
    autosize: {
      type: Boolean,
      default: true
    },

    /*
     * Min textarea height
     */
    minHeight: {
      type: [Number],
      default: null
    },

    /*
     * Max textarea height
     */
    maxHeight: {
      type: [Number],
      default: null
    },

    /*
     * Force !important for style properties
     */
    important: {
      type: [Boolean, Array],
      default: false
    }
  },

  data() {
    return {
      // data property for v-model binding with real textarea tag
      val: null,
      // works when content height becomes more then value of the maxHeight property
      maxHeightScroll: false
    };
  },

  computed: {
    /*
     */
    computedStyles() {
      let objStyles = {};

      if (this.autosize) {
        objStyles.resize = !this.isResizeImportant ? "none" : "none !important";
        if (!this.maxHeightScroll) {
          objStyles.overflow = !this.isOverflowImportant
            ? "hidden"
            : "hidden !important";
        }
      }

      return objStyles;
    },

    isResizeImportant() {
      const imp = this.important;
      return imp === true || (Array.isArray(imp) && imp.includes("resize"));
    },

    isOverflowImportant() {
      const imp = this.important;
      return imp === true || (Array.isArray(imp) && imp.includes("overflow"));
    },

    isHeightImportant() {
      const imp = this.important;
      return imp === true || (Array.isArray(imp) && imp.includes("height"));
    }
  },

  methods: {
    /*
     * Update local val with prop value
     */
    updateVal() {
      this.val = this.value;
    },

    /*
     * Auto resize textarea by height
     */
    resize: function() {
      const important = this.isHeightImportant ? "important" : undefined;

      this.$el.style.setProperty("height", "auto", important);

      let contentHeight = this.$el.scrollHeight + 1;

      if (this.minHeight) {
        contentHeight =
          contentHeight < this.minHeight ? this.minHeight : contentHeight;
      }

      if (this.maxHeight) {
        if (contentHeight > this.maxHeight) {
          contentHeight = this.maxHeight;
          this.maxHeightScroll = true;
        } else {
          this.maxHeightScroll = false;
        }
      }

      const heightVal = contentHeight + "px";
      this.$el.style.setProperty("height", heightVal, important);
      return this;
    },
    sendFocused(bool) {
      this.$emit("focused", bool);
    }
  },

  watch: {
    /*
     * Update val from prop when changed in parent
     */
    value() {
      this.updateVal();
    },

    /*
     * Emit input event as in https://vuejs.org/v2/guide/components.html#Form-Input-Components-using-Custom-Events
     */
    val(val) {
      this.$nextTick(this.resize);
      this.$emit("input", val);
    }
  }
};
</script>

<style scoped>
.text {
  padding: 0.5em;
  padding-right: 3em;
  width: 100%;
  border-radius: 4px;
  border: 1px solid #cfcdcd;
  transition: all 0.2s ease-in;
  color: black;
}
.text:hover {
  border: 1px solid rgb(90, 90, 90);
}
.text:focus {
  border: 2px solid #cfcdcd;
  outline: none;
  /* box-shadow: 0px 0px 0px 1px var(--brand); */
  /* border-radius: 0.2em; */
  /* box-shadow: 0px 1px 6px gray; */
}
</style>
