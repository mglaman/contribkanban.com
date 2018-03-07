import React, {Component} from 'react';
import {object} from 'prop-types';

class ListControl extends Component {
  propTypes = {
    config: object.isRequired
  };
  statusMap = {
    '1': 'Active',
    '2': 'Fixed',
    '8': 'Needs Review',
    '13': 'Needs Work',
    '14': 'RTBC',
    '15': 'Patch (to be ported)',
    '4': 'Postponed',
    '16': 'Postponed (Needs more info)',
    '7': 'Closed (Fixed)',
    '3': 'Closed (Duplicate)',
    '5': 'Closed (Won\'t Fix)',
    '6': 'Closed (Works as designed)',
    '18': 'Closed (Cannot Reproduce)',
  };

  render() {
    const {config} = this.props;
    return (
      <div className="box">
        <h4>{config.title}</h4>
        <div className="tags">{config.statuses.map(status => (
          <span className="tag">{this.statusMap[status]}</span>
        ))}</div>
      </div>
    );
  }
}

export default ListControl;
