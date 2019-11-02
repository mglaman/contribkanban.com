import React, { Component } from 'react';
import ApiUrl from "../../url";

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
    }, () => this.validateMachineName());
  }
  validateMachineName() {
    const machineName = encodeURIComponent(this.state.machineName.toLowerCase());
    const apiUrl = new ApiUrl('node')
      .addParameter('field_project_machine_name', machineName);

    fetch(apiUrl.getEndpointUrl())
      .then(resp => resp.json())
      .then(json => {
        if (json.list.length === 0) {
          // Not found.
          this.setState({
            processing: false,
            error: 'Project not found',
          })
        } else {
          try {
            const baseUrl = `${window.location.origin}${drupalSettings.path.baseUrl}`;
            fetch(`${baseUrl}api/boards/add/${machineName}`, {
              method: 'POST'
            })
              .then(resp => resp.json())
              .then(json => {
                window.location.href = `${baseUrl}${json.url}`
              });
          } catch (e) {
            this.setState({
              processing: false,
              error: `Error adding ${machineName}`,
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
              placeholder="Project machine name"
              className={`form-text required input ${this.state.error ? ['is-danger'] : []}`}
              required="required"
              aria-required="true"
              onChange={(e) => this.setState({ machineName: e.target.value })}
              disabled={this.state.processing}
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
