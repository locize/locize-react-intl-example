import React, { Component } from 'react';
import { FormattedMessage as FM, FormattedHTMLMessage as FHM, IntlProvider as IP, addLocaleData } from 'react-intl';
import locizer from 'locizer';

const NAMESPACE = 'translations';
const PROJECTID = 'da028c03-435a-4587-af3a-086de8c7bd9b';
const APIKEY = 'ENTER_YOUR_API_KEY_FOR_SAVE_MISSING';
const REFERENCELANGUAGE = 'en';
const FALLBACKLANGUAGE = 'en';

locizer
  .init({
    fallbackLng: FALLBACKLANGUAGE,
    referenceLng: REFERENCELANGUAGE,
    projectId: PROJECTID,
    apiKey: APIKEY,
  });

const translations = {};
let currentLocale;

export class IntlProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locale: null,
      messages: {}
    };
  }

  componentDidMount() {
    locizer.load(NAMESPACE, (err, messages, locale) => {
      currentLocale = locale;
      translations[locale] = messages;

      import('react-intl/locale-data/' + locale)
        .then(localeData => {
          addLocaleData(localeData);

          // make data available
          this.setState({
            locale,
            messages
          });
        });
    });
  }

  render() {
    const { children } = this.props;
    const { locale, messages } = this.state;

    if (!locale) return null;

    return (
      <IP locale={locale} messages={messages}>
        {children}
      </IP>
    );
  }
}


function supportSaveMissing() {
  return function Wrapper(WrappedComponent) {

    class SaveMissing extends Component {
      constructor(props, context) {
        super(props, context);

        const { id, defaultMessage } = props;

        if (translations[currentLocale] && !translations[currentLocale][id]) {
          locizer.add(NAMESPACE, id, defaultMessage);
        }
      }

      render() {
        return <WrappedComponent {...this.props} />
      }
    }


    return SaveMissing;
  }
}

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
export const FormattedMessage = isDev ? supportSaveMissing()(FM) : FM;
export const FormattedHTMLMessage = isDev ? supportSaveMissing()(FHM) : FHM;
