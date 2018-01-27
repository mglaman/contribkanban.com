import React from 'react';
import { render } from 'react-dom';
import Board from "./component/board";

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
