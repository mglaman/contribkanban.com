import React, {Component} from 'react';
import {object} from 'prop-types';
import IssueVersion from "../board-tags/version";
import IssuePriority from "../board-tags/priority";
import IssueCategory from "../board-tags/category";
import IssueProject from "../board-tags/project";

export default class Issue extends Component {
  static propTypes = {
    data: object.isRequired
  };
  statusToColor = {
    1: '#fcfcfc',
    2: '#d7ffd8',
    3: '#fddddd',
    4: '#eff1f3',
    5: '#fddddd',
    6: '#fddddd',
    7: '#fddddd',
    8: '#ffffdd',
    13: '#ffece8',
    14: '#d7ffd8',
    15: '#d7ffd8',
    16: '#eff1f3',
    18: '#fddddd'
  };
  statusToLabel = {
    1: 'Active',
    2: 'Fixed',
    3: 'Closed (Duplicate)',
    4: 'Postponed',
    5: 'Closed (Won\'t Fix)',
    6: 'Closed (Works as designed)',
    7: 'Closed (Fixed)',
    8: 'Needs Review',
    13: 'Needs Work',
    14: 'RTBC',
    15: 'Patch (to be ported)',
    16: 'Postponed (Needs more info)',
    18: 'Closed (Cannot Reproduce)'
  };
  static getLink(nid) {
    return `https://www.drupal.org/node/${nid}`;
  }
  render() {
    const { data } = this.props;
    return (
      <div className="board--list__item card" onClick={() => window.open(Issue.getLink(data.nid))} style={{
        backgroundColor: this.statusToColor[parseInt(data.field_issue_status)],
        cursor: 'pointer',
      }}>
        <h3>{data.title} <a className="kanban-board--issue__link" href={Issue.getLink(data.nid)} target="_blank">#{data.nid}</a></h3>
        <div className="kanban-board--issue_tags">
          <IssueVersion version={data.field_issue_version}/>
          <IssuePriority priority={data.field_issue_priority}/>
          <span className="tag is-default">{data.field_issue_component}</span>
          <IssueCategory category={data.field_issue_category}/>
          <IssueProject projectNid={data.field_project.id}/>
        </div>
      </div>
    )
  }
}
