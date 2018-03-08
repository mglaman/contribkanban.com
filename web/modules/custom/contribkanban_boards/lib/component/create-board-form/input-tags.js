import React, {Component} from 'react';

class InputTags extends Component {
  constructor({ onChange }) {
    super();
    this.onChange = onChange;
    this.state = {
      tags: [
        // Provide a default empty text input.
        { tid: '' },
      ],
    };
  }
  changeHandler(e) {
    this.onChange(e);
  }
  render() {
    return (
      <div className="field">
        <label className="label sr-only">Tags</label>
        {this.state.tags.map((tag, id) => (
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Term ID"
              value={tag.tid}
              style={{
                marginBottom: '10px',
              }}
              onChange={(e) => {
                const newNid = e.target.value;
                this.setState({
                  tags: this.state.tags.map((s, _id) => {
                    if (_id !== id) return s;
                    return { ...s, tid: newNid };
                  }),
                }, () => this.changeHandler(this.state.tags));
              }}
            />
          </div>
        ))}
        <button
          className="is-info button is-small"
          type="button"
          onClick={(e) => {
            this.setState({
              tags: this.state.tags.concat([{ tid: '' }])
            });
          }}
        >Add another</button>
      </div>
    );
  }
}
export default InputTags;
