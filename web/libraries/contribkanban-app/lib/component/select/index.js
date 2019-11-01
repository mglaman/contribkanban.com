import React, { Component } from 'react';
import { arrayOf, string, func, shape } from 'prop-types';

class Select extends Component {
  static propTypes = {
    data: arrayOf(
      shape({
        item: string,
        value: string,
      }),
    ).isRequired,
    label: string.isRequired,
    onChange: func.isRequired,
    selected: string
  };
  constructor({ onChange }) {
    super();
    this.onChange = onChange;
  }
  changeHandler = e => {
    this.onChange(e);
  };
  render() {
    const { label, data, selected } = this.props;
    return (
      <div className="field">
        <div className="control">
          <div className="select">
            <select
              key={`select-${label || 'select'}`}
              onChange={this.changeHandler}
              value={selected}
            >
              {data.map(({ value, item }) => (
                <option key={`${item}-${value}`} value={value}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }
}

export default Select;
