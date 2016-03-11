'use strict';

const React = require('react');
const { object, string } = React.PropTypes;

const Result = module.exports = ({ previousAnswer, previousQuestion }) => {
  if (!previousAnswer || !previousQuestion) return null;
  if (previousAnswer === previousQuestion.answer) {
    return <div className="alert alert-success" role="alert">Correct!</div>;
  }
  return (
    <div className="alert alert-danger" role="alert">
      <p>Oops!</p>
      <p>{previousQuestion.question} = {previousQuestion.answer}</p>
      <p>{previousQuestion.trivia}</p>
    </div>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Result.propTypes = {
    previousAnswer: string,
    previousQuestion: object
  };
}
