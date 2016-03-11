'use strict';

const React = require('react');
const QuestionPanel = require('./questionPanel');
const helpers = require('../lib/helpers');
let allCategories = require('../../data/data');

module.exports = React.createClass({
  getInitialState() {
    return {
      attempts: 0,
      choices: 3,
      category: allCategories[0],
      previousQuestion: {},
      score: 0
    };
  },
  render() {
    const changeCategory = (index) => {
      this.setState({ category: allCategories[index] });
    };
    const handleAnswer = (question, answer) => {
      let { attempts, previousAnswer, previousQuestion, score } = this.state;
      if (answer === question.answer) score++;
      attempts++;
      previousAnswer = answer;
      previousQuestion = question;
      this.setState({ attempts, previousAnswer, previousQuestion, score });
    };
    const { attempts, category, choices, previousAnswer, previousQuestion, score } = this.state;
    const question = helpers.randomQuestion(category, choices);
    const categories = allCategories.map((option) => option.title || option[0]);
    const props = {
      attempts,
      changeCategory,
      categories,
      categoryDetails: category[2],
      categoryTitle: category.title || category[0],
      handleAnswer,
      previousAnswer,
      previousQuestion,
      question,
      questionsTotal: category.questions ? category.questions.length : category[1].length,
      score
    };
    return <QuestionPanel {...props} />;
  }
});
