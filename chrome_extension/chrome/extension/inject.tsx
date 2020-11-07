import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Background from '../../app/background/background';
import { config } from '../../app/config/config';
import store from '../../app/background/store/configure.store';

class InjectApp extends Component {
  render() {
    return (
        // @ts-ignore
      <Provider store={store}>
        <Background />
      </Provider>
    );
  }
}

(() => {
  const injectDOM = document.createElement('div');
  injectDOM.setAttribute('id', `linvo-app-${config.env}`);
  injectDOM.className = `linvo-app-influ-${config.env}`;
  injectDOM.style.textAlign = 'center';
  document.querySelector('html').appendChild(injectDOM);

  render(
    <InjectApp />
      ,
      injectDOM
  );
})();
