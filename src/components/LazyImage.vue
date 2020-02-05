<template>
  <v-img :src="srcUrl" />
</template>

<script>
export default {
  data: () => ({ 
    observer: null, 
    intersected: false,
    my_url: "https://myurl.com"
  }),
  computed: {
    srcUrl() {
      return this.intersected ? this.my_url : '';
    }
  },
  mounted() {
    this.observer = new IntersectionObserver(entries => {
      const image = entries[0];
      if (image.isIntersecting) {
        this.intersected = true;
        this.observer.disconnect();
      }
    });

    this.observer.observe(this.$el);
  },
  destroyed() {
    this.observer.disconnect();
  }
}
</script>
