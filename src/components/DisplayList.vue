<template>
    <div>
        <div id="container">
            <h2>{{list.title}}</h2>

            <p>{{list.created.toDate()}}</p>

            <Item
                v-for="item in list.items"
                :key="item.id"
                :item="item"
                :list_id="list.id"
            ></Item>
        </div>
    </div>
</template>

<script>
import { setTimeout } from 'timers';
import Item from './Item';

export default {
    components: {
        Item
    },
    data(){
        return{
            index: null,
        }
    },

    methods: {
        fetchList(){

        }
    },

    computed: {
        listID(){
            return this.$route.params.id;
        },
        getDate(){
            return this.list.created.toDate();
        },
        list(){
            return this.$store.state.lists[0];
        }
    },

    mounted: async function(){
        let id = await this.$route.params.id;

        let index = await this.$store.state.lists.findIndex(list => list.id == id);

        this.$store.dispatch("fetch_complete_list", id);

        // if(index>=0){
        //     this.list = await this.$store.state.lists[index];
        //     this.gotList = true;
        // }else{
        //     await this.$store.dispatch("fetch_complete_list", id).then(async () => {
        //         this.list = await this.$store.state.lists[this.$store.state.lists.length - 1];
        //         this.gotList = true;
        //     })
            
        // }
    },

}
</script>

<style scoped>
#container{
    max-width: 800px;
    margin: 0 auto;
}
#item{
    margin-top: 2em;
}
</style>
