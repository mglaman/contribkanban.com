import React, { Component } from "react";
import Filters from "./filters";
import List from "./list";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducers from "../../reducers";
import ApiUrl from "../../url";

import { baseUrl } from "../../utils";

let store = createStore(reducers, {
  categoryFilterReducer: "_any",
  priorityFilterReducer: "_any",
  versionFilterReducer: "_any",
});

class NodeBoard extends Component {
  state = {
    loaded: false,
    issues: [],
  };
  componentDidMount() {
    const nids = JSON.parse(drupalSettings.board.nids);
    let apiUrl;
    for (let i = 0; i < nids.length; i++) {
      apiUrl = new ApiUrl("node");
      apiUrl.addParameter("nid[]", nids[i]);
      console.log(apiUrl.getEndpointUrl());
      fetch(apiUrl.getEndpointUrl())
        .then((resp) => resp.json())
        .then((json) =>
          this.setState((prevState) => ({
            loaded: true,
            issues: [...prevState.issues, json.list[0]],
          }))
        );
    }
  }
  render() {
    const uuid = drupalSettings.board.uuid;
    return (
      <Provider store={store}>
        <div
          style={{
            position: "relative",
            height: "100%",
          }}
        >
          <div className="board--filters is-pulled-right ">
            <div className="control">
              {uuid.length > 0
                ? [
                    <a
                      className="button is-outlined is-info"
                      href={`${baseUrl}node-board/${uuid}/edit`}
                    >
                      Edit
                    </a>,
                  ]
                : [
                    <a
                      className="button is-outlined is-info"
                      href={`${baseUrl}user/${drupalSettings.user.uid}`}
                    >
                      Back
                    </a>,
                  ]}
            </div>
          </div>
          <Filters />
          <div className="board--list__scroll-fix">
            <div className="board--list__container">
              <List
                label="Postponed"
                data={this.state.issues}
                statuses={[4, 6]}
              />
              <List label="Active" data={this.state.issues} statuses={[1]} />
              <List
                label="Needs Work"
                data={this.state.issues}
                statuses={[13]}
              />
              <List
                label="Needs Review"
                data={this.state.issues}
                statuses={[8]}
              />
              <List
                label="Reviewed & Tested"
                data={this.state.issues}
                statuses={[14, 15]}
              />
              <List label="Fixed" data={this.state.issues} statuses={[2]} />
            </div>
          </div>
        </div>
      </Provider>
    );
  }
}
export default NodeBoard;
