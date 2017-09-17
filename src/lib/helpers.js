'use strict'

const helpers = module.exports = {}

helpers.shuffle = (a) => a.sort(() => Math.random() > 0.5)

helpers.randomWrongAnswer = (question) => {
  if (!question) return null
  const answers = helpers.getWrongAnswers(question)
  if (!answers.length) return null
  const rand = Math.random()
  const index = Math.floor(rand * answers.length)
  return answers[index]
}

helpers.getWrongAnswers = (question) => {
  if (!question || !question.answers) return []
  return question.answers.slice(1)
}

helpers.getAnswer = (question) => {
  if (!question) return null
  if (question.answers) return question.answers[0]
  if (question.a) return question.a[0]
  return question.answer
}

helpers.getQuestion = question => {
  if (!question) return null
  return question.q || question.question
}

helpers.answerIsSame = (a, b) => helpers.getAnswer(a) === helpers.getAnswer(b)

helpers.getYear = (question) => {
  if (/^\d{3,4}$/.exec(helpers.getQuestion(question))) {
    return parseInt(helpers.getQuestion(question), 10)
  }
  return null
}

helpers.firstChars = (question, range) => {
  return ('' + helpers.getAnswer(question))
    .replace(/^[a-z]{1,3}\s/, '')
    .toLowerCase()
    .substr(0, range)
}

helpers.answerIsSimilar = (a, b, range) => {
  // console.info('Is', b, 'like ', a, '(but not equal to)? Is it within range', range, '?');
  if (helpers.answerIsSame(a, b)) return false
  const yearA = helpers.getYear(a)
  const yearB = helpers.getYear(b)
  if (yearA && yearB) {
    // if (yearA === yearB) return false;
    return Math.abs(yearA - yearB) <= range
  }
  return helpers.firstChars(a, range) === helpers.firstChars(b, range)
}

helpers.buildQuestion = (id, questions, choices) => {
  let question = {
    id,
    question: helpers.getQuestion(questions[id]),
    answer: helpers.getAnswer(questions[id])
  }
  if (questions[id].trivia) question.trivia = questions[id].trivia
  if (questions[id].tags) question.tags = questions[id].tags
  question.answers = helpers.pickMultipleChoiceAnswers(question, questions, choices)
  return question
}

// @todo this has too many params
helpers.multipleChoicePopulator = (delta, choices, question, answers, item) => {
  if (answers.length >= choices) return answers
  if (helpers.answerIsSimilar(question, item, delta)) {
    /* if (process.env.NODE_ENV !== 'production') {
      console.info(helpers.getQuestion(item), 'is within', delta)
    } */
    answers.push(helpers.getAnswer(item))
  }
  return answers
}

helpers.pickMultipleChoiceAnswers = (question, questions, choices) => {
  // one answer must be the right answer
  let answers = [helpers.getAnswer(question)]

  // if we have a sneaky misleading wrong answer let's use it
  const potentialWrongAnswer = helpers.randomWrongAnswer(questions[question.id]) // @fixme
  if (potentialWrongAnswer) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('potential wrong answer for', helpers.getQuestion(question), potentialWrongAnswer)
    }
    answers.push(potentialWrongAnswer)
  }

  // fill up remaining slots with answers to other questions
  const ranges = [
    3, // similar answers within 3 years / matching 3 characters
    2, // within 2 years / matching 2 characters
    1, // within 1 year / matching 1 characters
    100, // within 100 years etc, mostly useful for dates of kings and queens
    200, // and the same as 100
    0 // whatever
  ]
  const shuffled = helpers.shuffle(questions)
  ranges.forEach(delta => {
    if (answers.length >= choices) return
    const reducer = helpers.multipleChoicePopulator.bind(null, delta, choices, question)
    answers = shuffled.reduce(reducer, answers)
  })
  return helpers.shuffle(answers)
}

helpers.randomQuestion = (category, choices, options, attempts = 0) => {
  const questions = category.questions || category[1]
  const id = Math.floor(Math.random() * questions.length)
  let question = helpers.buildQuestion(id, questions, choices)
  if (!options) return question
  question.tags = question.tags || []
  const useThis = question.tags.reduce((ok, tag) => {
    return options[tag] ? true : ok
  }, false)
  if (useThis) return question
  if (attempts >= questions.length) return question
  return helpers.randomQuestion(category, choices, options, attempts + 1)
}

helpers.getTags = (questions, options) => {
  if (!questions) return []
  return Object.keys(questions.reduce((allTags, tag) => {
    if (!tag.tags) return allTags
    tag.tags.forEach(tag => {
      allTags[tag] = true
    })
    return allTags
  }, {}))
    .sort()
    .map(tag => {
      return { tag: tag, value: options ? options[tag] : null }
    })
}
