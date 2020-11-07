import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from '../background/store/configure.store';

interface ToAdd {
    component: React.ReactElement, appendTo: any; identifier?: string;
}

export class AppendComponent {
  static generateId = function () {
        // Math.random should be unique because of its seeding algorithm.
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
    return `_${Math.random().toString(36).substr(2, 9)}`;
  };

  static add(component: ToAdd) {
    const appendSelector = typeof component.appendTo === 'string' ? document.querySelector(component.appendTo) : component.appendTo;
    if (appendSelector.querySelector(`.${component.identifier || 'react'}`)) {
      return;
    }
    const element = document.createElement('div');
    element.className = component.identifier || 'react';

    appendSelector.append(element);

    ReactDOM.render(
        // @ts-ignore
      <Provider store={store}>
        {component.component}
      </Provider>
    , element);
  }
}
