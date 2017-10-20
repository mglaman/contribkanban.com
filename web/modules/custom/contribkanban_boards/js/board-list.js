(function (d, $, cK) {
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
      $('.board--list').each(function (i, el) {
        var $el = $(el);
        var $list = $el.find('[data-drupal-selector="board-list"]');
        var $count = $el.find('[data-drupal-selector="board-count"]');

        var payload = $list.data();

        var url = new ApiUrl()
          .setEntityEndpoint('node')
          .addParameter('limit', 100)
          .addParameter('type', 'project_issue')
          .addParameter('sort', 'field_issue_priority')
          .addParameter('direction', 'DESC');

        $.each(payload['projects'], function (i, v) {
          url.addParameter('field_project[target_id][]', v);
        });
        $.each(payload['statuses'], function (i, v) {
          url.addParameter('field_issue_status[value][]', v);
        });
        if (payload['category'] !== null) {
          url.addParameter('field_issue_category', payload['category']);
        }
        if (payload['tag'] !== null) {
          url.addParameter('taxonomy_vocabulary_9[tid][]', payload['tag']);
        }
        if (payload['parent'] !== null) {
          url.addParameter('field_issue_parent', payload['parent']);
        }
        if (payload['priority'] !== null) {
          url.addParameter('field_issue_priority', payload['priority']);
        }
        if (payload['version'] !== null) {
          url.addParameter('field_issue_version', payload['version']);
        }
        if (payload['component'] !== null) {
          url.addParameter('field_issue_component', payload['component']);
        }

        console.log(url.getEndpointUrl());
        $.ajax(url.getEndpointUrl(), {
          method: 'GET',
          error: function (e) {
            console.log(e);
          },
          success: function (data, textStatus, jqXHR) {
            $count.html(data.list.length);
            var $listItems = $list.find('.board--list__items');
            $.each(data.list, function (index, issue) {
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
    return '<div class="board--list__item card" style="background-color: ' + cK.mappings.statusToColor[parseInt(issue.field_issue_status)] + '">' +
      '<h3>' + issue.title + ' ' + Drupal.theme('issueLink', issue.nid) + '</h3>' +
      '<div class="kanban-board--issue_tags">' +
      '<span class="tag bg-success">' + issue.field_issue_version + '</span>' +
      '<span class="tag is-' + cK.mappings.priorityToClass[parseInt(issue.field_issue_priority)] + '">' + cK.mappings.priorityToLabel[issue.field_issue_priority] + '</span>' +
      '<span class="tag is-default">' + issue.field_issue_component + '</span>' +
      '<issue-meta-assigned></issue-meta-assigned>' +
      '<span class="tag is-' + cK.mappings.categoryToClass[issue.field_issue_category] + '">' + cK.mappings.categoryToLabel[issue.field_issue_category] + '</span>' +
      '<span class="tag is-default">' + issue.field_project.id + '</span>' +
      '</div>' +
    '</div>';
  };

})(Drupal, jQuery, window.cK);
