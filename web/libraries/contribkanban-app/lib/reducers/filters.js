export const categoryFilterReducer = (state = [], action) => {
  switch (action.type) {
    case 'CATEGORY_FILTER_UPDATED':
      return action.value;
    default:
      return state;
  }
};
export const priorityFilterReducer = (state = [], action) => {
  switch (action.type) {
    case 'PRIORITY_FILTER_UPDATED':
      return action.value;
    default:
      return state;
  }
};
export const versionFilterReducer = (state = [], action) => {
  switch (action.type) {
    case 'VERSION_FILTER_UPDATED':
      return action.value;
    default:
      return state;
  }
};
