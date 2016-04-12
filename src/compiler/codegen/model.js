import { addHandler } from './events'

export function genModel (el, events, value) {
  if (el.tag === 'select') {
    if (el.attrsMap.multiple != null) {
      return genMultiSelect(events, value, el)
    } else {
      return genSelect(events, value)
    }
  } else {
    switch (el.attrsMap.type) {
      case 'checkbox':
        return genCheckboxModel(events, value)
      case 'radio':
        return genRadioModel(events, value, el)
      default:
        return genDefaultModel(events, value)
    }
  }
}

function genCheckboxModel (events, value) {
  addHandler(events, 'change', `${value}=$event.target.checked`)
  return `checked:!!(${value})`
}

function genRadioModel (events, value, el) {
  addHandler(events, 'change', `${value}=$event.target.value`)
  return `checked:(${value}==${getInputValue(el)})`
}

function genDefaultModel (events, value) {
  addHandler(events, 'input', `${value}=$event.target.value`)
  return `value:(${value})`
}

function genSelect (events, value) {
  addHandler(events, 'change', `${value}=$event.target.value`)
  return `value:(${value})`
}

function genMultiSelect (events, value, el) {
  addHandler(events, 'change', `${value}=Array.prototype.filter
    .call($event.target.options,function(o){return o.selected})
    .map(function(o){return o.value})`)
  // patch child options
  for (let i = 0; i < el.children.length; i++) {
    let c = el.children[i]
    if (c.tag === 'option') {
      c.props = `selected:(${value}).indexOf(${getInputValue(c)})>-1`
    }
  }
  return ''
}

function getInputValue (el) {
  return el.attrsMap.value
    ? JSON.stringify(el.attrsMap.value)
    : el.attrsMap['v-bind:value'] || el.attrsMap[':value']
}