import React, { Component } from 'react';
import superagent from 'superagent';

const baseUrl = `${window.location.origin}${drupalSettings.path.baseUrl}`;

class NodeBoardForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: false,
      error: false,
      boardId: null,
      uid: drupalSettings.form.uid,
      boardName: '',
      nodes: [
        // Provide a default empty text input.
        {nid: ''},
      ],
      csrfToken: drupalSettings.form.csrfToken,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      processing: true,
    }, () => {
      const entityObject = {
        title: [{
          value: this.state.boardName
        }],
        uid: [{
          target_id: this.state.uid,
        }],
        nids: this.state.nodes.map(node => {
          return {value: node.nid}
        })
      };
      if (this.state.boardId !== null) {
        entityObject.board_id = [{
          value: this.state.boardId
        }];
      }

      console.log(entityObject);
      superagent
        .post(`${baseUrl}entity/node_board`)
        .set('X-CSRF-Token', this.state.csrfToken)
        .send(entityObject)
        .end((error, res) => {
          if (res.statusCode === 201) {
            const body = JSON.parse(res.text);
            window.location.href = `${baseUrl}node-board/${body.uuid[0].value}`
          }
          else {
            console.log(error);
            console.log(res);
            alert('Error, check console logs');
          }
        });
    });
  }
  render() {
    return(
      <form onSubmit={this.handleSubmit}>
        <div className="box">
          <h1 className="is-size-4">Add new node board</h1>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input className="input" type="text" value={this.state.boardName} onChange={(e) => this.setState({boardName: e.target.value})} />
            </div>
          </div>
          <div className="field">
            <label className="label">Issue node IDs</label>
            {this.state.nodes.map((node, id) => (
              <div className="control">
                <input
                  className="input"
                  type="text"
                  value={node.nid}
                  style={{
                    marginBottom: '10px'
                  }}
                  onChange={(e) => {
                    const newNid = e.target.value;
                    this.setState({
                      nodes: this.state.nodes.map((s, _id) => {
                        if (_id !== id) return s;
                        return { ...s, nid: newNid};
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
                  nodes: this.state.nodes.concat([{ nid: '' }])
                });
              }}
            >Add another</button>
          </div>
          <div className="control">
            <button className={`is-primary button ${this.state.processing ? ['is-loading'] : []}`}>Submit</button>
          </div>
        </div>
      </form>
    )
  }
}

export default NodeBoardForm;
