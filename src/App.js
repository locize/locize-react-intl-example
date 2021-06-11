import React, { useContext } from 'react';
import logo from './logo.svg';
import './App.css';

// see ./locize-helper.js in development mode the react-intl components are
// extended to provide features like save of new ids, ...
// in production you get the regular unextended react-intl components
import { FormattedMessage, LanguageContext } from './locize-helper';

import ComponentWithAnotherNamespace from './ComponentWithAnotherNamespace';
import ComponentUsingMacro from './ComponentUsingMacro';

function App() {
  const { setLocale, locale } = useContext(LanguageContext);

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
      <div className="App-intro">
        <div>
          <button type="submit" onClick={() => setLocale('de')}>
            {locale !== 'de' && 'de'}
            {locale === 'de' && (<strong>de</strong>)}
          </button>
          <button type="submit" onClick={() => setLocale('en')}>
            {locale !== 'en' && 'en'}
            {locale === 'en' && (<strong>en</strong>)}
          </button>
        </div>
        <FormattedMessage
          id="app.intro"
          defaultMessage="To get started, edit <code>src/App.js</code> and save to reload."
          description="Text on main page"
          values={{
            code: (val) => <code>{val}</code>
          }}
        />
      </div>
      <ComponentWithAnotherNamespace locale={locale} />
      <hr />
      <ComponentUsingMacro locale={locale} />
    </div>
  );
}

export default App;
