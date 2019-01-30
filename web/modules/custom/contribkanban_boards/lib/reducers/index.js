import { combineReducers } from 'redux'
import {
  categoryFilterReducer,
  priorityFilterReducer,
  versionFilterReducer
} from "./filters";
import { createBoard } from "./createBoard";

export default combineReducers({
  categoryFilterReducer,
  priorityFilterReducer,
  versionFilterReducer,
  createBoard
});
