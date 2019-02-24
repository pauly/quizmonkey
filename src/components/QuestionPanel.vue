<template>
  <div>
    <div>
      <h3>{{ category}} {{ score }} / {{ attempts }}</h3>
      <h2>{{ question.question }}</h2>
      <button v-for="answer in question.answers" v-on:click="handleAnswer" :value="answer">
        {{ answer }}
      </button>
      <template v-if="previous.question && previous.answer">
        <div class="alert alert-success" v-if="previous.answer === previous.question.answer">
          Correct!
        </div>
        <div class="alert alert-danger" v-else>
          <p>Oops!</p>
          <p>{{previous.question.question}} = {{previous.question.answer}}</p>
          <p>{{previous.question.trivia}}</p>
        </div>
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
      clearTimeout(this.timeout)
      this.$emit('handleAnswer', this.question, event.srcElement.value)
    },
    passAfterTimeout() {
      this.timeout = setTimeout(function () {
        this.$emit('handleAnswer', this.question, 'x')
      }.bind(this), 10000)
    }
  },
  props: {
    attempts: Number,
    category: String,
    previous: Object,
    question: Object,
    score: Number
  },
  mounted () {
    this.passAfterTimeout()
  },
  updated () {
    this.passAfterTimeout()
  }
}
</script>

<style scoped>
  button {
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
