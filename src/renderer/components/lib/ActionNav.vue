<template>
  <nav class="breadcrumb has-dot-separator">
    <ul>
      <li v-bind:class="{'is-active': isCreate}" v-on:click="toggleCreate"><a>Create</a></li>
      <li v-bind:class="{'is-active': isEdit}" v-on:click="toggleEdit"><a>Edit</a></li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: ['isCreate', 'isEdit'],
  methods: {
    toggleCreate() {
      this.$emit('update:isCreate', true);
      this.$emit('update:isEdit', false);
    },
    toggleEdit() {
      this.$emit('update:isCreate', false);
      this.$emit('update:isEdit', true);
    }
  }
}
</script>

<style scoped>

</style>
