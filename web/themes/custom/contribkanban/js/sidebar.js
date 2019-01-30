/* global domready */
(function (domready) {
  domready(function () {
    var $appHeader = document.querySelector('.app-header');
    var $appSidebar = document.querySelector('.app-sidebar');
    var $appBackdrop = document.querySelector('.app-sidebar__backdrop');
    var $trigger = document.querySelector('[data-drupal-selector="app-siderbar-trigger"]');
    $appHeader.addEventListener('click', function() {
      $appBackdrop.classList.remove('is-closed');
      $appBackdrop.classList.add('is-open');
      $appSidebar.classList.remove('is-closed');
      $appSidebar.classList.add('is-open');
    })
    $trigger.addEventListener('click', function () {
      $appBackdrop.classList.remove('is-closed');
      $appBackdrop.classList.add('is-open');
      $appSidebar.classList.remove('is-closed');
      $appSidebar.classList.add('is-open');
    });
    $appBackdrop.addEventListener('click', function () {
      $appBackdrop.classList.add('is-closed');
      $appBackdrop.classList.remove('is-open');
      $appSidebar.classList.add('is-closed');
      $appSidebar.classList.remove('is-open');
    });
  })
})(domready);
