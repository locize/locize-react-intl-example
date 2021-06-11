import React from 'react';

// see ./locize-helper.js for details on provided components
import { IntlProvider } from './locize-helper';
import { FormattedMessage, Select, Plural } from './intl.macro';

// as we "bend" some es-lint rules we need to disable those
// this let us write "{ trainersCount, number }" or "{ catchDate, date, short }"
// inside Trans -> other option would be an additional component which transforms
// to needed string, eg. <FormattedNumber count={count} />
/* eslint-disable no-undef, no-sequences */
export default function ComponentUsingMacro() {
  const name = 'John Doe';
  const trainersCount = 134567;
  const catchDate = new Date();
  const gender = 'male';
  const itemsCount1 = 1;

  return (
    <IntlProvider namespace="macroNamespace">
      <div>
        <h2>Using babel macro</h2>
        <p><i>basic:</i></p>
        <FormattedMessage
          id="welcome"
          // values={{ strong: (val) => <strong>{val}</strong> }}
        >Hello <strong>{name}</strong>!</FormattedMessage>
        <br />
        <FormattedMessage
          id="welcome_alt"
          values={{ strong: (val) => <strong>{val}</strong> }}
        >Hello - <strong>how are you!</strong></FormattedMessage>
        <br />
        <FormattedMessage id="trainers_count">Trainers: { trainersCount, number }</FormattedMessage>
        <br />
        <FormattedMessage id="cought_on">Caught on { catchDate, date, short }!</FormattedMessage>
        <br />
        <p><i>select:</i></p>
        <Select
          id="avoid_bugs"
          switch={gender}
          male="He avoids bugs."
          female="She avoids bugs."
          other="They avoid bugs."
        />
        <p><i>plurals:</i></p>
        <Plural
          id="items_count"
          count={itemsCount1}
          $0="There is no item."
          one="There is # item."
          other="There are # items."
        />
      </div>
    </IntlProvider>
  )
}
/* eslint-enable no-undef, no-sequences */
