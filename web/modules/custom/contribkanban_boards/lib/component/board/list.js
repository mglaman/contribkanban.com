import React, { Component } from 'react';
import { string, object} from 'prop-types';
import ApiUrl from "../../url";
import {datasetToJson, objectForeach} from "../../utils";
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
    data: object.isRequired,
  };
  state = {
    loading: true,
    loaded: false,
    count: 0,
    issueList: []
  };
  buildEndpointUrl() {
    const data = datasetToJson(this.props.data);
    const apiUrl = new ApiUrl('node')
      .addParameter('limit', 100)
      .addParameter('type', 'project_issue')
      .addParameter('sort', 'field_issue_priority')
      .addParameter('direction', 'DESC');

    objectForeach(data['projects'], function (i, v) {
      apiUrl.addParameter('field_project[target_id][]', v);
    });
    objectForeach(data['statuses'], function (i, v) {
      apiUrl.addParameter('field_issue_status[value][]', v);
    });
    if (data['category'] !== null) {
      apiUrl.addParameter('field_issue_category', data['category']);
    } else if (this.props.categoryFilter !== '_any') {
      apiUrl.addParameter('field_issue_category', this.props.categoryFilter);
    }
    if (data['tag'] !== null) {
      apiUrl.addParameter('taxonomy_vocabulary_9[tid][]', data['tag']);
    }
    if (data['parent'] !== null) {
      apiUrl.addParameter('field_issue_parent', data['parent']);
    }
    if (data['priority'] !== null) {
      apiUrl.addParameter('field_issue_priority', data['priority']);
    } else if (this.props.priorityFilter !== '_any') {
      apiUrl.addParameter('field_issue_priority', this.props.priorityFilter);
    }
    objectForeach(data['version'], function (i, v) {
      apiUrl.addParameter('field_issue_version[value][]', v);
    });
    if (data['component'] !== null) {
      apiUrl.addParameter('field_issue_component', data['component']);
    }
    return apiUrl;
  }
  fetchIssues() {
    this.setState({
      loading: true,
      issueList: [],
      count: 0
    }, () => {
      const apiUrl = this.buildEndpointUrl();
      superagent
        .get(apiUrl.getEndpointUrl())
        .backgroundRefresh()
        .end((err, { body }) => {
          this.setState({
            loaded: true,
            loading: false,
            issueList: body.list,
            count: body.list.length
          })
        })
    });
  }
  componentDidMount() {
    this.fetchIssues();
  }
  shouldComponentUpdate(nextProps, nextState) {
    // Try and see if the logic in componentDidUpdate can belong here.
    return true;
  }
  componentDidUpdate(prevProps, prevState) {
    // Make sure this is not the first load.
    if (prevState.loaded && this.state.loaded) {
      console.log('Checking if new API request for ' + this.props.label);

      const shouldFetchNew =
        (prevProps.categoryFilter !== this.props.categoryFilter) ||
        (prevProps.priorityFilter !== this.props.priorityFilter) ||
        (prevProps.versionFilter !== this.props.versionFilter);
      if (shouldFetchNew) {
        this.fetchIssues();
      }
    }
  };
  render() {
    const { label } = this.props;
    return (
      <div className="board--list card is-flex is-vertical">
        <h2>
          {!this.state.loading ? [] : [<span className="icon has-text-info board--list__refresh"><i className="fa fa-circle-o-notch fa-spin fa-fw " /></span>]}
          {label} ({!this.state.loading ? [this.state.count] : []})</h2>
        <div>
          <div className="board--list__items">
            {this.state.issueList.map(issue => (
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
