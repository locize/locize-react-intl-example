import React from 'react';

// see ./locize/index.js for details on provided components
import { IntlProvider } from "locize";
import { FormattedMessage, FormattedHTMLMessage, Select, SelectHtml, Plural, PluralHtml } from "./intl.macro";

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
  const itemsCount2 = 234;

  return (
    <IntlProvider namespace="macroNamespace">
      <div>
        <h2>Using babel macro</h2>
        <p><i>basic:</i></p>
        <FormattedMessage id="welcome">Hello <b>{name}</b>!</FormattedMessage>
        <br />
        <FormattedHTMLMessage id="welcome_alt">Hello - <strong>how are you!</strong></FormattedHTMLMessage>
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
        <br />
        <SelectHtml
          id="avoid_bugs_alt"
          switch={gender}
          male={<FormattedMessage><strong>He</strong> avoids bugs.</FormattedMessage>}
          female={<FormattedMessage><strong>She</strong> avoids bugs.</FormattedMessage>}
          other={<FormattedMessage><strong>They</strong> avoid bugs.</FormattedMessage>}
        />
        <p><i>plurals:</i></p>
        <Plural
          id="items_count"
          count={itemsCount1}
          $0="There is no item."
          one="There is # item."
          other="There are # items."
        />
        <br />
        <PluralHtml
          id="items_count_alt"
          count={itemsCount2}
          $0={<FormattedMessage>There is <strong>no</strong> item.</FormattedMessage>}
          one={<FormattedMessage>There is <strong>#</strong> item.</FormattedMessage>}
          other={<FormattedMessage>There are <strong>#</strong> items.</FormattedMessage>}
        />
      </div>

    </IntlProvider>
  )
}
/* eslint-enable no-undef, no-sequences */
