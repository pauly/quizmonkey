'use strict';

const React = require('react');

const Result = module.exports = ({ previous }) => {
  // pre react 15 functional components can't return null
  if (!previous.answer || !previous.question) return <script />;
  if (previous.answer === previous.question.answer) {
    return <div className="alert alert-success">Correct!</div>;
  }
  return (
    <div className="alert alert-danger">
      <p>Oops!</p>
      <p>{previous.question.question} = {previous.question.answer}</p>
      <p>{previous.question.trivia}</p>
    </div>
  );
};

if (process.env.NODE_ENV !== 'production') {
  const { object } = React.PropTypes;
  Result.propTypes = {
    previous: object
  };
}
