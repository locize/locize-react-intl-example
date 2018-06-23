import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// see ./locize/index.js the overriden IntlProvider takes care of
// detecting user language and loading translations from locize CDN
import { IntlProvider } from "./locize";

ReactDOM.render(
  <IntlProvider>
    <App/>
  </IntlProvider>,
  document.getElementById('root')
);

registerServiceWorker();
