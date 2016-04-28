'use strict';

const React = require('react');

const CategoryLinks = module.exports = ({ categories, changeCategory }) => {
  if (categories.length <= 1) return <script />;
  return (
    <p>Category:
      {' '}
      <select onChange={(e) => changeCategory(e.target.value)}>
        {categories.map((category, i) => {
          return <option key={i} value={i}>{category}</option>;
        })}
      </select>
    </p>
  );
};

if (process.env.NODE_ENV !== 'production') {
  const { array, func, string } = React.PropTypes;
  CategoryLinks.propTypes = {
    categories: array,
    changeCategory: func.isRequired,
    title: string
  };
}
