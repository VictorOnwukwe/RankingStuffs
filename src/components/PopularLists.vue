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
import PreviewList from './PreviewList';
export default {
    components: {
        PreviewList
    },
    data(){
        return{
            lists: []
        }
    },
    computed: {
        
    },
    created: function(){
        this.$store.dispatch("fetch_popular").then(lists => {
            this.lists = lists;
        })
    }
}
</script>

<style scoped>

</style>
