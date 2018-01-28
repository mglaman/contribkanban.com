import superagent from 'superagent';
import superagentCache from 'superagent-cache';
superagentCache(superagent);

// export const requestListIssues = (endpoint) => ({
//   type: 'REQUEST_LIST_ISSUES',
//   endpoint
// });
// export const receiveListIssues = (endpoint, list) => ({
//   type: 'RECEIVE_LIST_ISSUES',
//   endpoint,
//   list
// });
// export const getListIssues = (endpoint) => (dispatch) => {
//   return dispatch(apiFetch(endpoint));
// };
//
// const apiFetch = (endpoint) => (dispatch) => {
//   dispatch(requestListIssues(endpoint));
//   const request = superagent
//     .get(endpoint)
//     .backgroundRefresh();
//   return request
//   .end((err, { body }) => {
//     return dispatch(receiveListIssues(endpoint, body.list));
//   })
// };

export const categoryFilterUpdated = (value) => {
  return {
    type: 'CATEGORY_FILTER_UPDATED',
    value
  }
};
export const priorityFilterUpdated = (value) => {
  return {
    type: 'PRIORITY_FILTER_UPDATED',
    value
  };
};
export const versionFilterUpdated = (value) => {
  return {
    type: 'VERSION_FILTER_UPDATED',
    value
  };
};
