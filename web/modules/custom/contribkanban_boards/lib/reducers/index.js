import { combineReducers } from 'redux'
import {
  categoryFilterReducer,
  priorityFilterReducer,
  versionFilterReducer
} from "./filters";

export default combineReducers({
  categoryFilterReducer,
  priorityFilterReducer,
  versionFilterReducer
});
