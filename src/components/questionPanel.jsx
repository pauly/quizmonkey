'use strict';

const React = require('react');
const { func, object, number, string } = React.PropTypes;
const Button = require('./button');
const CategoryLinks = require('./categoryLinks');
const Result = require('./result');

const QuestionPanel = module.exports = ({ attempts, categories, categoryDetails, categoryTitle, changeCategory, handleAnswer, previousAnswer, previousQuestion, question, questionsTotal, score }) => {
  return (
    <div>
      <h2>{categoryTitle} {score} / {attempts}</h2>
      <h3>{question.question}</h3>
      <div role="toolbar" className="btn-toobar">
        {question.answers.map((answer, i) => {
          return <Button key={i} onClick={() => handleAnswer(question, answer)}>{answer}</Button>;
        })}
      </div>
      <Result previousAnswer={previousAnswer} previousQuestion={previousQuestion} />
      <hr />
      <p>{questionsTotal} questions so far, {categoryDetails}</p>
      <CategoryLinks categories={categories} changeCategory={changeCategory} />
      {process.env.NODE_ENV === 'production' ? null : <pre>question: {JSON.stringify(question, null, 2)} // for development only</pre>}
    </div>
  );
};

QuestionPanel.defaultProps = {
  attempts: 0,
  previousQuestion: {}
};

if (process.env.NODE_ENV !== 'production') {
  QuestionPanel.propTypes = {
    attempts: number.isRequired,
    categoryTitle: string.isRequired,
    changeCategory: func.isRequired,
    handleAnswer: func.isRequired,
    previousAnswer: string,
    previousQuestion: object.isRequired,
    question: object.isRequired
  };
}
