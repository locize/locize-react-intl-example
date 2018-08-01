import React from 'react';
import ReactDOM from 'react-dom';
import 'index.css';
import App from 'App';
import registerServiceWorker from 'registerServiceWorker';

// see ./locize/index.js the overriden IntlProvider takes care of
// detecting user language and loading translations from locize CDN
// you can add one prop namespace to set which translation file to use
import { IntlProvider } from "locize";

ReactDOM.render(
  <IntlProvider namespace="app">
    <App/>
  </IntlProvider>,
  document.getElementById('root')
);

registerServiceWorker();
