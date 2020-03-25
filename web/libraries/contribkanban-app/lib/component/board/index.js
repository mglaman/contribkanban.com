import React, { PureComponent } from 'react';
import Filters from "./filters";
import List from "./list";
import { Provider } from 'react-redux'

import {createStore} from 'redux';
import reducers from '../../reducers';

let store = createStore(reducers, {
  categoryFilterReducer: '_any',
  priorityFilterReducer: '_any',
  versionFilterReducer: '_any',
});

class Board extends PureComponent {
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
      <Provider store={store}>
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
      </Provider>
    )
  }
}
export default Board;
