import React, { Component } from 'react';
import ApiUrl from "../../url";
import superagent from 'superagent';

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
    }, () => {
      this.validateTag()
    });
  }
  validateTag() {
    const apiUrl = new ApiUrl('taxonomy_term')
      .addParameter('name', this.state.tag);
    superagent
      .get(apiUrl.getEndpointUrl())
      .end((err, { body }) => {
        if (body.list.length === 0) {
          // Not found.
          this.setState({
            processing: false,
            error: 'Tag not found',
          })
        } else {
          const baseUrl = `${window.location.origin}${drupalSettings.path.baseUrl}`;
          superagent
            .post(`${baseUrl}api/boards/add/tag/${this.state.tag}`)
            .end((err, { body }) => {
              if (err) {
                console.log(err);
                this.setState({
                  processing: false,
                  error: 'Tag not found',
                })
              } else {
                ga('send', {
                  hitType: 'event',
                  eventCategory: 'Add Sprint',
                  eventAction: 'add',
                  eventLabel: this.state.tag
                });
                window.location.href = `${baseUrl}${body.url}`
              }
            });
        }
      })
  }
  render() {
    return(
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
              onChange={(e) => this.setState({tag: e.target.value})}
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
