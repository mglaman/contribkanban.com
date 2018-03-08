import React, {Component} from 'react';
import InputProjects from "./input-projects";
import InputTags from "./input-tags";
import ListControl from "./list-control";

class CreateBoardForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: false,
      projectType: '',
      parentIssue: '',
      filterByProject: false,
      filterByTag: false,
      filterByParentIssue: false,
      boardName: '',
      lists: this.defaultLists
    };
    this.onBoardTypeChange = this.onBoardTypeChange.bind(this);
    this.onTagChange = this.onTagChange.bind(this);
    this.onProjectChange = this.onProjectChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  defaultLists = [
    {
      title: "Postponed",
      statuses: [4, 16],
      tags: [],
      parentIssue: ""
    },
    {
      title: "Active",
      statuses: [1],
      tags: [],
      parentIssue: ""
    },
    {
      title: "Needs Work",
      statuses: [13],
      tags: [],
      parentIssue: ""
    },
    {
      title: "Needs Review",
      statuses: [8],
      tags: [],
      parentIssue: ""
    },
    {
      title: "Reviewed & Tested",
      statuses: [14,15],
      tags: [],
      parentIssue: ""
    },
    {
      title: "Fixed",
      statuses: [2],
      tags: [],
      parentIssue: ""
    },
  ];
  isSubmitDisabled() {
    return this.state.processing === true || this.state.projectType.length < 'drupalorg_'.length;
  }
  onBoardTypeChange(event) {
    this.setState({
      projectType: event.target.value,
      filterByProject: event.target.value === 'drupalorg_custom'
    }, () => {
      if (!this.state.filterByProject) {
        this.onProjectChange([
          {nid: '3060'}
        ])
      } else {
        this.onProjectChange([])
      }
    });
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
                    <input className="input" type="text" value={this.state.boardName} onChange={(e) => this.setState({boardName: e.target.value})} placeholder="Board name" required/>
                  </div>
                </div>
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
                {this.state.filterByProject ? [
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
              <div>
                {this.state.lists.map((item, _k) => (
                  <ListControl config={item}/>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default CreateBoardForm
