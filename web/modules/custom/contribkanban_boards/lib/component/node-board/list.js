import React, { Component } from 'react';
import { string, object, array} from 'prop-types';
import superagent from 'superagent';
import superagentCache from 'superagent-cache';
import Issue from "./issue";
import { connect } from 'react-redux';

superagentCache(superagent);

class List extends Component {
  constructor(props){
    super(props);
  }
  static propTypes = {
    label: string.isRequired,
    data: array.isRequired,
    statuses: array.isRequired,
  };
  state = {
    loaded: false,
    issues: [],
  };
  refreshIssues() {
    const validStatuses = this.props.statuses;
    this.setState({
      loaded: true,
      issues: this.props.data.filter((issue) => {
          const issueStatus = parseInt(issue.field_issue_status);
          const index = validStatuses.indexOf(parseInt(issue.field_issue_status)) > -1;
          debugger;
          return index;
        }
      )
    })
  }
  componentDidMount() {
    this.refreshIssues();
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.data.length !== prevProps.data.length) {
      this.refreshIssues();
    }
  }

  render() {
    const { label } = this.props;
    return (
      <div className="board--list card is-flex is-vertical">
        <h2>
          <span className="icon has-text-info board--list__refresh">
            {this.state.loaded ? [] : [<i className="fa fa-circle-o-notch fa-spin fa-fw " />]}
          </span>
          {label} ({this.state.loaded ? [this.state.issues.length] : []})</h2>
        <div>
          <div className="board--list__items">
            {this.state.issues.map(issue => (
              <Issue data={issue}/>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    categoryFilter: state.categoryFilterReducer,
    priorityFilter: state.priorityFilterReducer,
    versionFilter: state.versionFilterReducer,
  }
};
const mapDispatchToProps = (dispatch) => {
  return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
