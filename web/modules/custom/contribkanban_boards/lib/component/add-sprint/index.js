import React, { Component } from 'react';
import ApiUrl from "../../url";

class AddSprint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: false,
      error: false,
      tag: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      processing: true,
    }, () => this.validateTag());
  }
  validateTag() {
    const apiUrl = new ApiUrl('taxonomy_term')
      .addParameter('name', this.state.tag);
    fetch(apiUrl.getEndpointUrl())
      .then(resp => resp.json())
      .then(json => {
        if (json.list.length === 0) {
          // Not found.
          this.setState({
            processing: false,
            error: 'Tag not found',
          })
        } else {
          try {
            const baseUrl = `${window.location.origin}${drupalSettings.path.baseUrl}`;
            fetch(`${baseUrl}api/boards/add/tag/${encodeURIComponent(this.state.tag)}`, {
              method: 'POST'
            })
              .then(resp => resp.json())
              .then(json => {
                window.location.href = `${baseUrl}${json.url}`
              })
          } catch (e) {
            this.setState({
              processing: false,
              error: 'Error adding tag',
            })
          }
        }
      });
  }
  render() {
    return (
      <form className="card" onSubmit={this.handleSubmit}>
        <div className="card-content">
          <div className="columns">
            <input
              type="text"
              value={this.state.machineName}
              size="60"
              maxLength="128"
              placeholder="Tag name"
              className={`form-text required input ${this.state.error ? ['is-danger'] : []}`}
              required="required"
              aria-required="true"
              onChange={(e) => this.setState({ tag: e.target.value })}
              disabled={this.state.processing}
            />
            <button
              type="submit"
              className={`is-info button ${this.state.processing ? ['is-loading'] : []}`}
              disabled={this.state.processing}
            >
              Add sprint
            </button>
          </div>
          {this.state.error ? [<p className="help is-danger">This tag is invalid</p>] : []}
        </div>
      </form>
    )
  }
}

export default AddSprint;
