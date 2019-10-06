<template>
  <v-list-item v-if="list" link :key="index" @click="go('/lists/' + list.id)">
    <v-list-item-avatar size="80" v-if="list.preview_image" tile>
      <v-img :src="list.preview_image.url"></v-img>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title class="text-capitalize brand--text">{{list.title}}</v-list-item-title>
      <v-list-item-subtitle>{{created(list.created)}}</v-list-item-subtitle>
      <v-list-item-subtitle>
        <rating :value="list.rating" :size="'0.9em'"></rating>
      </v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
    props: {
        id: String
    },
    data(){
        return {
            list: null
        }
    },
    created(){
        this.$store.dispatch("fetch_list", this.id).then(list => {
            this.list = list;
        })
    }
};
</script>