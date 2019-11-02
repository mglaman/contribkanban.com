const domReady = callback => {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    const listener = () => {
      callback();
      document.removeEventListener('DOMContentLoaded', listener);
    };
    document.addEventListener('DOMContentLoaded', listener);
  }
};
domReady(() => {
  let embedParam = false;
  try {
    const params = new URLSearchParams(window.location.search);
    embedParam = params.has('embed')
  } catch(e) {}
  if (window.frameElement !== null || embedParam === true) {
    document.querySelector('header[role="banner"]').classList.add('hidden');
  }
});
