'use strict'

const React = require('react')
const QuestionPanel = require('./questionPanel')
const CategoryLinks = require('./categoryLinks')
const CategoryDetails = require('./categoryDetails')
const Tags = require('./tags')
const helpers = require('../lib/helpers')
const allCategories = require('../../data/data')

module.exports = React.createClass({
  getInitialState () {
    return {
      attempts: 0,
      choices: 4,
      category: allCategories[0],
      previous: {
        question: {}
      },
      score: 0
    }
  },
  render () {
    const changeCategory = (index) => {
      this.setState({ category: allCategories[index] })
    }
    const handleAnswer = (question, answer) => {
      let { attempts, previous, score } = this.state
      if (answer === question.answer) score++
      attempts++
      previous.answer = answer
      previous.question = question
      this.setState({ attempts, previous, score })
    }
    const filter = (tag) => {
      let { options } = this.state
      if (!options) options = {} // @todo make it all options by default
      options[tag] = !options[tag]
      this.setState({ options })
    }
    const { attempts, category, choices, options, previous, score } = this.state
    const question = helpers.randomQuestion(category, choices, options)
    const categories = allCategories.map((option) => option.title || option[0])
    const tags = helpers.getTags(category[1], options)
    const props = {
      attempts,
      categories,
      category: category.title || category[0],
      handleAnswer,
      previous,
      question,
      score
    }
    return (
      <div>
        <Tags tags={tags} filter={filter} />
        <QuestionPanel {...props} />
        <CategoryDetails questionsTotal={category[1].length} categoryDetails={category[2]} />
        <CategoryLinks categories={categories} changeCategory={changeCategory} />
      </div>
    )
  }
})
