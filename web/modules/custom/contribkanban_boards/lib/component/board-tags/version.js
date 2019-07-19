import React, {Component} from 'react';
import {string} from 'prop-types';

export default class IssueVersion extends Component {
  static propTypes = {
    version: string.isRequired
  }
  render() {
    return this.props.version !== null ? <span className="tag bg-success">{this.props.version}</span> : null;
  }
}
