import React, { Component } from 'react';
import { FormattedMessage as FM, IntlProvider as IP } from 'react-intl';
import locizer from 'locizer';
import 'locize';

const IS_DEV = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const DEFAULTNAMESPACE = 'common'; // the translation file to use
const PROJECTID = 'da028c03-435a-4587-af3a-086de8c7bd9b'; // your project id
const APIKEY = 'ENTER_YOUR_API_KEY_FOR_SAVE_MISSING';
const SAVE_NEW_VALUES = true; // should send newly added react-intl Formatted(HRML)Message to locize
const UPDATE_VALUES = true; // should update on locize if value changes in code

locizer.init({
  projectId: PROJECTID,
  apiKey: APIKEY
});

let translations = {};
let currentLocale;

const LocizeContext = React.createContext({
  locale: null,
  namespace: null
});

export const LanguageContext = LocizeContext;

export class IntlProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locale: null,
      setLocale: (locale) => {
        this.setState({ locale });

        if (window.history.pushState) {
          const url = new URL(window.location);
          if (url.searchParams.has('lng')) {
            url.searchParams.set('lng', locale);
          } else {
            url.searchParams.append('lng', locale);
          }
          window.history.pushState({}, '', url);
        }
      }
    };
  }

  componentDidMount() {
    const namespace = this.props.namespace || DEFAULTNAMESPACE;

    // return if already loaded
    if (currentLocale && translations[currentLocale] && translations[currentLocale][namespace]) return;

    // load the given file form locize and detect language while doing so
    locizer.loadAll(namespace, (err, messages) => {
      currentLocale = this.props.locale || locizer.lng || locizer.referenceLng;
      Object.keys(messages).forEach((l) => {
        translations[l] = translations[l] || {};
        translations[l][namespace] = messages[l];
      })
      if (this.state.locale !== currentLocale) this.setState({ locale: currentLocale });
    });
  }

  render() {
    const { children, namespace, locale: localeViaProps } = this.props;
    const { locale: localeViaState, setLocale } = this.state;
    const locale = localeViaProps || localeViaState || currentLocale;

    if (!locale || !translations[locale] || !translations[locale][namespace]) return null; // we wait for render until loaded

    // render the react-intl IntlProvider with loaded messages
    return (
      <LocizeContext.Provider value={{ locale, namespace: namespace || DEFAULTNAMESPACE, setLocale }}>
        <IP locale={locale} messages={translations[locale][namespace]}>
          {children}
        </IP>
      </LocizeContext.Provider>
    );
  }
}

// hoc for context
function withContext() {
  return function Wrapper(WrappedComponent) {

    class WithContext extends Component {
      render() {
        return (
          <LocizeContext.Consumer>
            {
              ctx => (
                <WrappedComponent {...this.props} locale={ctx.locale} namespace={ctx.namespace} />
              )
            }
          </LocizeContext.Consumer>
        )
      }
    }

    return WithContext;
  }
}

// a hoc to extend components with locize features
function supportLocize() {
  return function Wrapper(WrappedComponent) {

    class LocizeExtension extends Component {
      constructor(props, context) {
        super(props, context);

        const { id, defaultMessage, description, namespace } = props;

        // get current value in message catalog
        const currentValue = translations[locizer.referenceLng] && translations[locizer.referenceLng][namespace] && translations[locizer.referenceLng][namespace][id]

        // depeding on not yet exists or changed
        // save or update the value on locize
        if (SAVE_NEW_VALUES && !currentValue) {
          locizer.add(namespace, id, defaultMessage, description);
        } else if (UPDATE_VALUES && currentValue !== defaultMessage) {
          locizer.update(namespace, id, defaultMessage, description)
        }

        // send last used information
        locizer.used(namespace, id);
      }

      render() {
        return <WrappedComponent {...this.props} />
      }
    }

    return withContext()(LocizeExtension);
  }
}

// if is development environment we export extended react-intl components
export const FormattedMessage = (IS_DEV && APIKEY) ? supportLocize()(FM) : FM;
