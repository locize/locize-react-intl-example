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
- setting last used information so you can savely remove keys not used anylonger

<img src="https://raw.githubusercontent.com/locize/locize-react-intl-example/master/images/features.png" alt="react-intl features" width="500">


# Getting started

Just `npm i && npm start`

Open `http://localhost:3000/?locize=true` to show the incontext editor -> click a text fragment to edit it in locize

For details see comments in `src/locize/index.js`


## for save missings

create a project at [https://locize.com](https://locize.com) and copy your projectId and API key to the variables in `src/locize/index.js` script section!

<img src="https://raw.githubusercontent.com/locize/locize-react-intl-example/master/images/missing.png" alt="react-intl missings" width="500">
