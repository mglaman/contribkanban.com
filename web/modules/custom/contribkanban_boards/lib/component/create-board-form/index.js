import React, {Component} from 'react';
import InputProjects from "./input-projects";
import InputTags from "./input-tags";

class CreateBoardForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: false,
      projectType: '',
      filterByProject: false,
      filterByTag: false,
      boardName: '',
    };
    this.onBoardTypeChange = this.onBoardTypeChange.bind(this);
  }
  isSubmitDisabled() {
    return this.state.processing === true || this.state.projectType.length < 'drupalorg_'.length;
  }
  onBoardTypeChange(event) {
    this.setState({
      projectType: event.target.value,
      filterByProject: event.target.value === 'drupalorg_custom'
    });
  }
  render() {
    return (
      <div className="container">
        <h1 className="is-size-4">Add a new board</h1>
        <form>
          <div className="columns">
            <div className="column is-one-quarter">
              <div className="box">
                <div className="field">
                  <div className="control">
                    <div className="select">
                      <select value={this.state.projectType} onChange={this.onBoardTypeChange}>
                        <option value="">Type of board</option>
                        <option value="drupalorg_core">Drupal core</option>
                        <option value="drupalorg_custom">Custom</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="field">
                  <label className="label">Filters</label>
                  <div className="control">
                    <label className="checkbox">
                      <input type="checkbox" name="filterByTags" onChange={() => {this.setState({filterByTag: !this.state.filterByTag})}} /> Tags
                    </label>
                  </div>
                  <div className="control">
                    <label className="checkbox">
                      <input type="checkbox" name="filterByVersions" /> Versions
                    </label>
                  </div>
                  <div className="control">
                    <label className="checkbox">
                      <input type="checkbox" name="filterByComponent" /> Component
                    </label>
                  </div>
                  <div className="control">
                    <label className="checkbox">
                      <input type="checkbox" name="filterByParent" /> Parent issue
                    </label>
                  </div>
                  <div className="control">
                    <label className="checkbox">
                      <input type="checkbox" name="filterByPriority" /> Priority
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="column">
              <div className="field">
                <label className="label">Title</label>
                <div className="control">
                  <input className="input" type="text" value={this.state.boardName} onChange={(e) => this.setState({boardName: e.target.value})} />
                </div>
              </div>
              <div className="columns is-multiline">
                {this.state.filterByProject ? [
                  <div className="column is-one-quarter">
                    <InputProjects/>
                  </div>
                ] : []}
                {this.state.filterByTag ? [
                  <div className="column is-one-quarter">
                    <InputTags/>
                  </div>
                ] : []}
              </div>
            </div>
          </div>
          <div className="control">
            <button className={`is-primary button ${this.state.processing ? ['is-loading'] : []}`} disabled={this.isSubmitDisabled()}>Submit</button>
          </div>
        </form>
      </div>
    );
  }
}

export default CreateBoardForm
