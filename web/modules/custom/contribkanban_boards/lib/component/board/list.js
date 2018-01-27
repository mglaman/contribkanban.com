import React, { Component } from 'react';
import { string, object} from 'prop-types';
import ApiUrl from "../../url";
import {datasetToJson, objectForeach} from "../../utils";
import superagent from 'superagent';
import superagentCache from 'superagent-cache';
import Issue from "./issue";

superagentCache(superagent);

class List extends Component {
  static propTypes = {
    label: string.isRequired,
    data: object.isRequired,
  };
  state = {
    loaded: false,
    count: 0,
    issueList: []
  };
  componentDidMount() {
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
    }
    if (data['tag'] !== null) {
      apiUrl.addParameter('taxonomy_vocabulary_9[tid][]', data['tag']);
    }
    if (data['parent'] !== null) {
      apiUrl.addParameter('field_issue_parent', data['parent']);
    }
    if (data['priority'] !== null) {
      apiUrl.addParameter('field_issue_priority', data['priority']);
    }
    objectForeach(data['version'], function (i, v) {
      apiUrl.addParameter('field_issue_version[value][]', v);
    });
    if (data['component'] !== null) {
      apiUrl.addParameter('field_issue_component', data['component']);
    }
    superagent
      .get(apiUrl.getEndpointUrl())
      .backgroundRefresh()
      .end((err, { body }) => {
        this.setState({
          loaded: true,
          issueList: body.list,
          count: body.list.length
        })
      })
  }
  render() {
    const { label } = this.props;
    return (
      <div className="board--list card is-flex is-vertical">
        <h2>
          <span className="icon has-text-info board--list__refresh">
            {this.state.loaded ? [] : [<i className="fa fa-circle-o-notch fa-spin fa-fw " />]}
          </span>
          {label} ({this.state.loaded ? [this.state.count] : []})</h2>
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
export default List;
