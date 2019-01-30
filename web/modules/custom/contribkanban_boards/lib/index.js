import React from 'react';
import { render } from 'react-dom';
import Board from './component/board';
import AddBoard from './component/add-board';
import AddSprint from './component/add-sprint';
import NodeBoard from './component/node-board';
import UserProfile from "./component/user";
import NodeBoardForm from "./component/node-board-form";
import CreateBoardForm from "./component/create-board-form";
import {
  createStore as createReduxStore,
} from "redux";
import {Provider} from "react-redux";

import reducers from './reducers';
const store = createReduxStore(
  reducers,
);

if (document.getElementById('Board')) {
  // @todo move into component?
  let resizeTimer;
  const $banner = document.querySelector('header[role="banner"]');
  const elMain = document.querySelector('main[role="main"]');
  elMain.style.height = `${window.innerHeight - $banner.offsetHeight}px`;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      elMain.style.height = `${window.innerHeight - $banner.offsetHeight}px`;
    }, 250);
  });
  render(<Board />, document.getElementById('Board'));
}
if (document.getElementById('NodeBoard')) {
  // @todo move into component?
  let resizeTimer;
  const $banner = document.querySelector('header[role="banner"]');
  const elMain = document.querySelector('main[role="main"]');
  elMain.style.height = `${window.innerHeight - $banner.offsetHeight}px`;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      elMain.style.height = `${window.innerHeight - $banner.offsetHeight}px`;
    }, 250);
  });
  render(<NodeBoard />, document.getElementById('NodeBoard'));
}
if (document.getElementById('AddBoard')) {
  render(<AddBoard />, document.getElementById('AddBoard'));
}
if (document.getElementById('AddSprint')) {
  render(<AddSprint />, document.getElementById('AddSprint'));
}
if (document.getElementById('UserProfile')) {
  render(<UserProfile />, document.getElementById('UserProfile'));
}

if (document.getElementById('NodeBoardAddForm')) {
  render(<NodeBoardForm/>, document.getElementById('NodeBoardAddForm'));
}


if (document.getElementById('CreateBoardForm')) {
  render(
    <Provider store={store}><CreateBoardForm/></Provider>,
    document.getElementById('CreateBoardForm')
  );
}
