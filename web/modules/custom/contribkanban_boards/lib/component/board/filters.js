import React, { Component } from 'react';
import Select from "../select";

class Filters extends Component {
  state = {
    categoryOptions: [
      {value: '_any', item: 'Any category'},
      {value: 1, item: 'Bug report'},
      {value: 2, item: 'Task'},
      {value: 3, item: 'Feature request'},
      {value: 4, item: 'Support request'},
      {value: 5, item: 'Plan'},
    ],
    priorityOptions: [
      {value: '_any', item: 'Any priority'},
      {value: 400, item: 'Critical'},
      {value: 300, item: 'Major'},
      {value: 200, item: 'Normal'},
      {value: 100, item: 'Minor'},
    ],
    versionOptions: [
      {value: '_any', item: 'Any version'},
      {value: '8.x', item: 'Drupal 8'},
      {value: '7.x', item: 'Drupal 7'},
    ],
  };
  static categoryChange(e) {
    console.log(e.target.value);
  }
  static priorityChange(e) {
    console.log(e.target.value);
  }
  static versionChange(e) {
    console.log(e.target.value);
  }
  render() {
    return(
      <div className="is-flex is-clearfix board--filters">
        <Select data={this.state.categoryOptions} label="Category" onChange={Filters.categoryChange}/>
        <Select data={this.state.priorityOptions} label="Priority" onChange={Filters.priorityChange}/>
        <Select data={this.state.versionOptions} label="Versions" onChange={Filters.versionChange}/>
      </div>
    )
  }
}
export default Filters;
