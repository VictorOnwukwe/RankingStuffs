<template>
  <div>
    <v-layout align-center class="ptd">
      <div>
        <span v-if="text" style="font-size:0.9em;display:block;text-align:center" class="font-weight-bold"
          >Sort&nbsp;<span v-if="!subChoice">by</span></span
        >
        <select v-model="choice" @change="sendVal()" class="select-css">
          <option
            :selected="index == 0"
            v-for="(option, index) in options"
            :value="option.value"
            :key="index"
            class="slct"
            >{{ option.label }}</option
          >
        </select>
      </div>
      <div>
        <span v-if="subChoice" style="font-size:0.9em;display:block;text-align:center" class="font-weight-bold"
          >By</span
        >
        <select
          v-if="subChoice"
          v-model="subChoice"
          @change="sendSub()"
          class="select-css"
        >
          <option
            v-for="option in subs"
            :value="option"
            :key="option"
            class="slct"
            >{{ option }}</option
          >
        </select>
      </div>
    </v-layout>
  </div>
</template>
<script>
export default {
  props: {
    options: Array,
    text: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      choice: this.options[0].value,
      subChoice: "",
    };
  },
  methods: {
    sendVal() {
      this.subChoice = this.subs ? this.subs[0] : undefined;
      this.$emit("change", { choice: this.choice, subChoice: this.subChoice });
    },
    sendSub() {
      this.$emit("change", { choice: this.choice, subChoice: this.subChoice });
    },
  },
  computed: {
    subs() {
      return this.options.find((option) => option.value == this.choice).sorts;
    },
  },
  mounted() {
    this.subChoice = this.subs ? this.subs[0] : undefined;
  },
};
</script>
<style scoped>
.select-css {
  display: block;
  font-size: 16px;
  font-family: sans-serif;
  /* font-weight: 600; */
  color: #444;
  line-height: 1.3;
  padding: 0.6em 1.4em 0.5em 0.8em;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: 1px solid #aaa;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  /* background-color: #fff; */
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat, repeat;
  background-position: right 0.7em top 50%, 0 0;
  background-size: 0.65em auto, 100%;
}
.select-css::-ms-expand {
  display: none;
}
.select-css:hover {
  border-color: #888;
}
.select-css:focus {
  border-color: #aaa;
  box-shadow: 0 0 1px 1px var(--brand);
  box-shadow: 0 0 0 3px -moz-mac-focusring;
  color: #222;
  outline: none;
}
.select-css option {
  font-weight: normal;
}
</style>
