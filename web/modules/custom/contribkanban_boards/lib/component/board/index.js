import React, { Component } from 'react';
import Filters from "./filters";
import List from "./list";

class Board extends Component {
  state = {
    loaded: false,
    board: []
  };
  componentDidMount() {
    this.setState({
      loaded: true,
      board: drupalSettings.board
    })
  }
  render() {
    return(
      <div style={{
        position: 'relative',
        height: '100%',
      }}>
        <Filters/>
        <div className="board--list__scroll-fix">
          <div className="board--list__container">
            {this.state.loaded ? [
              this.state.board.map(list => (
                <List label={list.title} data={list}/>
              ))
            ] : []}
          </div>
        </div>
      </div>
    )
  }
}
export default Board;
