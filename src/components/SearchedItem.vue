<template>
  <v-layout
    @click="setInfo"
    align-center
    :class="{ 'lighten-1': index % 2 == 0 }"
  >
    <v-avatar tile size="2.5em" class="mr-1">
      <m-img
        v-if="item && item.image"
        :src="item.image.url.low"
        :width="'2.5em'"
        class="mr-4"
      ></m-img>
      <m-img v-else :width="'2.5em'" class="mr-4"></m-img>
    </v-avatar>
    <div class="pt-1">
      <v-layout>
        <span class="text-capitalize ptd" style="line-height:1em">{{
          rItem.name
        }}</span>
      </v-layout>
      <v-layout>
        <span v-if="item && item.category" class="std caption">{{
          item.category
        }}</span>
      </v-layout>
    </div>
  </v-layout>
</template>
<script>
export default {
  props: {
    rItem: Object,
    index: Number
  },
  data() {
    return {
      item: null,
    };
  },
  methods: {
    setInfo() {
      this.$emit("setInfo", this.item);
    },
  },
  computed: {
    loaded() {
      return this.item && this.item.objectID;
    },
  },
  watch: {
    async rItem(val) {
      if (val.objectID) {
        this.item = await this.$store.dispatch("fetch_item", val.objectID);
      }
    },
  },
  async created() {
    this.item = await this.$store.dispatch("fetch_item", this.rItem.objectID);
  },
};
</script>
