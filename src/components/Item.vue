<template>
    <v-card class="pa-4">
        <v-layout column>
            <v-flex>
                <v-img width="200px" aspect-ratio="1"></v-img>
            </v-flex>
            <v-flex>
                <p class="title blue--text">Eminem</p>
                <span>Rapper</span>
                <p class="grey--text text--darken-2">The item has been a great influence in the history of items. Diligently fulfilled all its duties</p>
            </v-flex>
        </v-layout>
    </v-card>
</template>

<script>
export default {
    data(){
        return{
            item: {}
        }
    },
    computed: {
        itemID(){
            return this.$route.params.id;
        }
    },
    async created(){
        this.$store.dispatch("fetch_item", itemID, true)
        .then(item => {
            this.item = item;
        })
    }
}
</script>

<style scoped>

</style>