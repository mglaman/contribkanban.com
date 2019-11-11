import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from "../select";
import {
  categoryFilterUpdated,
  priorityFilterUpdated,
  versionFilterUpdated
} from "../../actions";
import {
  categoryOptions,
  priorityOptions
} from "../../utils"

class Filters extends Component {
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
      <div className="columns is-clearfix board--filters">
        <div className={`column is-flex`}>
          <Select data={categoryOptions} label="Category" selected={this.props.categoryFilter} onChange={this.categoryChange.bind(this)}/>
          <Select data={priorityOptions} label="Priority" selected={this.props.priorityFilter} onChange={this.priorityChange.bind(this)}/>
          {/*<Select data={this.versionOptions} label="Versions" selected={this.props.versionFilter} onChange={this.versionChange.bind(this)}/>*/}
        </div>
        <div className={`column`}>
          <a className={`button is-pulled-right is-hidden-mobile`} href={`${window.location.href}/edit`}>
            Edit
          </a>
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
  return {
    categoryFilterUpdated: value => dispatch(categoryFilterUpdated(value)),
    priorityFilterUpdated: value => dispatch(priorityFilterUpdated(value)),
    versionFilterUpdated: value => dispatch(versionFilterUpdated(value)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
