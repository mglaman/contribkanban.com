import { createAction } from 'redux-actions';

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


// create-board-form
export const createBoardChangeProjectType = createAction('CREATE_BOARD_CHANGE_PROJECT_TYPE');
export const createBoardChangeBoardName = createAction('CREATE_BOARD_CHANGE_BOARD_NAME');
