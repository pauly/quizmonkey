'use strict';

const React = require('react');
const { any, func } = React.PropTypes;

const Button = module.exports = ({ children, onClick }) => {
  const style = {
    marginBottom: '1em',
    marginRight: '1em'
  };
  return <button className="btn btn-primary" style={style} onClick={onClick}>{children}</button>;
};

if (process.env.NODE_ENV !== 'production') {
  Button.propTypes = {
    children: any,
    onClick: func.isRequired
  };
}
