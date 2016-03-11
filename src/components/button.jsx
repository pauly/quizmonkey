'use strict';

const React = require('react');

const Button = module.exports = ({ children, onClick }) => {
  const style = {
    margin: ' 0 1em 1em 0'
  };
  return <button className="btn btn-primary" style={style} onClick={onClick}>{children}</button>;
};

if (process.env.NODE_ENV !== 'production') {
  const { any, func } = React.PropTypes;
  Button.propTypes = {
    children: any,
    onClick: func.isRequired
  };
}
