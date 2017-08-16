<template>
    <div>
        <div v-if="canBeOptional" class="field is-grouped is-grouped-multiline">
            <div v-for="(item, index) in items"
                class="control"
                :key="item.id">
                <div class="tags has-addons">
                    <span class="tag"
                         v-on:click="selectItem(index)"
                        :class="getItemClass(index)">
                        {{item.name}}</span>
                    <span class="tag"
                        v-if="isSelected(index)"
                        v-on:click="toggleOptional(index)"
                        :class="getOptionalClass(index)">
                        {{getOptionalText(index)}}</span>
                </div>
            </div>
        </div>
        <div v-else class="tags">
            <span 
                class="tag" 
                v-for="(item, index) in items" 
                :key="item.id"
                v-on:click="selectItem(index)"
                :class="getItemClass(index)">{{ item.name }}</span>
        </div>
    </div>
</template>

<script>
export default {
  props: ['items', 'canBeOptional'],
  methods: {
      selectItem(index) {
          this.items[index].selected = !this.items[index].selected;
      },
      getItemClass(index) {
          return this.items[index].selected ?
            {'is-primary': true, 'is-medium': true} :
            {};
      },
      isSelected(index) {
          return this.items[index].selected;
      },
      toggleOptional(index) {
          this.items[index].isOptional = !this.items[index].isOptional;
      },
      getOptionalClass(index) {
          return this.items[index].isOptional ?
          {'is-medium': true, 'is-warning': true} : 
          {'is-medium': true, 'is-black': true}
      },
      getOptionalText(index) {
          return this.items[index].isOptional ? 'Optional' : 'Required';
      }
  }
}
</script>

<style scoped>

</style>
