import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile';

export default combineReducers({
  // We will add reduces here
  alert: alert,
  auth: auth,
  profile: profile
});
