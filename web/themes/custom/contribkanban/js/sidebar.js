(function ($) {
  $(function () {
    var $appSidebar = $('.app-sidebar');
    var $appBackdrop = $('.app-sidebar__backdrop');
    var $trigger = $('[data-drupal-selector="app-siderbar-trigger"]');
    $trigger.click(function () {
      $appBackdrop.show();
      $appSidebar.show();
    });
    $appBackdrop.click(function () {
      $appBackdrop.hide();
      $appSidebar.hide();
    })
  })
})(jQuery);
