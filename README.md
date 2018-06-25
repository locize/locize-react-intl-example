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

1) Create an user account and create a project at [https://locize.com](https://locize.com) and copy your projectId and API key to the variables in `src/locize/index.js` -> [here](https://github.com/locize/locize-react-intl-example/blob/master/src/locize/index.js#L8)!

<img src="https://raw.githubusercontent.com/locize/locize-react-intl-example/master/images/settings.png" alt="react-intl features" width="500">

2) `npm i && npm start` and `http://localhost:3000` should open automatically.

3) Refresh your browser window with your locize project to see the newly added strings.

Open `http://localhost:3000/?locize=true` to show the incontext editor -> click a text fragment to edit it in locize

For implementation details see comments in `src/locize/index.js`
