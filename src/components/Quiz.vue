<template>
  <div>
    <h1>Quiz monkey</h1>
    <category-tags :tags=tags @filter=filter />
    <question-panel @handleAnswer=handleAnswer :attempts=attempts :category=category[0] :previous=previous :question=question :score=score />
    <p>{{category[1].length}} questions, {{category[2]}}</p>
    <category-links :categories=categories @changeCategory=changeCategory :selected=selected />
  </div>
</template>

<script>
import CategoryTags from './CategoryTags'
import QuestionPanel from './QuestionPanel'
import CategoryLinks from './CategoryLinks'
import helpers from '../lib/helpers'
import allCategories from '../../data/data'

const categories = allCategories.map(option => option.title || option[0])
const choices = 4

export default {
  name: 'quiz',
  components: {
    'category-tags': CategoryTags,
    'category-links': CategoryLinks,
    'question-panel': QuestionPanel
  },
  watch: {
    '$route' (to) {
      this.selected = Number(to.params.id)
      this.category = allCategories[this.selected]
      this.tags = helpers.getTags(this.category[1])
      this.setNewQuestion()
    }
  },
  methods: {
    setNewQuestion() {
      this.question = helpers.randomQuestion(this.category, choices, this.tags)
    },
    changeCategory(selected) {
      this.$router.push(`/category/${selected}`)
    },
    filter(tag) {
      this.tags[tag] = !this.tags[tag]
      if (helpers.questionMatchesTags(this.question, this.tags)) return
      this.setNewQuestion()
    },
    handleAnswer(question, answer) {
      if (answer === question.answer) this.score++
      this.attempts++
      this.previous = { answer, question }
      this.setNewQuestion()
    }
  },
  data() {
    const category = allCategories[0]
    return {
      attempts: 0,
      category,
      categories,
      choices,
      previous: {
        question: {}
      },
      question: helpers.randomQuestion(category, choices),
      score: 0,
      selected: 0,
      tags: helpers.getTags(category[1])
    }
  }
}
</script>

<style>
  div, h1, h2, h3, label, p {
    font-family: arial,verdana,helvetica,sans-serif;
    font-weight: normal;
  }
  h1 {
    font-size: 1em;
  }
  pre, .alert {
    border: 1px solid;
    border-radius: 4px;
    padding: 1em;
    background-repeat: repeat-x;
  }
  .alert-danger {
    color: #a94442;
    background-image: linear-gradient(to bottom,#f2dede 0,#e7c3c3 100%);
    background-color: #f2dede;
    border-color: #dca7a7;
  }
  .alert-success {
    background-image: linear-gradient(to bottom,#dff0d8 0,#c8e5bc 100%);
    border-color: #3c763d;
    background-color: #dff0d8;
    color: #3c763d;
  }
  pre {
    background-color: #eee;
    border: 1px solid #ccc;
  }
</style>
