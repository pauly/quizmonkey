<template>
  <div class="category-tags">
    <label class="checkbox-inline" v-for="tag in tags">
      <input type="checkbox" v-on:click="filter" :checked="tag.value && 'checked'" :value="tag.tag" />
      {{ tag.tag }}
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
    tags: Array
  }
}
</script>
