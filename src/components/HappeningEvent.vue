<template>
  <v-list-item v-if="event" :class="index%2 == 0 ? 'grey lighten-4' : null">
    <v-list-item-content v-if="event.type == 'list'">
      <v-list-item-title class="text-wrap">
        New List Created:
        <span
          class="link--text font-weight-medium pointer text-capitalize"
          @click="go('/lists/' + event.list.id)"
          >{{ event.list.title }}</span
        >
      </v-list-item-title>
    </v-list-item-content>
    <v-list-item-content v-if="event.type == 'comment'">
      <v-list-item-title class="text-wrap">
        New comment on
        <span class="font-weight-medium text-capitalize pointer">{{
          event.item.name
        }}</span>
        on the list of
        <span
          class="font-weight-medium text-capitalize link--text pointer"
          @click="go('/lists/' + event.list.id)"
          >{{ event.list.title }}</span
        >
      </v-list-item-title>
      <v-list-item-title class="italic text-wrap"
        >"{{ event.comment }}"</v-list-item-title
      >
    </v-list-item-content>
    <v-list-item-content v-if="event.type == 'vote'">
      <v-list-item-title class="text-wrap">
        Vote Cast for
        <span class="font-weight-medium pointer text-capitalize">{{ event.item.name }}</span> on
        the list of
        <span class="link--text font-weight-medium pointer text-capitalize">{{
          event.list.title
        }}</span>
      </v-list-item-title>
    </v-list-item-content>
    <v-list-item-content v-if="event.type == 'item'">
      <v-list-item-title class="text-wrap">
        New Item added to the list of
        <span
          class="link--text font-weight-medium pointer text-capitalize"
          @click="go('/lists/' + event.list.id)"
          >{{ event.list.title }}</span
        >
      </v-list-item-title>
    </v-list-item-content>
    <v-list-item-content v-if="event.type == 'rate'">
      <v-list-item-title class="text-wrap">
        New Rating for
        <span
          class="link--text font-weight-medium pointer text-capitalize"
          @click="go('/lists/' + event.list.id)"
          >{{ event.list.title }}</span
        >
        <rating :size="'0.8em'" :rating="event.rating" :ratersCount="event.raters_count"></rating>
      </v-list-item-title>
    </v-list-item-content>
    <v-list-item-content v-if="event.type == 'demand'">
      <v-list-item-title class="text-wrap">
        New Demand for
        <span
          class="link--text font-weight-medium pointer text-capitalize"
          @click="go('/lists/' + event.list.id)"
          >{{ event.demand.title }}</span
        >
      </v-list-item-title>
    </v-list-item-content>
    <v-list-item-content v-if="event.type == 'item-update'">
      <v-list-item-title class="text-wrap">
        Item
        <span
          class="font-weight-medium pointer text-capitalize"
          @click="go('/lists/' + event.list.id)"
          >{{ event.item.name }}</span
        >
        updated
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  props: {
    event: {
      type: Object,
      default: undefined
    },
    index: Number
  },
  data() {
    return {};
  },
  methods: {
    go(val) {
      this.$router.push({ path: val });
    }
  },
  computed: {},
  mounted() {
    // console.log(this.event);
  }
};
</script>

<style scoped>
.medium {
}
*>*{
  /* font-size: 1em !important; */
}
</style>
