import uuid from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

//setAlert is a action function , that returns a function (say X) , where (X) takes dispatch as the parameter
// export const setAlert = (msg, alertType) => dispatch => {
//   const id = uuid.v4();
//   dispatch({
//     type: SET_ALERT,
//     payload: {
//       msg,
//       alertType,
//       id
//     }
//   });
// };

//setAlert is a action function , that returns a function (say X) , where (X) takes dispatch as the parameter
export const setAlert = (msg, alertType, timeout = 5000) => {
  return dispatch => {
    const id = uuid.v4();
    dispatch({
      type: SET_ALERT,
      payload: {
        msg,
        alertType,
        id
      }
    });

    setTimeout(
      () =>
        dispatch({
          type: REMOVE_ALERT,
          payload: {
            id
          }
        }),
      timeout
    );
  };
};
