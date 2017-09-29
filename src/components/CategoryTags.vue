<template>
  <div>
    <label v-for="(checked, tag) in tags">
      <input type="checkbox" v-on:click="filter" :checked="checked && 'checked'" :value="tag" />
      {{ tag }}
    </label>
  </div>
</template>

<script>
export default {
  name: 'category-tags',
  methods: {
    filter(tag) {
      this.$emit('filter', event.srcElement.value)
    }
  },
  props: {
    tags: Object
  }
}
</script>

<style scoped>
  label,
  input {
    margin: 0 1em 0 0;
  }
</style>
