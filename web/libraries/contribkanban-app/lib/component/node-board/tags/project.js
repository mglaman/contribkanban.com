import React, {Component} from 'react';
import {number} from 'prop-types';
import ApiUrl from "../../../url";

export default class IssueProject extends Component {
  static propTypes = {
    projectNid: number.isRequired
  };
  state = {
    loaded: false,
    label: this.props.projectNid
  };
  componentDidMount() {
    const nid = this.props.projectNid;
    if (nid === '3060') {
      this.setState({
        label: 'Drupal'
      });
    } else {
      const apiUrl = new ApiUrl('node').addParameter('nid', nid);
      fetch(apiUrl.getEndpointUrl())
        .then(res => res.json())
        .then(json => this.setState({
          loaded: true,
          label: json.list[0].title,
        }))
    }
  }
  render() {
    return (
      this.state.loaded ? [<span className="tag is-default">{this.state.label}</span>] : []
    )
  }
}
