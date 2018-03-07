import React, {Component} from 'react';

class InputProjects extends Component {
  state = {
    projects: [
      // Provide a default empty text input.
      {nid: ''}
    ],
  };
  render() {
    return(
      <div className="field">
        <label className="label sr-only">Projects</label>
        {this.state.projects.map((node, id) => (
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Project Node ID"
              value={node.nid}
              style={{
                marginBottom: '10px'
              }}
              onChange={(e) => {
                const newNid = e.target.value;
                this.setState({
                  projects: this.state.projects.map((s, _id) => {
                    if (_id !== id) return s;
                    return { ...s, nid: newNid};
                  }),
                });
              }}
            />
          </div>
        ))}
        <button
          className="is-info button is-small"
          type="button"
          onClick={(e) => {
            this.setState({
              projects: this.state.projects.concat([{ nid: '' }])
            });
          }}
        >Add another</button>
      </div>
    );
  }
}
export default InputProjects;
