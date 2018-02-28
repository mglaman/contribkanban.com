import React, { Component } from 'react';
import {string} from 'prop-types';
import {baseUrl} from "../../utils";
import superagent from 'superagent';

class EditButton extends Component {
  static propTypes = {
    uuid: string.isRequired
  };
  state = {
    access: false,
  };
  componentDidMount() {
      superagent
        .head(`${baseUrl}node-board/${this.props.uuid}/edit`)
        .end((err, { statusCode }) => {
          this.setState({
            access: statusCode === 200,
          })
        })
  }
  render() {
    const { uuid } = this.props;
    if (this.state.access !== false) {
      return (
        <a className="button is-outlined is-info" href={`${baseUrl}node-board/${uuid}/edit`}>Edit</a>
      )
    }
    return null;
  }
}
export default EditButton;
