import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const linvo = document.createElement('linvo-app-client');
document.body.append(linvo);

ReactDOM.render(
  <App />,
    linvo
);
