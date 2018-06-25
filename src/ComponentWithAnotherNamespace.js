import React from 'react';

// see ./locize/index.js for details on provided components
import { IntlProvider, FormattedMessage } from "./locize";

export default function ComponentWithAnotherNamespace() {
  return (
    <IntlProvider namespace="anotherNamespace">
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
