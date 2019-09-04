import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// We are destructuring Component and any other parameter being passed using spread operator
const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loding },
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      !isAuthenticated && !loding ? (
        <Redirect to='/login'></Redirect>
      ) : (
        <Component {...props}></Component>
      )
    }
  ></Route>
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
