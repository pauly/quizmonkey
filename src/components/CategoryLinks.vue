<template>
  <div v-if="categories.length > 1">
    <select v-on:change="changeCategory">
      <option></option>
      <option v-for="(category, index) in categories" :selected="index === selected" :value="index">
        {{category}}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'category-links',
  methods: {
    changeCategory(event) {
      this.$emit('changeCategory', event.srcElement.value)
    }
  },
  props: {
    categories: Array,
    selected: Number
  }
}
</script>
