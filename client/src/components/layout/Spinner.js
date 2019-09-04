import React, { Fragment } from 'react';
import spinner from './gif/spinner.gif';

export default () => (
  <Fragment>
    <img
      src={spinner}
      style={{ width: '200px', margin: 'auto', display: 'block' }}
      alt='LOading...'
    ></img>
  </Fragment>
);
