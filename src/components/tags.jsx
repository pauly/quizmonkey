'use strict';

const React = require('react');

const Tags = module.exports = ({ filter, tags }) => {
  if (tags.length < 2) return <script />;
  return (
    <div>{tags.map((tag) => {
      return (
        <label className="checkbox-inline">
          <input type="checkbox" onClick={() => filter(tag.tag)} checked={tag.value && 'checked'} value={tag.tag} />
          {tag.tag}
        </label>
      );
    })}</div>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Tags.defaultProps = {
    filter: (tag) => console.log('no filtering by ' + tag + ' yet')
  };
  const { func, array } = React.PropTypes;
  Tags.propTypes = {
    filter: func,
    tags: array.isRequired
  };
}
