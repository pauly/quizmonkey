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
      this.tags = helpers.getTags(this.category[1], this.options)
      this.question = helpers.randomQuestion(this.category, choices, this.options)
    },
    filter(tag) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('got new tag', tag, 'options were', this.options)
        console.log('tags were', this.tags, '@todo do we need options and tags?')
      }
      this.options[tag] = !this.options[tag]
      if (!helpers.questionMatchesOptions(this.question, this.options)) {
        this.question = helpers.randomQuestion(this.category, choices, this.options)
      }
    },
    handleAnswer(question, answer) {
      if (answer === question.answer) this.score++
      this.attempts++
      this.previous = { answer, question }
      this.question = helpers.randomQuestion(this.category, choices, this.options)
    }
  },
  data () {
    const category = allCategories[0]
    return {
      attempts: 0,
      category,
      categories,
      choices,
      options: {},
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
