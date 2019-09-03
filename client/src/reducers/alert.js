import { SET_ALERT, REMOVE_ALERT } from '../actions/types';
const initailState = [];

export default function(state = initailState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      console.log(state);
      return [...state, payload];
    case REMOVE_ALERT:
      //Here we are updating the state of alerts, we are returning the state of alert (collection of alerts)
      //that does not have the alert we wnat to remove
      return state.filter(alert => alert.id !== payload.id);
    default:
      return state;
  }
}
