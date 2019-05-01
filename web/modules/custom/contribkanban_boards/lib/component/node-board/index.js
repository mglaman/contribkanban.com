import React, { Component } from 'react';
import Filters from "./filters";
import List from "./list";
import { Provider } from 'react-redux'
import CodeFund from '../codefund';
import {createStore} from 'redux';
import reducers from '../../reducers';
import ApiUrl from "../../url";

import superagent from 'superagent';
import superagentCache from 'superagent-cache';
import {baseUrl} from "../../utils";
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
    const nids = JSON.parse(drupalSettings.board.nids);
    console.log(nids);

    let apiUrl;
    for (let i = 0; i < nids.length; i++) {
      apiUrl = new ApiUrl('node');
      apiUrl.addParameter('nid[]', nids[i]);
      console.log(apiUrl.getEndpointUrl());
      superagent
        .get(apiUrl.getEndpointUrl())
        .backgroundRefresh()
        .end((err, { body }) => {
          console.log(body);
          this.setState(prevState => ({
            loaded: true,
            issues: [...prevState.issues, body.list[0]],
          }))
        })
    }
  }
  render() {
    const uuid = drupalSettings.board.uuid;
    return(
      <Provider store={store}>
        <div style={{
          position: 'relative',
          height: '100%',
        }}>
          <div className="board--filters is-pulled-right ">
            <div className="control">
              {uuid.length > 0 ? [
                <a className="button is-outlined is-info" href={`${baseUrl}node-board/${uuid}/edit`}>Edit</a>
              ] : [
                <a className="button is-outlined is-info" href={`${baseUrl}user/${drupalSettings.user.uid}`}>Back</a>
              ]}
            </div>
          </div>
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
          <CodeFund template={`bottom-bar`} theme={`light`}/>
        </div>
      </Provider>
    )
  }
}
export default NodeBoard;
