<template>
    <v-toolbar
        dark
        color="green"
        class="darken-4"
        fixed
    >
    <v-layout>
        <h1>TOP10 NAIJA</h1>
    </v-layout>
    <v-spacer></v-spacer>

    <v-layout justify-start>
        <v-btn class="toolbarButton" color="#1B5E20">All Lists</v-btn>
        <v-btn class="toolbarButton" color="#1B5E20">Newest</v-btn>
        <v-btn class="toolbarButton" color="#1B5E20">Add Lists</v-btn>
    </v-layout>
    <v-spacer></v-spacer>
    <v-layout>
        <v-text-field></v-text-field>
    </v-layout>
    </v-toolbar>
</template>

<script>
export default {
    
}
</script>

<style scoped>

.toolbarButton{
    margin: 0px;
    height: 80px;
}

</style>