import React, { Component } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { connect } from 'react-redux';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';
import { AppState } from '../store/reducers/app.state';
import NotLoggedComponentTsx from './not.logged.component.tsx';
import LogoutComponent from '../components/login/logout.component';
import LoggedComponent from "./logged.component";
const history = createMemoryHistory();

const Global = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    padding-bottom: 10px;
    background: #021e47;
  }
`;

const DivWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 144px;
`;
export const ConnectPlugin = styled.div`
  color: #ffce00;
  font-size: 10px;
  cursor: pointer;
  margin-top: 10px;
`;

class App extends Component<{logged: boolean}> {
  render() {
    const { logged } = this.props;
    return (
      <Router history={history}>
        <DivWrapper>
          <Global />
          {logged ? (
            <LoggedComponent />
            ) : (
              <NotLoggedComponentTsx />
            )}
          <LeftWrapper>
            <img alt="linvo" src="img/linvonew2.png" style={{ maxHeight: 100, maxWidth: 100 }} />
            <LogoutComponent />
          </LeftWrapper>
        </DivWrapper>
      </Router>
    );
  }
}

export default connect((app: AppState) => ({ all: app, logged: Boolean(app.user.id) }))(App);
