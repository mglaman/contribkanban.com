import React, {Component} from 'react';
import {number} from 'prop-types';

export default class IssueCategory extends Component {
  static propTypes = {
    category: number.isRequired
  };
  categoryToLabel = {
    1: 'Bug',
    2: 'Task',
    3: 'Feature',
    4: 'Support',
    5: 'Plan'
  };
  categoryToClass = {
    1: 'danger',
    2: 'info',
    3: 'info',
    4: 'active',
    5: 'active'
  };
  render() {
    const { category } = this.props;
    return (
      <span className={`tag is-${this.categoryToClass[category]}`}>{this.categoryToLabel[category]}</span>
    )
  }
}
