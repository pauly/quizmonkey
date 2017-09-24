<template>
  <div class="quiz">
    <category-tags :tags=tags @filter=filter />
    <question-panel @handleAnswer=handleAnswer :attempts=attempts :categories=categories :category=category[0] :previous=previous :question=question :score=score />
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
  methods: {
    changeCategory(selected) {
      this.selected = Number(selected)
      this.category = allCategories[this.selected]
      this.tags = helpers.getTags(this.category[1])
      this.question = helpers.randomQuestion(this.category, choices, this.tags)
    },
    filter(tag) {
      this.tags[tag] = !this.tags[tag]
      if (!helpers.questionMatchesTags(this.question, this.tags)) {
        this.question = helpers.randomQuestion(this.category, choices, this.tags)
      }
    },
    handleAnswer(question, answer) {
      if (answer === question.answer) this.score++
      this.attempts++
      this.previous = { answer, question }
      this.question = helpers.randomQuestion(this.category, choices, this.tags)
    }
  },
  data () {
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
