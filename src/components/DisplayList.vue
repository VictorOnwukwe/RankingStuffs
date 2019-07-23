<template>
    <div>
        <div id="container">
            <label for="title">Title</label>
            <h2>{{list.title}}</h2>

            <p>{{list.created.toDate()}}</p>

            <div
                v-for="item in list.items"
                :key="item.id"
                id="item"
            >
                <p>{{item.title}}</p>
                <img :src="item.image" style="height:200px;width:150px">
                <p>{{item.about}}</p>
                <p>{{item.votes}}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            index: null
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
            return this.$store.state.lists[this.index];
        }
    },

    created: async function(){
        let id = this.$route.params.id;

        let index = this.$store.state.lists.findIndex(list => list.id == id)

        if(index>=0){
            this.index = index;
            console.log("In Store!")
        }else{
            this.$store.dispatch("fetch_complete_list", id).then(() => {
                this.index = this.$store.state.lists.length - 1;
            })
        }
    }
}
</script>

<style scoped>
#container{
    max-width: 400px;
    margin: 0 auto;
}
#item{
    margin-top: 2em;
}
</style>
