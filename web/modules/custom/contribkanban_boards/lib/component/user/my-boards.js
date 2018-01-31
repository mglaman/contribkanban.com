import React, { Component } from 'react';
import superagent from 'superagent';
import PropTypes from 'prop-types'

const baseUrl = `${window.location.origin}${drupalSettings.path.baseUrl}`;

class MyBoards extends Component {
  static propTypes = {
    uid: PropTypes.number,
  };
  state = {
    loaded: false,
    boards: [],
  };
  componentDidMount() {
    superagent
      .get(`${baseUrl}api/user/${this.props.uid}/boards`)
      .end((err, { body }) => {
        this.setState({
          loaded: true,
          boards: body,
        })
      });
  }
  render() {
    return (
      <div className="box">
        <a className="is-pulled-right button is-outlined is-info" href={`${baseUrl}user/${this.props.uid}/node-boards/add`}>Add Board</a>
        <h2 className="is-size-4">My Boards</h2>
        <table className="table is-fullwidth">
          <thead>
          <tr>
            <th>Title</th>
            <th>Links</th>
          </tr>
          </thead>
          <tbody>
          {this.state.boards.map(board => (
            <tr>
              <td>
                <a href={`${baseUrl}node-board/${board.uuid}`}>{board.title}</a>
              </td>
              <td>
                <nav className="level is-mobile">
                  <div className="level-left">
                    <a className="level-item">
                      <a href={`${baseUrl}node-board/${board.uuid}/edit`}>Edit</a>
                    </a>
                  </div>
                </nav>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default MyBoards;
