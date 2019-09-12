import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Routes from './components/routing/Routes';

// Reduc -> react-redux combines both react and redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []); // Adding empty brackets makes it run only ones
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route component={Routes}></Route>
        </Fragment>
      </Router>
    </Provider>
  );
};
export default App;
