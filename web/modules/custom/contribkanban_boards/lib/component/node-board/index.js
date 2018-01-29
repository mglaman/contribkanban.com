import React, { Component } from 'react';
import Filters from "./filters";
import List from "./list";
import { Provider } from 'react-redux'

import {createStore} from 'redux';
import reducers from '../../reducers';
import ApiUrl from "../../url";

import superagent from 'superagent';
import superagentCache from 'superagent-cache';
superagentCache(superagent);

let store = createStore(reducers, {
  categoryFilterReducer: '_any',
  priorityFilterReducer: '_any',
  versionFilterReducer: '_any',
});

class NodeBoard extends Component {
  state = {
    loaded: false,
    issues: []
  };
  componentDidMount() {
    const nids = JSON.parse(drupalSettings.board);
    console.log(nids);

    const apiUrl = new ApiUrl('node');
    for (let i = 0; i < nids.length; i++) {
      apiUrl.addParameter('nid[]', nids[i]);
    }
    console.log(apiUrl.getEndpointUrl());
    superagent
      .get(apiUrl.getEndpointUrl())
      .backgroundRefresh()
      .end((err, { body }) => {
        this.setState({
          loaded: true,
          issues: body.list,
        })
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
              <List label="Postponed" data={this.state.issues} statuses={[4,6]}/>
              <List label="Active" data={this.state.issues} statuses={[1]}/>
              <List label="Needs Work" data={this.state.issues} statuses={[13]}/>
              <List label="Needs Review" data={this.state.issues} statuses={[8]}/>
              <List label="Reviewed & Tested" data={this.state.issues} statuses={[14,15]}/>
              <List label="Fixed" data={this.state.issues} statuses={[2]}/>
            </div>
          </div>
        </div>
      </Provider>
    )
  }
}
export default NodeBoard;
