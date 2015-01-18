'use strict';

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

projectKanbanApp.filter('issueBranchFilter', function () {
  return function(issues, branch) {
    return issues.filter(function(issue) {
      // If no branch...
      if (branch === undefined || branch == null) {
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

projectKanbanApp.filter('issuePriorityFilter', function () {
  return function(issues, priority) {
    return issues.filter(function(issue) {
      // If no priority...
      if (priority === undefined || priority == null || priority == '') {
        return true;
      }
      else {
        return issue.priority == priority;
      }
    });
  }
});

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

projectKanbanApp.filter('statusColorFilter', function() {
  var statusCodes = {
    1: '#f9f9f9',
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
