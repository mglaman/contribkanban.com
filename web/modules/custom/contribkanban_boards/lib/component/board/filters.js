import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from "../select";
import {
  categoryFilterUpdated,
  priorityFilterUpdated,
  versionFilterUpdated
} from "../../actions";

class Filters extends Component {
  constructor(props){
    super(props);
  }
  categoryOptions = [
    {value: '_any', item: 'Any category'},
    {value: 1, item: 'Bug report'},
    {value: 2, item: 'Task'},
    {value: 3, item: 'Feature request'},
    {value: 4, item: 'Support request'},
    {value: 5, item: 'Plan'},
  ];
  priorityOptions = [
    {value: '_any', item: 'Any priority'},
    {value: 400, item: 'Critical'},
    {value: 300, item: 'Major'},
    {value: 200, item: 'Normal'},
    {value: 100, item: 'Minor'},
  ];
  versionOptions = [
    {value: '_any', item: 'Any version'},
    {value: '8.x', item: 'Drupal 8'},
    {value: '7.x', item: 'Drupal 7'},
  ];
  categoryChange(e) {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Filters',
      eventAction: 'change',
      eventLabel: 'Category',
    });
    this.props.categoryFilterUpdated(e.target.value)
  }
  priorityChange(e) {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Filters',
      eventAction: 'change',
      eventLabel: 'Priority'
    });
    this.props.priorityFilterUpdated(e.target.value)
  }
  versionChange(e) {
    ga('send', {
      hitType: 'event',
      eventCategory: 'Filters',
      eventAction: 'change',
      eventLabel: 'Version'
    });
    this.props.versionFilterUpdated(e.target.value);
  }
  render() {
    return(
      <div className="is-flex is-clearfix board--filters">
        <Select data={this.categoryOptions} label="Category" selected={this.props.categoryFilter} onChange={this.categoryChange.bind(this)}/>
        <Select data={this.priorityOptions} label="Priority" selected={this.props.priorityFilter} onChange={this.priorityChange.bind(this)}/>
        {/*<Select data={this.versionOptions} label="Versions" selected={this.props.versionFilter} onChange={this.versionChange.bind(this)}/>*/}
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
  return {
    categoryFilterUpdated: value => dispatch(categoryFilterUpdated(value)),
    priorityFilterUpdated: value => dispatch(priorityFilterUpdated(value)),
    versionFilterUpdated: value => dispatch(versionFilterUpdated(value)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
