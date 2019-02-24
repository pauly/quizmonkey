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

<style scoped>
  select {
    margin: 0 1em 1em 0;
    background-color: #337ab7;
    background-image: linear-gradient(to bottom,#337ab7 0,#265a88 100%);
    background-repeat: repeat-x;
    border-color: #245580;
    border-radius: 4px;
    color: #fff;
    font-size: 1.2em;
    font-weight: normal;
    padding: 6px 12px;
  }
</style>
