import axios from 'axios';
import { setAlert } from './alert';

import { GET_PROFILE, PROFILE_EROR } from './types';

// Get the current users profile
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get('/api/profile/me');

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: PROFILE_EROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status
      }
    });
  }
};
