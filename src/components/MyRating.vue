<template>
  <v-rating
    v-model="rating"
    :color="color"
    :background-color="backgroundColor"
    :half-increments="halfIncrements"
    :size="size"
    full-icon="fa-star"
    half-icon="fa-star-half-alt"
    empty-icon="fa-star"
    :dense="dense"
    :hover="!readOnly"
    :readonly="readOnly"
    @input="rate()"
  ></v-rating>
</template>

<script>
export default {
    props: {
        readonly: {
            type: Boolean,
            default: true
        },
        size: {
            type: Number|String,
            default: "1em"
        },
        value: {
            type: Number,
            default: 0
        },
        dense: {
            type: Boolean,
            default: true
        },
        halfIncrements: {
            type: Boolean,
            default: true
        },
        color:{
            type: String,
            default: "yellow darken-4"
        },
        backgroundColor: {
            type: String,
            default: "grey"
        },
    },
    data() {
        return {
            rating: this.value,
            readOnly: this.readonly
        }
    },
    methods: {
        rate(){
            this.$emit('input', this.rating);
            console.log("here");
            this.readOnly = true;
        }
    }
};
</script>