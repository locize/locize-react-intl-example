import React, { Component } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from './locize';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">
            <FormattedMessage
              id="app.title"
              defaultMessage="Welcome to {what}"
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
