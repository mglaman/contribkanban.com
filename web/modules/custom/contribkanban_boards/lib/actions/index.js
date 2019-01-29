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
