import { GET_PROFILE, PROFILE_EROR, CLEAR_PROFILE } from '../actions/types';

const initialState = {
  profile: null,
  profiles: [], //List of profiles visited
  repos: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        loading: false,
        repos: [],
        error: null
      };
    case PROFILE_EROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}
