import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { baseUrl } from "../../utils";
import qs from 'qs';
import ApiUrl from '../../url'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  backgroundColor: isDragging ? "#209cee" : "white",
  paddingLeft: '2em',
  paddingTop: '0.5rem',
  paddingBottom: '0.5rem',
  paddingRight: '0.5rem',
  backgroundImage: `url('/core/misc/icons/bebebe/move.svg')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '0.5rem center',
  ...draggableStyle
});

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
    this.addNewIssue = this.addNewIssue.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.removeFixedIssues = this.removeFixedIssues.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState({processing: true}, () => {
      fetch(`${baseUrl}/session/token`)
        .then(res => res.text())
        .then(csrfToken => {
          let apiUrl, apiMethod;
          const payload = this.state.board;
          if (!this.isEdit()) {
            apiUrl = `${baseUrl}entity/node_board`;
            apiMethod = 'POST';
            delete payload['board_id'];
          } else {
            apiUrl = `${baseUrl}node-board/${this.state.board.uuid}`;
            apiMethod = 'PATCH'
          }
          fetch(apiUrl, {
            method: apiMethod,
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': csrfToken
            },
            body: JSON.stringify(payload)
          }).then(res => {
            if (res.statusCode === 200) {
              window.location.href = `${baseUrl}node-board/${this.state.board.uuid}`
            }
            return res.json();
          })
            .then(json => {
              window.location.href = `${baseUrl}node-board/${json.uuid}`
            })
            .catch(error => {
              console.error('Error:', error);
            });

        });
    });
  }
  getTitle() {
    return this.isEdit() ? 'Edit board' : 'Add new board';
  }
  isEdit() { return this.state.board.hasOwnProperty('board_id') && this.state.board.board_id !== null }
  canEdit() { return parseInt(this.state.uid) === parseInt(this.state.board.uid) }
  onCollaborationChange(event) {
    this.setState({
      board: {
        ...this.state.board,
        collaboration: event.target.value
      }
    });
  }
  addNewIssue() {
    this.setState({
      board: {
        ...this.state.board,
        nids: [...this.state.board.nids, '']
      },
    });
  }
  removeFixedIssues() {
    this.setState({
      processing: true,
    }, () => {
      const apiUrl = new ApiUrl('node').getEndpointUrl();
      const params = qs.stringify({
        nid: this.state.board.nids
      });
      fetch(apiUrl + params)
      .then(resp => resp.json())
      .then(json => {
        const newNids = json.list.filter(item => {
          return ![3,5,6,7,17,18].includes(parseInt(item.field_issue_status))
        }).map(item => item.nid);
        console.log(newNids)
        this.setState({
          processing: false,
          board: {
            ...this.state.board,
            nids: newNids
          },
        })
      })
    });
  }
  onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.board.nids,
      result.source.index,
      result.destination.index
    );

    this.setState({
      board: {
        ...this.state.board,
        nids: items
      }
    });
  }
  render() {
    return(
      <div className="columns">
        <div className="column is-10 is-offset-1">
          <form onSubmit={this.handleSubmit}>
            <div className="">
              <h1 className="title">{this.getTitle()}</h1>
              <div className="columns" style={{marginBottom: '1em'}}>
                <div className="column is-4">
                  <div className="box">
                    <div className="field">
                      <label for="board-title" className="label sr-only">Board name</label>
                      <div className="control">
                        <input
                          className="input"
                          id="board-title"
                          aria-label="Board name"
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
                            style={{marginRight: '5px'}}
                          />
                           Private: only accessible to you, when logged in
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
                            style={{marginRight: '5px'}}
                          />
                           Shared: only you may edit, but anyone can view via link access
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
                            style={{marginRight: '5px'}}
                          />
                           Public: anyone with the link can view and edit
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
                      <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable droppableId="droppable">
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {this.state.board.nids.map((item, index) => (
                                <Draggable key={item === '' ? `_new${index}` : item} draggableId={item === '' ? `_new${index}` : item} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={getItemStyle(
                                        snapshot.isDragging,
                                        provided.draggableProps.style
                                      )}
                                    >
                                        <div className="control">
                                          <label for={`issue-node-id-${index}`} className="label sr-only">Issue node ID</label>
                                          <input
                                            className="input"
                                            type="text"
                                            id={`issue-node-id-${index}`}
                                            placeholder={`Issue node ID`}
                                            value={item}
                                            required={this.state.board.nids.length === 1}
                                            onChange={(e) => {
                                              const newNid = e.target.value;
                                              this.setState({
                                                board: {
                                                  ...this.state.board,
                                                  nids: this.state.board.nids.map((s, _id) => {
                                                    if (_id !== index) return s;
                                                    return newNid;
                                                  })
                                                },
                                              });
                                            }}
                                          />
                                        </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                      <div className={`field is-grouped`}                        style={{
                          marginTop: '1em',
                          marginLeft: '2em',
                        }} >
                        <div className={`control`}>
                        <button
                        className="is-info button"
                        type="button"
                        onClick={this.addNewIssue}
                      >Add another issue</button>
                        </div>
                        <div className={`control`}>
                        <button
                        type="button"
                        onClick={this.removeFixedIssues}
                        className={`is-warning button ${this.state.processing ? ['is-loading'] : []}`}
                      >
                        Remove fixed issues
                      </button>
                        </div>
                      </div>
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
