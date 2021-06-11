# locize-react-intl-example

This is a basic sample using locize with react-intl.

<img src="https://raw.githubusercontent.com/locize/locize-react-intl-example/master/images/preview.png" alt="react-intl incontext editor" width="500">

features supported:

- splitting translations into multiple files
- incontext editor
- loading translations from locize CDN
- detection of user language
- automatically add new missing strings to your translation project
- update changed strings in reference language
- submit of description to context
- setting last used information so you can savely remove keys not used any longer

# Getting started

1) Create an user account and create a project at [https://locize.com](https://locize.com) and copy your projectId and API key (found on the developer page) to the variables in `src/locize-helper.js` -> [here](https://github.com/locize/locize-react-intl-example/blob/master/src/locize-helper.js#L8)!

Important: make sure you toggle the publish format for your project to `json flat` and have the i18n format set to `icu / messageformat`! To match react-intl format of json when downloading.

<img src="https://raw.githubusercontent.com/locize/locize-react-intl-example/master/images/settings.png" alt="react-intl features" width="500">

2) `npm i && npm start` and `http://localhost:3000` should open automatically.

3) Refresh your browser window with your locize project to see the newly added strings.

Add `http://localhost:3000` in the locize incontext editor -> click a text fragment to edit it in locize

Add an additional language translate it using the locize UI. Open `http://localhost:3000/?lng=de` to eg. open app with german language. (Attention the call for supported languages is cached for performance reasons and might take 1 hour to reflect the newly added language support!).

For implementation details see comments in `src/locize-helper.js`
