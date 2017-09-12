'use strict'

const React = require('react')
const Button = require('./button')
const Result = require('./result')

const QuestionPanel = module.exports = ({ attempts, category, handleAnswer, previous, question, score }) => {
  return (
    <div className={category.toLowerCase()}>
      <h2>{category} {score} / {attempts}</h2>
      <h3>{question.question}</h3>
      <div className='btn-toobar'>
        {question.answers.map((answer, i) => {
          return <Button className={answer.toLowerCase()} key={i} onClick={() => handleAnswer(question, answer)}>{answer}</Button>
        })}
      </div>
      <Result previous={previous} />
      {process.env.NODE_ENV === 'production' ? null : <pre>question: {JSON.stringify(question, null, 2)} // for development only</pre>}
    </div>
  )
}

QuestionPanel.defaultProps = {
  attempts: 0,
  previous: {
    question: {}
  }
}

if (process.env.NODE_ENV !== 'production') {
  const { func, object, number, string } = React.PropTypes
  QuestionPanel.propTypes = {
    attempts: number.isRequired,
    category: string.isRequired,
    handleAnswer: func.isRequired,
    previous: object,
    question: object.isRequired,
    score: number.isRequired
  }
}
