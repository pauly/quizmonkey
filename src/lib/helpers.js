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

helpers.getQuestion = (question) => {
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
  const ranges = [3, 2, 1, 100, 200, 0]
  const shuffled = helpers.shuffle(questions)
  ranges.forEach((diff) => {
    if (answers.length >= choices) return
    shuffled.forEach((item) => {
      if (answers.length >= choices) return
      if (!helpers.answerIsSimilar(question, item, diff)) return
      /* if (process.env.NODE_ENV !== 'production') {
        console.info(helpers.getQuestion(item.question), 'is within', diff);
      } */
      answers.push(helpers.getAnswer(item))
    })
  })
  return helpers.shuffle(answers)
}

helpers.randomQuestion = (category, choices, options, attempts = 0) => {
  const questions = category.questions || category[1]
  const id = Math.floor(Math.random() * questions.length)
  let question = helpers.buildQuestion(id, questions, choices)
  if (process.env.NODE_ENV !== 'production') {
    if (!options) return question
    // if (!question.tags) return question;
    question.tags = question.tags || []
    const useThis = question.tags.reduce((prev, next) => {
      if (options[next]) return true
      return prev
    }, false)
    if (!useThis && attempts < questions.length) {
      return helpers.randomQuestion(category, choices, options, attempts + 1)
    }
  }
  return question
}

helpers.getTags = (questions, options) => {
  if (!questions) return []
  return Object.keys(questions.reduce((prev, next) => {
    if (!next.tags) return prev
    next.tags.forEach(tag => {
      prev[tag] = true
    })
    return prev
  }, {}))
    .sort()
    .map(tag => {
      return { tag: tag, value: options ? options[tag] : null }
    })
}
