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
    this.props.categoryFilterUpdated(e.target.value)
  }
  priorityChange(e) {
    this.props.priorityFilterUpdated(e.target.value)
  }
  versionChange(e) {
    this.props.versionFilterUpdated(e.target.value);
  }
  render() {
    return(
      <div className="is-flex is-clearfix board--filters">
        <Select data={categoryOptions} label="Category" selected={this.props.categoryFilter} onChange={this.categoryChange.bind(this)}/>
        <Select data={priorityOptions} label="Priority" selected={this.props.priorityFilter} onChange={this.priorityChange.bind(this)}/>
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
