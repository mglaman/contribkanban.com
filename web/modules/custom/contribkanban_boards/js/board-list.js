(function (d, $) {
  d.behaviors.boardViewPort = {
    attach: function (context) {
      var $banner = $('[role="banner"]');
      $('[role="main"]').height(window.innerHeight - $banner.height());
      $(window).resize(function() {
        $('[role="main"]').height(window.innerHeight - $banner.height());
      });
    }
  };
  d.behaviors.boardLists = {
    attach: function (context) {
      // board--list
      $('.board--list').once('board-list-discovered').each(function (i, el) {
        var $el = $(el);
        var $list = $el.find('[data-drupal-selector="board-list"]');
        var $count = $el.find('[data-drupal-selector="board-count"]');

        var payload = $list.data();
        delete payload['jqueryOnceBoardListDiscovered'];
        delete payload['drupalSelector'];
        $.ajax(d.url('api/issues'), {
          method: 'POST',
          data: JSON.stringify(payload),
          dataType: 'json',
          contentType: "application/json; charset=utf-8",
          error: function (e) {
            console.log(e);
          },
          success: function (data, textStatus, jqXHR) {
            $count.html(data.length);
            var $listItems = $list.find('.board--list__items');
            $.each(data, function (index, issue) {
              $listItems.append(d.theme('issueCard', issue));
            })
          },
          complete: function () {
            $el.find('.board--list__refresh').hide();
          }
        });
      });
    }
  };

  d.theme.issueLink = function (nid) {
    return '<a class="kanban-board--issue__link" href="https://www.drupal.org/node/' + nid + '" target="_blank">#' + nid + '</a>';
  };
  d.theme.issueCard = function (issue) {
    var statusCodes = {
      1: '#fcfcfc',
      2: '#d7ffd8',
      3: '#fddddd',
      4: '#eff1f3',
      5: '#fddddd',
      6: '#fddddd',
      7: '#fddddd',
      8: '#ffffdd',
      13: '#ffece8',
      14: '#d7ffd8',
      15: '#d7ffd8',
      16: '#eff1f3',
      18: '#fddddd'
    };

    return '<div class="board--list__item" style="background-color: ' + statusCodes[issue.status] + '">' +
      '<h3>' + issue.summary + ' ' + Drupal.theme('issueLink', issue.nid) + '</h3>' +
      '<div class="kanban-board--issue_tags">' +
      '<span class="kanban-board--issue__version bg-success">' + issue.version + '</span>' +
      '<span class="kanban-board--issue__priority bg-' + issue.priority.replace(/\s+/g, '-').toLowerCase() + '">' + issue.priority + '</span>' +
      '<span class="kanban-board--issue__component bg-default">' + issue.component + '</span>' +
      '<issue-meta-assigned></issue-meta-assigned>' +
      '<span class="kanban-board--issue__component bg-' + issue.category.replace(/\s+/g, '-').toLowerCase() + '">' + issue.category + '</span>' +
      '<span class="kanban-board--issue__component btn-default">' + issue.project + '</span>' +
      '</div>' +
    '</div>';
  };

})(Drupal, jQuery);
