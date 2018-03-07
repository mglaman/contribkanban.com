import React, {Component} from 'react';

class InputTags extends Component {
  state = {
    tags: [
      // Provide a default empty text input.
      {tid: ''}
    ],
  };
  render() {
    return(
      <div className="field box">
        <label className="label">Tags</label>
        {this.state.tags.map((tag, id) => (
          <div className="control">
            <input
              className="input"
              type="text"
              value={tag.tid}
              style={{
                marginBottom: '10px'
              }}
              onChange={(e) => {
                const newNid = e.target.value;
                this.setState({
                  tags: this.state.tags.map((s, _id) => {
                    if (_id !== id) return s;
                    return { ...s, tid: newNid};
                  }),
                });
              }}
            />
          </div>
        ))}
        <button
          className="is-info button"
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
