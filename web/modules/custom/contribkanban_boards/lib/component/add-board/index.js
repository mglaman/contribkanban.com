import React, { Component } from 'react';
import ApiUrl from "../../url";
import superagent from 'superagent';

class AddBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: false,
      error: false,
      machineName: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      processing: true,
    }, () => {
      this.validateMachineName()
    });
  }
  validateMachineName() {
    const machineName = encodeURIComponent(this.state.machineName.toLowerCase());
    const apiUrl = new ApiUrl('node')
      .addParameter('field_project_machine_name', machineName);
    superagent
      .get(apiUrl.getEndpointUrl())
      .end((err, { body }) => {
        if (body.list.length === 0) {
          // Not found.
          this.setState({
            processing: false,
            error: 'Project not found',
          })
        } else {
          const baseUrl = `${window.location.origin}${drupalSettings.path.baseUrl}`;
          superagent
            .post(`${baseUrl}api/boards/add/${machineName}`)
            .end((err, { body }) => {
              if (err) {
                console.log(err);
                this.setState({
                  processing: false,
                  error: 'Project not found',
                })
              } else {
                ga('send', {
                  hitType: 'event',
                  eventCategory: 'Add Board',
                  eventAction: 'add',
                  eventLabel: this.state.machineName
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
              placeholder="Project machine name"
              className={`form-text required input ${this.state.error ? ['is-danger'] : []}`}
              required="required"
              onChange={(e) => this.setState({machineName: e.target.value})}
              disabled={this.state.processing}
              aria-label={`Project machine name`}
            />
            <button
              type="submit"
              className={`is-info button ${this.state.processing ? ['is-loading'] : []}`}
              disabled={this.state.processing}
            >
              Add a project
            </button>
          </div>
          {this.state.error ? [<p className="help is-danger">This project is invalid</p>] : []}
        </div>
      </form>
    )
  }
}

export default AddBoard;
