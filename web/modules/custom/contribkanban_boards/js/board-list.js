(function (d, cK) {

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

        var apiRequest = new XMLHttpRequest();
        apiRequest.open('GET', url.getEndpointUrl(), true);
        apiRequest.addEventListener('error', function (e) {
          console.log(e);
          $el.querySelector('.board--list__refresh').style.display = 'none';
        });
        apiRequest.addEventListener('load', function (e) {
          var data = JSON.parse(this.responseText);
          $el.querySelector('.board--list__refresh').style.display = 'none';
          $count.innerHTML = data.list.length;
          var $listItems = $list.querySelector('.board--list__items');
          objectForeach(data.list, function (index, issue) {
            var el = document.createElement('div');
            el.innerHTML = d.theme('issueCard', issue);
            $listItems.appendChild(el.firstElementChild);
          })
        });
        apiRequest.send();
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
            objectForeach(activeFilters, function (i, v) {
              selector += '[' + i + '^="' + v + '"]';
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
    var tagTids = [];
    for (var i = 0; i < issue.taxonomy_vocabulary_9.length; i++) {
      tagTids.push(issue.taxonomy_vocabulary_9[i].id);
    }
    var template = new Template();
    return template.format('<div class="board--list__item card" data-issue-priority="{{ priority }}" data-issue-category="{{ category }}" data-issue-version="{{ version }}" data-issue-tags="{{ issueTags }}" style="background-color: {{ card_bg_color }}">' +
      '<h3>{{ title }} {{ link }}</h3>' +
      '<div class="kanban-board--issue_tags">' +
      '<span class="tag bg-success">{{ version }}</span>' +
      '<span class="tag is-{{ priority_class }}">{{ priority_label }}</span>' +
      '<span class="tag is-default">{{ component }}</span>' +
      '<issue-meta-assigned></issue-meta-assigned>' +
      '<span class="tag is-{{ category_class }}">{{ category_label }}</span>' +
      '<span class="tag is-default" data-project-nid="{{ project }}">{{ project }}</span>' +
      '</div>' +
      '</div>', {
      priority: issue.field_issue_priority,
      priority_class: cK.mappings.priorityToClass[parseInt(issue.field_issue_priority)],
      priority_label: cK.mappings.priorityToLabel[issue.field_issue_priority],
      category: issue.field_issue_category,
      category_class: cK.mappings.categoryToClass[issue.field_issue_category],
      category_label: cK.mappings.categoryToLabel[issue.field_issue_category],
      card_bg_color: cK.mappings.statusToColor[parseInt(issue.field_issue_status)],
      title: issue.title,
      link: Drupal.theme('issueLink', issue.nid),
      version: issue.field_issue_version,
      component: issue.field_issue_component,
      project: issue.field_project.id
    });
  };

})(Drupal, window.cK);
