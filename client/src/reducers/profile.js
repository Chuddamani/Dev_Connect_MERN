import {
  GET_PROFILE,
  PROFILE_EROR,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  GET_REPOS,
  GET_PROFILES
} from '../actions/types';

const initialState = {
  profile: null,
  profiles: [], //List of profiles present
  repos: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false
      };
    case GET_REPOS:
      return {
        ...state,
        repos: payload,
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
