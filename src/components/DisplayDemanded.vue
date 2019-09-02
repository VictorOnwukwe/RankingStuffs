<template>
    <div class="py-4">
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

</style>