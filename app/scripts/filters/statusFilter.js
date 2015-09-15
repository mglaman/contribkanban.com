'use strict';

/**
 * @todo: Document this.
 */
projectKanbanApp.filter('issueIdFilter', function() {
  return function(issues, ids) {
    return issues.filter(function(issue) {
      for(var i in ids) {
        if (issue.status == ids[i]) {
          return true;
        }
      }
      return false;
    });
  }
});

/**
 * @todo: Document this.
 */
projectKanbanApp.filter('issueBranchFilter', function () {
  return function(issues, branch) {
    return issues.filter(function(issue) {
      // If no branch...
      if (branch === undefined || branch == null || branch == '') {
        return true;
      }
      else {
        if (issue.version === undefined || issue.version == null) {
          return false;
        }
        return !issue.version.indexOf(branch.slice(0, -1));
      }
    });
  }
});

/**
 * @todo: Document this.
 */
projectKanbanApp.filter('issuePriorityFilter', function () {
  return function(issues, priority) {
    return issues.filter(function(issue) {
      // If no priority...
      if (priority === undefined || priority == null || priority == '' || priority == 0) {
        return true;
      }
      else {
        return issue.priority == priority;
      }
    });
  }
});

/**
 * @todo: Document this.
 */
projectKanbanApp.filter('issueCategoryFilter', function () {
  return function(issues, category) {
    return issues.filter(function(issue) {
      // If no category...
      if (category === undefined || category == null || category == '' || category == 0) {
        return true;
      }
      else {
        return issue.category == category;
      }
    });
  }
});

/**
 * @todo: Document this.
 */
projectKanbanApp.filter('issueNeedsFilter', function () {
  return function(issues, needsTid) {
    return issues.filter(function(issue) {
      // If no priority...
      if (needsTid === undefined || needsTid == null || needsTid == '') {
        return true;
      }
      else {
        for (var i = 0; i < issue.tags.length; i++) {
          if (issue.tags[i].id == needsTid) {
            return true;
          }
        }
        return false;
      }
    });
  }
});

/**
 * Turns status codes into labels.
 */
projectKanbanApp.filter('statusLabelFilter', function() {
  var statusCodes = {
    1: 'Active',
    2: 'Fixed',
    3: 'Closed (Duplicate)',
    4: 'Postponed',
    5: 'Closed (Won\'t Fix)',
    6: 'Closed (Works as designed)',
    7: 'Closed (Fixed)',
    8: 'Needs Review',
    13: 'Needs Work',
    14: 'RTBC',
    15: 'Patch (to be ported)',
    16: 'Postponed (Needs more info)',
    18: 'Closed (Cannot Reproduce)'
  };

  return function(input) {
    if (!input) {
      return '';
    }

    return statusCodes[input];
  }
});

/**
 * Turns status codes into colors.
 */
projectKanbanApp.filter('statusColorFilter', function() {
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

  return function(input) {
    if (!input) {
      return '';
    }

    return statusCodes[input];
  }
});

/**
 * Turns priority codes into labels.
 */
projectKanbanApp.filter('priorityLabelFilter', function() {
  var statusCodes = {
    400: 'Critical',
    300: 'Major',
    200: 'Normal',
    100: 'Minor'
  };

  return function(input) {
    if (!input) {
      return '';
    }

    return statusCodes[input];
  }
});

/**
 * Turns priority codes into labels.
 */
projectKanbanApp.filter('priorityClassFilter', function() {
  var statusCodes = {
    400: 'danger',
    300: 'warning',
    200: 'info',
    100: 'active'
  };
  return function(input) {
    if (!input) {
      return '';
    }

    return statusCodes[input];
  }
});

/**
 * Turns category codes into labels.
 */
projectKanbanApp.filter('categoryLabelFilter', function() {
  var statusCodes = {
    1: 'Bug',
    2: 'Task',
    3: 'Feature',
    4: 'Support'
  };

  return function(input) {
    if (!input) {
      return '';
    }

    return statusCodes[input];
  }
});

/**
 * Turns priority codes into labels.
 */
projectKanbanApp.filter('categoryClassFilter', function() {
  var statusCodes = {
    1: 'danger',
    2: 'info',
    3: 'info',
    4: 'active'
  };
  return function(input) {
    if (!input) {
      return '';
    }

    return statusCodes[input];
  }
});
