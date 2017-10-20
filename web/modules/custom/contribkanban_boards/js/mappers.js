window.cK = window.Ck || {};
window.cK.mappings = {
  statusToColor: {
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
  },
  statusToLabel: {
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
  },
  priorityToLabel: {
    400: 'Critical',
    300: 'Major',
    200: 'Normal',
    100: 'Minor'
  },
  priorityToClass: {
    400: 'danger',
    300: 'warning',
    200: 'info',
    100: 'active'
  },
  categoryToLabel: {
    1: 'Bug',
    2: 'Task',
    3: 'Feature',
    4: 'Support',
    5: 'Plan'
  },
  categoryToClass: {
    1: 'danger',
    2: 'info',
    3: 'info',
    4: 'active'
  }
}
