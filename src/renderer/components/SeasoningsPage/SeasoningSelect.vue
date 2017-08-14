<template>
    <div class="tags">
        <span 
            class="tag" 
            v-for="(seasoning, index) in seasonings" 
            :key="seasoning.name"
            v-on:click="selectSeasoning(index)"
            :class="getClass(index)">{{ seasoning.name }}</span>
    </div>
</template>

<script>
export default {
  props: ['seasonings'],
  methods: {
      selectSeasoning(index) {
          this.seasonings[index].selected = !this.seasonings[index].selected;
      },
      getClass(index) {
          return this.seasonings[index].selected ?
            {'is-primary': true, 'is-medium': true} :
            {};
      }
  }
}
</script>

<style scoped>

</style>
