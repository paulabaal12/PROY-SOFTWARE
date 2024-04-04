import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
    </Switch>
  </Router>
);

export default Routes;