<template>
    <div>
        <div>
            <a @click="goList()" class="links" style="color:var(--dark-text)"><h3>{{list.title}}</h3></a>
            <p>{{creationDate}}</p>
        </div>
    </div>
</template>

<script>
let moment = require("moment");

export default {
    props:{
        list: Object
    },
    methods: {
        goList(){
            this.$router.push({path: "/lists/"+this.list.id});
        }
    },
    computed: {
        creationDate(){
            let time = moment(this.list.created.toDate()).fromNow();
            return time.slice(0, time.indexOf(" ")+2).replace(/\s/g, '');
        }
    }
}
</script>

<style scoped>

</style>
