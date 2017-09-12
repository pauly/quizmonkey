'use strict'

const React = require('react')

const CategoryDetails = module.exports = ({ categoryDetails, questionsTotal }) => {
  return <p>{questionsTotal} questions, {categoryDetails}</p>
}

if (process.env.NODE_ENV !== 'production') {
  const { number, string } = React.PropTypes
  CategoryDetails.propTypes = {
    categoryDetails: string.isRequired,
    questionsTotal: number.isRequired
  }
}
