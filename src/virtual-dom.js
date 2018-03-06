const element = (type, props, ...children) => ({
  type,
  props: props || {},
  children
});

const setClassNameProp = ($target, value) => {
  $target.setAttribute('class', value);
}

const setBooleanProp = ($target, name, value) => {
  if (value) {
    $target.setAttribute(name, value);
    $target[name] = true;
  } else {
    $target[name] = false;
  }
}

const isEventProp = name => /^on/.test(name);

const isCustomProp = name => (
  isEventProp(name) ||
  name === 'forceUpdate'
);

const extractEventType = name => name.slice(2).toLowerCase();

const addEventListeners = ($target, props) => {
  Object.keys(props).forEach((name) => {
    if (isEventProp(name)) {
      $target.addEventListener(
        extractEventType(name),
        props[name]
      );
    }
  });
}

const setProp = ($target, name, value) => {
  if (isCustomProp(name)) {
    return;
  } else if (name === 'className') {
    setClassNameProp($target, value);
  } else if (typeof value === 'boolean') {
    setBooleanProp($target, name, value);
  } else {
    $target.setAttribute(name, value);
  }
}

const setProps = ($target, props) => {
  Object.keys(props).forEach((name) => {
    setProp($target, name, props[name]);
  });
}

const removeClassNameProp = ($target) => {
  $target.removeAttribute('class');
}

const removeBooleanProp = ($target, name) => {
  $target.removeAttribute(name);
  $target[name] = false;
}

const removeProp = ($target, name, value) => {
  if (isCustomProp(name)) {
    return;
  } else if (name === 'className') {
    removeClassNameProp($target);
  } else if (typeof value === 'boolean') {
    removeBooleanProp($target, name);
  } else {
    $target.removeAttribute(name);
  }
}

const updateProp = ($target, name, newValue, oldValue) => {
  if (!newValue) {
    removeProp($target, name, oldValue);
  } else if (!oldValue || newValue !== oldValue) {
    setProp($target, name, newValue);
  }
}

const updateProps = ($target, newProps, oldProps = {}) => {
  const props = Object.assign({}, oldProps, newProps);
  Object.keys(props).forEach((name) => {
    updateProp($target, name, newProps[name], oldProps[name]);
  });
}

const createElement = (node) => {
  if (typeof node === 'string') return document.createTextNode(node);
  const $element = document.createElement(node.type);
  setProps($element, node.props);
  addEventListeners($element, node.props);
  node.children
    .map(createElement)
    .forEach($element.appendChild.bind($element));
  return $element;
};

const hasChanged = (node1, node2)  => (
  typeof node1 !== typeof node2 ||
  typeof node1 === 'string' && node1 !== node2 ||
  node1.type !== node2.type ||
  (node1.props && node1.props.forceUpdate)
);

const updateElement = ($parent, newNode, oldNode, index = 0) => {
  if (!oldNode) {
    $parent.appendChild(createElement(newNode));
  } else if (!newNode) {
    $parent.removeChild($parent.childNodes[index]);
  } else if (hasChanged(newNode, oldNode)) {
    $parent.replaceChild(createElement(newNode), $parent.childNodes[index]);
  } else if (newNode.type) {
    updateProps($parent.childNodes[index], newNode.props, oldNode.props);
    const newLength = newNode.children.length;
    const oldLength = oldNode.children.length;
    for (let i = 0; i < newLength || i < oldLength; i += 1) {
      updateElement(
        $parent.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
        i
      );
    }
  }
}

const render = (node, $target) => updateElement($target, node)

module.exports = {
  render,
  updateElement,
  element,
};
