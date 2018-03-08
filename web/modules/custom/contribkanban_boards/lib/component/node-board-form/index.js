import React, { Component } from 'react';
import superagent from 'superagent';

const baseUrl = `${window.location.origin}${drupalSettings.path.baseUrl}`;

class NodeBoardForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      processing: false,
      error: false,
      board: drupalSettings.form.board,
      uid: drupalSettings.form.uid,
      csrfToken: drupalSettings.form.csrfToken,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onCollaborationChange = this.onCollaborationChange.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      processing: true,
    }, () => {
      let request;
      if (!this.isEdit()) {
        request = superagent.post(`${baseUrl}entity/node_board`)
      } else {
        request = superagent.patch(`${baseUrl}/node-board/${this.state.board.uuid}`)
      }
      request
        .set('X-CSRF-Token', this.state.csrfToken)
        .send(this.state.board)
        .end((error, res) => {
          if (res.statusCode === 200) {
            this.analytics({
              hitType: 'event',
              eventCategory: 'Node Board',
              eventAction: 'edit',
              eventLabel: this.state.board.title
            });
            window.location.href = `${baseUrl}node-board/${this.state.board.uuid}`
          }
          else if (res.statusCode === 201) {
            const body = JSON.parse(res.text);
            this.analytics({
              hitType: 'event',
              eventCategory: 'Node Board',
              eventAction: 'add',
              eventLabel: this.state.board.title
            });
            window.location.href = `${baseUrl}node-board/${body.uuid[0].value}`
          }
          else {
            this.analytics({
              hitType: 'event',
              eventCategory: 'Add Node Board',
              eventAction: 'error',
              eventLabel: 'error'
            });
            console.log(error);
            console.log(res);
            alert('Error, check console logs');
          }
        });
    });
  }
  analytics(data) {
    if (typeof ga !== 'undefined') {
      ga('send', data);
    }
  }
  getTitle() {
    return this.isEdit() ? 'Edit board' : 'Add new board';
  }
  isEdit() { return this.state.board.board_id !== null }
  canEdit() { return parseInt(this.state.uid) === parseInt(this.state.board.uid) }
  onCollaborationChange(event) {
    this.setState({
      board: {
        ...this.state.board,
        collaboration: event.target.value
      }
    });
  }
  render() {
    return(
      <div className="columns">
        <div className="column is-8 is-offset-2">
          <form onSubmit={this.handleSubmit}>
            <div className="">
              <h1 className="title">{this.getTitle()}</h1>
              <div className="columns" style={{marginBottom: '1em'}}>
                <div className="column is-4">
                  <div className="box">
                    <div className="field">
                      <label className="label sr-only">Title</label>
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          placeholder={`Board name`}
                          required={true}
                          disabled={!this.canEdit() && this.isEdit()}
                          readOnly={!this.canEdit() && this.isEdit()}
                          value={this.state.board.title}
                          onChange={(e) => this.setState({
                            board: {
                              ...this.state.board,
                              title: e.target.value
                            }
                          })}
                        />
                      </div>
                    </div>
                    <div className={`field`}>
                      <label className={`has-text-weight-semibold`}>Collaboration</label>
                      <div className={`control`}>
                        <label className="radio">
                          <input
                            type="radio"
                            value={`private`}
                            checked={this.state.board.collaboration === 'private'}
                            onChange={this.onCollaborationChange}
                            disabled={!this.canEdit() && this.isEdit()}
                            readOnly={!this.canEdit() && this.isEdit()}
                            style={{marginRight: '5'}}
                          />
                          <span className={`is-small`}>Private: only accessible to you, when logged in</span>
                        </label>
                      </div>
                      <div className={`control`}>
                        <label className="radio">
                          <input
                            type="radio"
                            value={`shared`}
                            checked={this.state.board.collaboration === 'shared'}
                            onChange={this.onCollaborationChange}
                            disabled={!this.canEdit() && this.isEdit()}
                            readOnly={!this.canEdit() && this.isEdit()}
                            style={{marginRight: '5'}}
                          />
                          <span className={`is-small`}>Shared: only you may edit, but anyone can view via link access</span>
                        </label>
                      </div>
                      <div className={`control`}>
                        <label className="radio">
                          <input
                            type="radio"
                            value={`public`}
                            checked={this.state.board.collaboration === 'public'}
                            onChange={this.onCollaborationChange}
                            disabled={!this.canEdit() && this.isEdit()}
                            readOnly={!this.canEdit() && this.isEdit()}
                            style={{marginRight: '5'}}
                          />
                          <span className={`is-small`}>Public: anyone with the link can view and edit</span>
                        </label>
                      </div>
                    </div>
                    <div className="control">
                      <button
                        className={`is-primary button ${this.state.processing ? ['is-loading'] : []}`}
                        tabIndex={100}
                      >Submit</button>
                    </div>
                  </div>
                </div>
                <div className="column">
                  <div className={`box`}>
                    <div className="field">
                      <label className="label sr-only">Issue node IDs</label>
                      {this.state.board.nids.map((node, id) => (
                        <div className="control">
                          <input
                            className="input"
                            type="text"
                            placeholder={`Issue node ID`}
                            value={node}
                            style={{
                              marginBottom: '10px'
                            }}
                            required={this.state.board.nids.length === 1}
                            onChange={(e) => {
                              const newNid = e.target.value;
                              this.setState({
                                board: {
                                  ...this.state.board,
                                  nids: this.state.board.nids.map((s, _id) => {
                                    if (_id !== id) return s;
                                    return newNid;
                                  })
                                },
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
                            nodes: this.state.board.nids.push(""),
                          });
                        }}
                      >Add another issue</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default NodeBoardForm;
