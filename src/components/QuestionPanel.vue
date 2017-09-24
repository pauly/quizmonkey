<template>
  <div class="question-panel">
    <div>
      <h2>{{ category}} {{ score }} / {{ attempts }}</h2>
      <h3>{{ question.question }}</h3>
      <div class="btn-toolbar">
        <button class="btn btn-primary" v-for="answer in question.answers" v-on:click="handleAnswer" :value="answer">
          {{ answer }}
        </button>
      </div>
      <template v-if="previous.question">
        <template v-if="previous.answer">
          <div class="alert alert-success" v-if="previous.answer === previous.question.answer">
            Correct!
          </div>
          <div class="alert alert-danger" v-else>
            <p>Oops!</p>
            <p>{{previous.question.question}} = {{previous.question.answer}}</p>
            <p>{{previous.question.trivia}}</p>
          </div>
        </template>
      </template>
      <pre v-if="inDebug">question: {{JSON.stringify(question, null, 2)}} // for development only</pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'question-panel',
  data() {
    return {
      inDebug: process.env.NODE_ENV !== 'production'
    }
  },
  methods: {
    handleAnswer(event) {
      this.$emit('handleAnswer', this.question, event.srcElement.value)
    }
  },
  props: {
    attempts: Number,
    categories: Array,
    category: String,
    previous: Object,
    question: Object,
    score: Number
  }
}
</script>

<style scoped>
  button {
    margin: 0 1em 1em 0;
  }
</style>
