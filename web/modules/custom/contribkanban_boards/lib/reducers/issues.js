const issues = (state = [], action) => {
  switch (action.type) {
    case 'REQUEST_LIST_ISSUES':
    case 'RECEIVE_LIST_ISSUES':
      debugger;
      return action;
    default:
      return state;
  }
};
export default issues;
