import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const bus = window.__Bus__.host;
bus.createApp('react-app')
  .bootstrap(async (config) => {
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      config.mountPoint
    );
  })
  .destroy(async (config) => {
    ReactDOM.unmountComponentAtNode(config.mountPoint)
  });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
