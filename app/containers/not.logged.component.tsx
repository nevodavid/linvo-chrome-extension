import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import {createGlobalStyle} from "styled-components";
import LoginComponent from '../components/login/login.component';
import RegisterComponent from '../components/login/register.component';

const BodyChange = createGlobalStyle`
    body {
        width: 260px;
    }
`;
class NotLoggedComponent extends Component {
  render() {
    return (
        <>
          <BodyChange />
          <Switch>
              <Route exact={true} component={LoginComponent} path="/login" />
              <Route component={RegisterComponent} path="/" />
          </Switch>
        </>
    );
  }
}

export default NotLoggedComponent;
