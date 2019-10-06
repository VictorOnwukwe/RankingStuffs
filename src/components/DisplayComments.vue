<template>
    <v-card flat tile>
        <comment v-for="comment in comments" :comment="comment" :key="comment.id" :list="list" :item="item"></comment>
    </v-card>
</template>

<script>
import comment from "./comment";
export default {
    components: {
        comment
    },
    props: {
        comments: Array,
        list: Object,
        item: Object
    }
}
</script>