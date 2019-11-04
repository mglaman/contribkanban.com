import React from 'react';
import {number} from 'prop-types';

const IssuePriority = ({ priority}) => (
  <span className={`tag is-${IssuePriority.priorityToClass[priority]}`}>{IssuePriority.priorityToLabel[priority]}</span>
)
IssuePriority.propTypes = {
  priority: number.isRequired
};
IssuePriority.priorityToLabel = {
  400: 'Critical',
  300: 'Major',
  200: 'Normal',
  100: 'Minor'
};
IssuePriority.priorityToClass = {
  400: 'danger',
  300: 'warning',
  200: 'info',
  100: 'active'
};
export default IssuePriority;
