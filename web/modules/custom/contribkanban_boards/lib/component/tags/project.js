import React, {Component} from 'react';
import {number} from 'prop-types';
import ApiUrl from "../../url";
import superagent from 'superagent';
import superagentCache from 'superagent-cache';
superagentCache(superagent);

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
      superagent
        .get(apiUrl.getEndpointUrl())
        .end((err, { body }) => {
          this.setState({
            loaded: true,
            label: body.list[0].title,
          })
        })
    }
  }
  render() {
    return (
      this.state.loaded ? [<span className="tag is-default">{this.state.label}</span>] : []
    )
  }
}
