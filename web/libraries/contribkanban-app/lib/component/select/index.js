import React, { PureComponent } from 'react';
import { arrayOf, string, func, shape } from 'prop-types';

class Select extends PureComponent {
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
  constructor(props) {
    super(props);
    this.onChange = props.onChange;
  }
  changeHandler = e => {
    this.onChange(e);
  };
  render() {
    const { label, data, selected } = this.props;
    return (
      <div className={`form-item`}>
        <div className={`select`}>
          <select
            key={`select-${label || 'select'}`}
            onChange={this.changeHandler}
            value={selected}
            className={`form-select form-element form-element--type-select`}
          >
            {data.map(({ value, item }) => (
              <option key={`${item}-${value}`} value={value}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}

export default Select;
