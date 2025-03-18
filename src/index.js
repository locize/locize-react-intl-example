import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// see ./locize-helper.js the overriden IntlProvider takes care of
// detecting user language and loading translations from locize CDN
// you can add one prop namespace to set which translation file to use
import { IntlProvider } from './locize-helper';

const root = createRoot(document.getElementById('root'))
root.render(
  <IntlProvider namespace="app">
    <App/>
  </IntlProvider>
);

registerServiceWorker();
