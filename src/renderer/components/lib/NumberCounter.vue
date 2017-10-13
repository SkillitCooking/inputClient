<template>
  <div class="tags has-addons">
    <span class="tag is-white">{{count}}</span>
    <span class="tag is-info" v-on:click="increment()">+</span>
    <span class="tag is-success" v-on:click="decrement()">-</span>
  </div>
</template>

<script>
export default {
    props: ['count', 'suffix'],
    methods: {
        increment() {
            this.$emit('increment-' + this.suffix);
        },
        decrement() {
            this.$emit('decrement-' + this.suffix);
        }
    }
}
</script>

<style scoped>

</style>
