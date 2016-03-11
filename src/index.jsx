'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Quiz = require('./components/quiz');

ReactDOM.render(<Quiz choices={4} />, document.getElementById('main'));
