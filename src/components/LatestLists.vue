<template>
    <div>
        <div style="max-width:1000px" class="mx-auto">
        <div class="page-title">Latest Lists</div>
        <div v-if="lists.length>0">
            <display-lists :lists="lists"></display-lists>
        </div>
        </div>
    </div>
</template>

<script>
export default {
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
