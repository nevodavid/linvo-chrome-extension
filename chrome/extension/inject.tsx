import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import $ from 'jquery';
// @ts-ignore
import Config from '../../app/components/config/config';
import { ResetAll } from '../../app/components/events/event-tool/reset.all';
import PageControl from '../../app/components/events/event-tool/page.control';

class InjectApp extends Component {
  render() {
    return (
      <PageControl />
    );
  }
}

const loadApp = () => {
  const injectDOM = document.createElement('div');
  injectDOM.setAttribute('id', 'linvo-app');
  injectDOM.className = 'inject-react-example';
  injectDOM.style.textAlign = 'center';
  document.body.appendChild(injectDOM);


  chrome.storage.local.get('state', (obj) => {
    const { state } = obj;
    const initialState = JSON.parse(state || '{}');
    const createStore = require('../../app/store/configureStore');

    render(
      <Provider store={createStore(initialState)}>
        <ResetAll>
          <InjectApp />
          <Config />
        </ResetAll>
      </Provider>
        ,
        injectDOM
    );
  });
};

loadApp();

// @ts-ignore
window.connectToPlugin = (apiKey: string) => {
  $('#api-key').val(apiKey);
  $('input[type=submit]').trigger('click');
};

// @ts-ignore
window.reloadStore = () => {
  document.querySelector('#linvo-app').remove();
  loadApp();
};
