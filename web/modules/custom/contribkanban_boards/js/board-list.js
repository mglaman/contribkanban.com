(function (d, $, cK) {

  /**
   * Simple object property loop.
   *
   * @param {Object} obj
   * @param {function} callback
   */
  function objectForeach(obj, callback) {
    for (var i in obj) {
      if (!obj.hasOwnProperty(i)) continue;
      callback(i, obj[i]);
    }
  }

  function datasetToJson(map) {
    var dataset = {};
    objectForeach(map, function (i, v) {
      try {
        dataset[i] = JSON.parse(v);
      } catch (e) {
        dataset[i] = v;
      }
    });
    return dataset;
  }

  d.behaviors.boardViewPort = {
    attach: function (context) {
      var resizeTimer;
      var $banner = document.querySelector('header[role="banner"]');
      var elMain = document.querySelector('main[role="main"]');
      elMain.style.height = (window.innerHeight - $banner.offsetHeight) + 'px';
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          elMain.style.height = (window.innerHeight - $banner.offsetHeight) + 'px';
        }, 250);
      });
    }
  };
  d.behaviors.boardLists = {
    attach: function (context) {
      objectForeach(document.querySelectorAll('.board--list'), function (i, el) {
        var $el = el;
        var $list = $el.querySelector('[data-drupal-selector="board-list"]');
        var $count = el.querySelector('[data-drupal-selector="board-count"]');

        var payload = datasetToJson($list.dataset);

        var url = new ApiUrl()
          .setEntityEndpoint('node')
          .addParameter('limit', 100)
          .addParameter('type', 'project_issue')
          .addParameter('sort', 'field_issue_priority')
          .addParameter('direction', 'DESC');


        objectForeach(payload['projects'], function (i, v) {
          url.addParameter('field_project[target_id][]', v);
        });
        objectForeach(payload['statuses'], function (i, v) {
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
        objectForeach(payload['version'], function (i, v) {
          url.addParameter('field_issue_version[value][]', v);
        });
        if (payload['component'] !== null) {
          url.addParameter('field_issue_component', payload['component']);
        }

        $.ajax(url.getEndpointUrl(), {
          method: 'GET',
          error: function (e) {
            console.log(e);
          },
          success: function (data, textStatus, jqXHR) {
            $count.innerHTML = data.list.length;
            var $listItems = $list.querySelector('.board--list__items');
            objectForeach(data.list, function (index, issue) {
              var el = document.createElement('div');
              el.innerHTML = d.theme('issueCard', issue);
              $listItems.appendChild(el);
            })
          },
          complete: function () {
            $el.querySelector('.board--list__refresh').style.display = 'none';
          }
        });
      });
    }
  };
  d.behaviors.boardFilters = {
    attach: function (context) {
      var activeFilters = {};
      var elFilters = document.querySelectorAll('select[data-card-filter]');
      objectForeach(elFilters, function (i, el) {
        el.addEventListener('change', function (e) {
          var cardFilter = this.dataset['cardFilter'];
          delete(activeFilters[cardFilter]);
          var selected = parseInt(this.selectedOptions[0].value);

          var selector = 'div.board--list__item';
          objectForeach(document.querySelectorAll(selector), function (i, e) {
            e.classList.add('is-hidden');
          });
          if (!isNaN(selected)) {
            activeFilters[cardFilter] = selected;
            // selector += ':not(.is-hidden)';
            objectForeach(activeFilters, function (i, v) {
              selector += '[' + i + '="' + v + '"]';
            });
          }
          var cardsToHide = document.querySelectorAll(selector);
          objectForeach(cardsToHide, function (i, v) {
            v.classList.remove('is-hidden');
          });
        })
      });
    }
  };

  d.theme.issueLink = function (nid) {
    return '<a class="kanban-board--issue__link" href="https://www.drupal.org/node/' + nid + '" target="_blank">#' + nid + '</a>';
  };
  d.theme.issueCard = function (issue) {
    return '<div class="board--list__item card" data-issue-priority="' + issue.field_issue_priority + '" data-issue-category="' + issue.field_issue_category + '" style="background-color: ' + cK.mappings.statusToColor[parseInt(issue.field_issue_status)] + '">' +
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
