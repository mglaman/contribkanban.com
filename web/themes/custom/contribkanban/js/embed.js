(function (domready) {
    domready(function () {
        var queryString = window.location.search;

        var embedParam = false;
        try {
            var params = new URLSearchParams(window.location.search);
            embedParam = params.has('embed')
        } catch(e) {}

        if (window.frameElement !== null || embedParam === true) {
            var header =document.querySelector('header[role="banner"]');
            header.classList.add('hidden');
        }
    })
  })(domready);
  