import React, {Component} from 'react';
import {number} from 'prop-types';

export default class IssuePriority extends Component {
  static propTypes = {
    priority: number.isRequired
  };
  priorityToLabel = {
    400: 'Critical',
    300: 'Major',
    200: 'Normal',
    100: 'Minor'
  };
  priorityToClass = {
    400: 'danger',
    300: 'warning',
    200: 'info',
    100: 'active'
  };
  render() {
    const { priority } = this.props;
    return (
      <span className={`tag is-${this.priorityToClass[priority]}`}>{this.priorityToLabel[priority]}</span>
    )
  }
}
