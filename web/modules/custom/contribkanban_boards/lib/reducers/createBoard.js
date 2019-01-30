import { handleActions } from 'redux-actions'

export const createBoard = handleActions({
  'CREATE_BOARD_CHANGE_BOARD_NAME': (state, { payload }) => {
    return {
      ...state,
      boardName: payload
    }
  },
  'CREATE_BOARD_CHANGE_PROJECT_TYPE': (state, { payload }) => {
    const newState = {
      ...state,
      projectType: payload,
      filterByProject: payload === 'drupalorg_custom'
    };

    if (payload === 'drupalorg_core') {
      newState['projectNids'] = [
        {nid: '3060'}
      ]
    }
    return newState;
  }
}, {
  boardName: '',
  projectType: '',
  projectNids: [],
  filterByProject: false,
});
