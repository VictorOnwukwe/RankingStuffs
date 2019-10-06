<template>
    <v-btn :color="color" :dark="dark" :disabled="disabled" :loading="loading" :outlined="outlined" :depressed="depressed">{{text}}</v-btn>
</template>

<script>
export default {
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        text: {
            type: String,
            default: ""
        },
        color: {
            type: String,
            default: "brand darken-1"
        },
        dark: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        outlined: {
            type: Boolean,
            default: false
        },
        depressed: {
            type: Boolean,
            default: false
        }
    }
}
</script>