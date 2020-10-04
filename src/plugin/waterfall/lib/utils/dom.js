export function hasClass(el, className) {
  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className);
}

export function addClass(el, className) {
  if (hasClass(el, className)) {
    return;
  }

  const newClass = el.className.split(/\s+/);
  newClass.push(className);
  el.className = newClass.join(' ');
}

export function removeClass(el, className) {
  if (hasClass(el, className)) {
    const newClass = el.className.split(/\s+/).filter(name => name !== className);
    el.className = newClass.join(' ');
  }
}
let elementStyle = null;
try {
  elementStyle = document.createElement('div').style;
} catch (e) {
  elementStyle = null;
}

const vendor = (() => {
  const transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  };

  if (elementStyle === null) {
    try {
      elementStyle = document.createElement('div').style;
    } catch (e) {
      elementStyle = null;
    }
  }

  if (elementStyle === null) {
    return elementStyle['standard'];
  }

  for (const key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
  }

  return false;
})();

export function prefixStyle(style) {
  if (vendor === false) {
    return false;
  }

  if (vendor === 'standard') {
    return style;
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}
