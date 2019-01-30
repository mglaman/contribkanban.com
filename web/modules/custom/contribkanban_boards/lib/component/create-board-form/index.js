import React, { PureComponent } from 'react';
import PropTypes from "prop-types";
import InputProjects from "./input-projects";
import InputTags from "./input-tags";
import ListControl from "./list-control";
import defaultLists from "./defaultLists";
import {connect} from "react-redux";
import {
  createBoardChangeBoardName,
  createBoardChangeProjectType
} from "../../actions";

class CreateBoardFormPresentational extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    projectType: PropTypes.string,
    filterByProject: PropTypes.bool,
    projectNids: PropTypes.array,
    boardName: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {
      processing: false,
      parentIssue: '',
      filterByTag: false,
      filterByParentIssue: false,
      lists: defaultLists
    };
    this.onBoardTypeChange = this.onBoardTypeChange.bind(this);
    this.onTagChange = this.onTagChange.bind(this);
    this.onProjectChange = this.onProjectChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  isSubmitDisabled() {
    return this.state.processing === true || this.props.projectType.length < 'drupalorg_'.length;
  }
  onBoardTypeChange(event) {
    const { dispatch } = this.props;
    dispatch(createBoardChangeProjectType(event.target.value));
  }
  onTagChange(data) {
    this.setState({
      lists: this.state.lists.map((s) => {
        return { ...s, tags: data};
      }),
    })
  }
  onProjectChange(data) {
    this.setState({
      lists: this.state.lists.map((s) => {
        return { ...s, projectNid: data};
      }),
    })
  }
  onSubmit(event) {
    event.preventDefault();
    const board = {
      type: this.state.projectType,
      title: this.state.boardName,
      lists: this.state.lists
    };
    debugger;

  }
  render() {
    const { boardName, projectType, filterByProject } = this.props;
    return (
      <div className="container">
        <h1 className="is-size-4">Add a new board</h1>
        <form onSubmit={this.onSubmit}>
          <div className="columns">
            <div className="column is-4">
              <div className="box">
                <div className="field">
                  <label className="label sr-only">Board name</label>
                  <div className="control">
                    <input className="input" type="text" value={boardName} onChange={(e) => this.props.dispatch(createBoardChangeBoardName(e.target.value))} placeholder="Board name" required/>
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <div className="select">
                      <select value={projectType} onChange={this.onBoardTypeChange}>
                        <option value="">Board type</option>
                        <option value="drupalorg_core">Drupal core</option>
                        <option value="drupalorg_module">Module</option>
                        <option value="drupalorg_theme">Theme</option>
                        <option value="drupalorg_distribution">Distribution</option>
                        <option value="drupalorg_sprint">Sprint / tag</option>
                        <option value="drupalorg_custom">Freestyle board</option>
                      </select>
                    </div>
                  </div>
                </div>
                {filterByProject ? [
                  <div className="">
                    <InputProjects onChange={this.onProjectChange}/>
                  </div>
                ] : []}
                <div className="field">
                  <label className="label">Filters</label>
                  <div className="control">
                    <label className="checkbox">
                      <input type="checkbox" name="filterByTags" onChange={() => {this.setState({filterByTag: !this.state.filterByTag})}} /> Tags
                    </label>
                  </div>
                  {this.state.filterByTag ? [
                    <div className="">
                      <InputTags onChange={this.onTagChange}/>
                    </div>
                  ] : []}
                  {/*<div className="control">*/}
                    {/*<label className="checkbox">*/}
                      {/*<input type="checkbox" name="filterByVersions" /> Versions*/}
                    {/*</label>*/}
                  {/*</div>*/}
                  {/*<div className="control">*/}
                    {/*<label className="checkbox">*/}
                      {/*<input type="checkbox" name="filterByComponent" /> Component*/}
                    {/*</label>*/}
                  {/*</div>*/}
                  <div className="control">
                    <label className="checkbox">
                      <input type="checkbox" name="filterByParent" onChange={() => {this.setState({filterByParentIssue: !this.state.filterByParentIssue})}}  /> Parent issue
                    </label>
                  </div>
                  {this.state.filterByParentIssue ? [
                    <div className="control">
                      <input
                        placeholder="Parent Node ID"
                        className="input"
                        type="text"
                        value={this.state.parentIssue}
                        onChange={(event) => this.setState({
                          parentIssue: event.target.value,
                          lists: this.state.lists.map((s) => {
                            return { ...s, parentIssue: event.target.value};
                          }),
                        })}
                      />
                    </div>
                  ] : []}
                  <div className="control">
                    <label className="checkbox">
                      <input type="checkbox" name="filterByPriority" /> Priority
                    </label>
                  </div>
                </div>
              </div>
              <div className="control">
                <button className={`is-primary is-large button ${this.state.processing ? ['is-loading'] : []}`} disabled={this.isSubmitDisabled()}>Submit</button>
              </div>
            </div>
            <div className="column">
              <div style={{marginBottom: '10px'}}>
                {this.state.lists.map((item) => (<ListControl config={item}/>))}
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(
  (state, props) => {
    return state.createBoard
  }
)(CreateBoardFormPresentational);
