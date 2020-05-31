import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import {createGlobalStyle} from "styled-components";
import EventsList from "../components/events/events.list.component";
import WidgetsPage from "../components/widgets/widgets.page";
import ManageWidgetPage from "../components/widgets/manage.widget.page";

class LoggedComponent extends Component {
  render() {
    return (
        <>
          <Switch>
              <Route exact={true} component={WidgetsPage} path="/widgets" />
              <Route exact={true} component={ManageWidgetPage} path="/widgets/manage/:domain/:id" />
              <Route component={EventsList} path="/" />
          </Switch>
        </>
    );
  }
}

export default LoggedComponent;
