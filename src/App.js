import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// see ./locize/index.js in development mode the react-intl components are
// extended to provide features like save of new ids, ...
// in production you get the regular unextended react-intl components
import { FormattedMessage, FormattedHTMLMessage } from './locize';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">
            <FormattedMessage
              id="app.title"
              defaultMessage="Welcome to {what} combined with locize"
              description="Welcome header on app main page"
              values={{ what: 'react-intl' }}
            />
          </h1>
        </header>
        <p className="App-intro">
          <FormattedHTMLMessage
            id="app.intro"
            defaultMessage="To get started, edit <code>src/App.js</code> and save to reload."
            description="Text on main page"
          />
        </p>
      </div>
    );
  }
}

export default App;
