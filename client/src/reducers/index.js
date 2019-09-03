import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';

export default combineReducers({
  // We will add reduces here
  alert: alert,
  auth: auth
});
