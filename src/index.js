import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { IntlProvider } from "./locize";

ReactDOM.render(
  <IntlProvider>
    <App/>
  </IntlProvider>,
  document.getElementById('root')
);

registerServiceWorker();
