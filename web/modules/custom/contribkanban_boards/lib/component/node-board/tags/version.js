import React, {Component} from 'react';
import {string} from 'prop-types';

export default class IssueVersion extends Component {
  static propTypes = {
    version: string.isRequired
  }
  render() {
    return (
      <span className="tag bg-success">{this.props.version}</span>
    )
  }
}
