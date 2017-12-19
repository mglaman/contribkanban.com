(function (domready) {
  domready(function () {
    var $appHeader = document.querySelector('.app-header');
    var $appSidebar = document.querySelector('.app-sidebar');
    var $appBackdrop = document.querySelector('.app-sidebar__backdrop');
    var $trigger = document.querySelector('[data-drupal-selector="app-siderbar-trigger"]');
    $appHeader.addEventListener('click', function() {
      $appBackdrop.style.display = 'block';
      $appSidebar.style.display = 'block';
    })
    $trigger.addEventListener('click', function () {
      $appBackdrop.style.display = 'block';
      $appSidebar.style.display = 'block';
    });
    $appBackdrop.addEventListener('click', function () {
      $appBackdrop.style.display = 'none';
      $appSidebar.style.display = 'none';
    });
  })
})(domready);
