import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../app/app/app';

(() => {
  const root = document.querySelector('#linvo-root');
  if (!root) {
    return;
  }

  ReactDOM.render(
    <App />,
        root
    );
})();
