<template>
    <div>
        <PreviewList
            v-for="list in lists"
            :key="list.id"
            :list="list"
        ></PreviewList>
    </div>
</template>

<script>
import PreviewList from "./PreviewList";
export default {
    components: {
        PreviewList
    },
    data(){
        return {
            lists: []
        }
    },

    methods: {
        fetchLists(timestamp){
            this.$store.dispatch("fetch_latest",timestamp).then(lists => {
                this.lists = lists;
            })
        }
    },
    created: function(){
        this.fetchLists("now");
    }
}
</script>

<style scoped>

</style>
