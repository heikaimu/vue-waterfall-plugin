/*
 * @Author: Yaowen Liu
 * @Date: 2022-03-24 10:36:22
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-03-24 10:36:57
 */
export function hasClass(el, className) {
  const reg = new RegExp(`(^|\\s)${className}(\\s|$)`)
  return reg.test(el.className)
}

export function addClass(el, className) {
  if (hasClass(el, className))
    return

  const newClass = el.className.split(/\s+/)
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function removeClass(el, className) {
  if (hasClass(el, className)) {
    const newClass = el.className.split(/\s+/).filter(name => name !== className)
    el.className = newClass.join(' ')
  }
}

const elementStyle = document.createElement('div').style

const vendor = (() => {
  const transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform',
  }

  for (const key in transformNames) {
    const val = transformNames[key]
    if (elementStyle[val] !== undefined)
      return key
  }

  return false
})()

export function prefixStyle(style) {
  if (vendor === false)
    return false

  if (vendor === 'standard')
    return style

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
