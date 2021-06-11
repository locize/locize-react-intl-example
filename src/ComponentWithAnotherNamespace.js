import React from 'react';

// see ./locize-helper.js for details on provided components
import { IntlProvider, FormattedMessage } from './locize-helper';

export default function ComponentWithAnotherNamespace({ locale }) {
  return (
    <IntlProvider namespace="anotherNamespace" locale={locale}>
      <p>
        <FormattedMessage
          id="app.locize"
          defaultMessage="{count,plural,=0{No candy left}one{Got # candy left}other{Got # candies left}}"
          description="Text in ComponentWithAnotherNamespace"
          values={{ count: 10 }}
        />
      </p>
    </IntlProvider>
  )
}
