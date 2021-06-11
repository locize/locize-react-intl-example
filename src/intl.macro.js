const { createMacro } = require('babel-plugin-macros');

const IMPORT_FROM = './locize-helper'; // not using locize rename this to react-intl

module.exports = createMacro(IntlMacro);

function IntlMacro({ references, state, babel }) {
  const t = babel.types;
  const { FormattedMessage = [], Plural = [], Select = [] } = references;

  // assert we have the react-i18next Trans component imported
  addNeededImports(state, babel);

  // transform Plural
  Plural.forEach(referencePath => {
    if (referencePath.parentPath.type === 'JSXOpeningElement') {
      pluralAsJSX(
        referencePath.parentPath,
        {
          attributes: referencePath.parentPath.get('attributes'),
          children: referencePath.parentPath.parentPath.get('children'),
        },
        babel
      );
    } else {
      // throw a helpful error message or something :)
    }
  });

  // transform Select
  Select.forEach(referencePath => {
    if (referencePath.parentPath.type === 'JSXOpeningElement') {
      selectAsJSX(
        referencePath.parentPath,
        {
          attributes: referencePath.parentPath.get('attributes'),
          children: referencePath.parentPath.parentPath.get('children'),
        },
        babel
      );
    } else {
      // throw a helpful error message or something :)
    }
  });

  // transform Trans
  FormattedMessage.forEach(referencePath => {
    if (referencePath.parentPath.type === 'JSXOpeningElement') {
      formattedMessageAsJSX(
        referencePath.parentPath,
        {
          attributes: referencePath.parentPath.get('attributes'),
          children: referencePath.parentPath.parentPath.get('children'),
        },
        babel
      );
    } else {
      // throw a helpful error message or something :)
    }
  });
}

function pluralAsJSX(parentPath, { attributes }, babel, innerHtml) {
  const t = babel.types;
  const toObjectProperty = (name, value) =>
    t.objectProperty(t.identifier(name), t.identifier(name), false, !value);

  let componentStartIndex = 0;

  const extracted = attributes.reduce(
    (mem, attr) => {
      if (attr.node.name.name === 'id') {
        // copy the id
        mem.attributesToCopy.push(attr.node);
      } else if (attr.node.name.name === 'count') {
        // take the count for plural element
        mem.values.push(toObjectProperty(attr.node.value.expression.name));
        mem.defaults = `{${attr.node.value.expression.name}, plural, ${mem.defaults}`;
      } else if (attr.node.value.type === 'StringLiteral') {
        // take any string node as plural option
        let pluralForm = attr.node.name.name;
        if (pluralForm.indexOf('$') === 0) pluralForm = pluralForm.replace('$', '=');
        mem.defaults = `${mem.defaults} ${pluralForm} {${attr.node.value.value}}`;
      } else if (attr.node.value.type === 'JSXExpressionContainer') {
        // convert any Trans component to plural option extracting any values and components
        const children = attr.node.value.expression.children;
        const thisTrans = processTrans(children, babel, componentStartIndex);

        let pluralForm = attr.node.name.name;
        if (pluralForm.indexOf('$') === 0) pluralForm = pluralForm.replace('$', '=');

        mem.defaults = `${mem.defaults} ${pluralForm} {${thisTrans.defaults}}`;
        mem.values = mem.values.concat(thisTrans.values);
      }
      return mem;
    },
    { attributesToCopy: [], values: [],  defaults: '' }
  );

  // replace the node with the new Trans
  parentPath.replaceWith(buildTransElement(extracted, extracted.attributesToCopy, t, true, false, 'FormattedMessage'));
}

function selectAsJSX(parentPath, { attributes }, babel, innerHtml) {
  const t = babel.types;
  const toObjectProperty = (name, value) =>
    t.objectProperty(t.identifier(name), t.identifier(name), false, !value);

  let componentStartIndex = 0;

  const extracted = attributes.reduce(
    (mem, attr) => {
      if (attr.node.name.name === 'id') {
        // copy the id
        mem.attributesToCopy.push(attr.node);
      } else if (attr.node.name.name === 'switch') {
        // take the switch for plural element
        mem.values.push(toObjectProperty(attr.node.value.expression.name));
        mem.defaults = `{${attr.node.value.expression.name}, select, ${mem.defaults}`;
      } else if (attr.node.value.type === 'StringLiteral') {
        // take any string node as select option
        mem.defaults = `${mem.defaults} ${attr.node.name.name} {${attr.node.value.value}}`;
      } else if (attr.node.value.type === 'JSXExpressionContainer') {
        // convert any Trans component to select option extracting any values and components
        const children = attr.node.value.expression.children;
        const thisTrans = processTrans(children, babel, componentStartIndex);

        mem.defaults = `${mem.defaults} ${attr.node.name.name} {${thisTrans.defaults}}`;
        mem.values = mem.values.concat(thisTrans.values);
      }
      return mem;
    },
    { attributesToCopy: [], values: [], components: [], defaults: '' }
  );

  // replace the node with the new Trans
  parentPath.replaceWith(buildTransElement(extracted, extracted.attributesToCopy, t, true, false, 'FormattedMessage'));
}

function formattedMessageAsJSX(parentPath, { attributes, children }, babel) {
  const extracted = processTrans(children, babel);

  // replace the node with the new Trans
  children[0].parentPath.replaceWith(
    buildTransElement(extracted, cloneExistingAttributes(attributes), babel.types, false, true, 'FormattedMessage')
  );
}

function buildTransElement(
  extracted,
  finalAttributes,
  t,
  closeDefaults = false,
  wasElementWithChildren = false,
  nodeIdentifier = 'FormattedMessage'
) {
  const nodeName = t.jSXIdentifier(nodeIdentifier);

  // plural, select open { but do not close it while reduce
  if (closeDefaults) extracted.defaults += '}';

  // convert arrays into needed expressions
  extracted.components = t.arrayExpression(extracted.components);
  extracted.values = t.objectExpression(extracted.values);

  // add generated Trans attributes
  if (!attributeExistsAlready('defaultMessage', finalAttributes))
    finalAttributes.push(
      t.jSXAttribute(t.jSXIdentifier('defaultMessage'), t.StringLiteral(extracted.defaults))
    );
  if (!attributeExistsAlready('values', finalAttributes))
    finalAttributes.push(
      t.jSXAttribute(t.jSXIdentifier('values'), t.jSXExpressionContainer(extracted.values))
    );

  // create selfclosing Trans component
  const openElement = t.jSXOpeningElement(nodeName, finalAttributes, true);
  if (!wasElementWithChildren) return openElement;

  return t.jSXElement(openElement, null, [], true);
}

function cloneExistingAttributes(attributes) {
  return attributes.reduce((mem, attr) => {
    mem.push(attr.node);
    return mem;
  }, []);
}

function attributeExistsAlready(name, attributes) {
  const found = attributes.find(child => {
    const ele = child.node ? child.node : child;
    return ele.name.name === name;
  });
  return !!found;
}

function processTrans(children, babel, componentStartIndex = 0) {
  const res = {};

  res.defaults = mergeChildren(children, babel, componentStartIndex);
  res.values = getValues(children, babel);

  return res;
}

function mergeChildren(children, babel, componentStartIndex = 0) {
  const t = babel.types;

  return children.reduce((mem, child) => {
    const ele = child.node ? child.node : child;

    // add text
    if (t.isJSXText(ele) && ele.value) mem += ele.value;
    // add ?!? forgot
    if (ele.expression && ele.expression.value) mem += ele.expression.value;
    // add `{ val }`
    if (ele.expression && ele.expression.name) mem += `{${ele.expression.name}}`;
    // add `{ val, number }`
    if (ele.expression && ele.expression.expressions) {
      mem += `{${ele.expression.expressions
        .reduce((m, i) => {
          m.push(i.name || i.value);
          return m;
        }, [])
        .join(', ')}}`;
    }
    // add <strong>...</strong> or remove it if in values
    if (t.isJSXElement(ele)) {
      const innerValues = getValues(ele.children, babel);
      if (!innerValues.length) {
        mem += `<${ele.openingElement.name.name}>${mergeChildren(
          ele.children,
          babel
        )}</${ele.openingElement.name.name}>`;
      } else {
        mem += `${mergeChildren(
          ele.children,
          babel
        )}`;
      }
    }

    return mem;
  }, '');
}

function getValues(children, babel) {
  const t = babel.types;
  const toObjectProperty = (name, value) =>
    t.objectProperty(t.identifier(name), t.identifier(name), false, !value);

  return children.reduce((mem, child) => {
    const ele = child.node ? child.node : child;
    // add `{ var }` to values
    if (ele.expression && ele.expression.name) mem.push(toObjectProperty(ele.expression.name));
    // add `{ var, number }` to values
    if (ele.expression && ele.expression.expressions)
      mem.push(
        toObjectProperty(ele.expression.expressions[0].name || ele.expression.expressions[0].value)
      );
    // add `{ var: 'bar' }` to values
    if (ele.expression && ele.expression.properties) mem = mem.concat(ele.expression.properties);
    // recursive add inner elements stuff to values
    if (t.isJSXElement(ele)) {
      // just support `Hello <b>{name}</b>` extracting <b>{name}</b> as value for name
      const innerValues = getValues(ele.children, babel);

      if (innerValues.length) {
        innerValues[0].value = ele;
        innerValues[0].shorthand = false;
        mem = mem.concat(innerValues);
      }
    }

    return mem;
  }, []);
}

function addNeededImports(state, babel) {
  const t = babel.types;
  const importsToAdd = ['FormattedMessage'];

  // check if there is an existing react-i18next import
  const existingImport = state.file.path.node.body.find(
    importNode => t.isImportDeclaration(importNode) && importNode.source.value === IMPORT_FROM
  );

  // append Trans to existing or add a new react-i18next import for the Trans
  if (existingImport) {
    importsToAdd.forEach(name => {
      if (
        existingImport.specifiers.findIndex(
          specifier => specifier.imported && specifier.imported.name === name
        ) === -1
      ) {
        existingImport.specifiers.push(t.importSpecifier(t.identifier(name), t.identifier(name)));
      }
    });
  } else {
    state.file.path.node.body.unshift(
      t.importDeclaration(
        importsToAdd.map(name => t.importSpecifier(t.identifier(name), t.identifier(name))),
        t.stringLiteral(IMPORT_FROM)
      )
    );
  }
}