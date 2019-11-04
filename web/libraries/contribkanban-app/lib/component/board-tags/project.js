import React, { PureComponent } from 'react';
import { number } from 'prop-types';
import ApiUrl from "../../url";

export default class IssueProject extends PureComponent {
  static propTypes = {
    projectNid: number.isRequired
  };
  state = {
    loaded: false,
    label: this.props.projectNid
  };
  componentDidMount() {
    const nid = this.props.projectNid;
    if (parseInt(nid) === 3060) {
      this.setState({
        label: 'Drupal'
      });
    } else {
      const apiUrl = new ApiUrl('node').addParameter('nid', nid);
      fetch(apiUrl.getEndpointUrl(), {cache: "force-cache"})
        .then(resp => resp.json())
        .then(json => this.setState({
          loaded: true,
          label: json.list[0].title,
        }));
    }
  }
  render() {
    return (
      this.state.loaded ? [<span className="tag is-default">{this.state.label}</span>] : []
    )
  }
}
