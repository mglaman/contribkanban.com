import React from 'react';
import {number} from 'prop-types';

const IssueCategory = ({ category }) => (
  <span className={`tag is-${IssueCategory.categoryToClass[category]}`}>{IssueCategory.categoryToLabel[category]}</span>
);
IssueCategory.propTypes = {
  category: number.isRequired
};
IssueCategory.categoryToLabel = {
  1: 'Bug',
  2: 'Task',
  3: 'Feature',
  4: 'Support',
  5: 'Plan'
};
IssueCategory.categoryToClass = {
  1: 'danger',
  2: 'info',
  3: 'info',
  4: 'active',
  5: 'active'
};
export default IssueCategory;
