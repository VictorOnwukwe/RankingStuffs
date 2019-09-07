<template>
    <div class="py-2 gridder">
        <Demanded v-for="(demand, index) in demands" :key="index" :demand="demand"></Demanded>
    </div>
</template>

<script>
import Demanded from "./Demanded";
export default {
    components: {
        Demanded
    },
    data(){
        return {
            demands: {}
        }
    },
    methods: {
        fetchDemands(limit, max){
            this.$store.dispatch("fetch_demanded", {
                limit: limit,
                max: max
            })
            .then(demands => {
                this.demands = demands;
            })
        }
    },
    created(){
        this.fetchDemands(20, 1000000)
    }
}
</script>

<style scoped>
.gridder{
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 0.5em;
}
@media (min-width:700px){
    .gridder{
        grid-template-columns: 1fr 1fr;
        grid-gap: 0.5em;
    }
}
</style>