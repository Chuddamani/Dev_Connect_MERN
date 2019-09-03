import { REGISTER_SUCCESS, REGISTER_FAIL } from '../actions/types';

const initialState = {
  //localStorage is vanila javaScript method to get a data stored locally
  token: localStorage.getItem('token'),
  isAuthenticated: null, // when successfully authenticated we make it true
  loading: true, // When loading is done we make it false
  user: null
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };
    case REGISTER_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    default:
      return state;
  }
}
