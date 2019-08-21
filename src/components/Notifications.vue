<template>
    <v-card flat width="80%">
        <v-card-text>
            <Notification></Notification>
            <Notification></Notification>
            <Notification></Notification>
            <Notification></Notification>
        </v-card-text>
    </v-card>
</template>

<script>
import Notification from "./Notification";
export default {
    components: {
        Notification
    }
}
</script>

<style scoped>

</style>