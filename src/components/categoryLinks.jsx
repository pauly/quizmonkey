'use strict';

const React = require('react');
const { array, func, string } = React.PropTypes;

const CategoryLinks = module.exports = ({ categories, changeCategory }) => {
  return (
    <p>Choose another category:{' '}
      <select onChange={(e) => changeCategory(e.target.value)}>
        {categories.map((category, i) => {
          return <option key={i} value={i}>{category}</option>;
        })}
      </select>
    </p>
  );
};

if (process.env.NODE_ENV !== 'production') {
  CategoryLinks.propTypes = {
    categories: array,
    changeCategory: func.isRequired,
    title: string
  };
}
