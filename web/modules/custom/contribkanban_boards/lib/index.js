import React from 'react';
import { render } from 'react-dom';
import Board from "./component/board";
import AddBoard from "./component/add-board";
import AddSprint from "./component/add-sprint";

if (document.getElementById('Board')) {
  // @todo move into component?
  let resizeTimer;
  let $banner = document.querySelector('header[role="banner"]');
  let elMain = document.querySelector('main[role="main"]');
  elMain.style.height = (window.innerHeight - $banner.offsetHeight) + 'px';
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      elMain.style.height = (window.innerHeight - $banner.offsetHeight) + 'px';
    }, 250);
  });
  render(<Board/>, document.getElementById('Board'));
}
if (document.getElementById('AddBoard')) {
  render(<AddBoard/>, document.getElementById('AddBoard'));
}
if (document.getElementById('AddSprint')) {
  render(<AddSprint />, document.getElementById('AddSprint'));
}
