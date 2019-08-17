<template>
    <div>
        <div v-if="lists.length>0">
            <DisplayPreviews :lists="lists"></DisplayPreviews>
        </div>
    </div>
</template>

<script>
import DisplayPreviews from "./DisplayPreviews";
export default {
    components: {
        DisplayPreviews
    },
    data(){
        return {
            lists: []
        }
    },

    methods: {
        fetchLists(timestamp, limit){
            this.$store.dispatch("fetch_latest",{
                timestamp: timestamp,
                limit: limit
            }).then(lists => {
                this.lists = lists;
            })
        }
    },
    created: function(){
        this.fetchLists("now", 20);
    }
}
</script>

<style scoped>

</style>
