import { combineReducers } from 'redux';
import user from './reducers/user';
import post from './reducers/posts';

const rootReducer = combineReducers({
  user,
  post,
});

export default rootReducer;
