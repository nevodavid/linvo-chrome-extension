import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import axios from 'axios';

import Root from '../../app/containers/Root';
// @ts-ignore
import { adapter } from '../../app/config/axios/adapter';
import Config from '../../app/components/config/config';

export const axiosInstance = axios.create({
  adapter,
});

chrome.storage.local.get('state', (obj) => {
  const root = document.querySelector('#linvo-root');
  if (!root) {
      return ;
  }
  const { state } = obj;
  const initialState = JSON.parse(state || '{}');
  const createStore = require('../../app/store/configureStore');

  ReactDOM.render(
      <Provider store={createStore(initialState)}>
          <>
            <Root />
            <Config />
          </>
      </Provider>
    ,
      root
    );
});
