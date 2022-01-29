import { Children, ReactElement, ReactTextElement } from '../../types/element'
import { TEXT_ELEMENT_TYPE } from '../const/element'
import { isDef } from './utils'

export function isObjectChildren (children?: Children): children is ReactElement {
  return isDef(children) && typeof children === 'object' && ((children instanceof Array) === false)
}

export function isTextElement (element: ReactElement | ReactTextElement): element is ReactTextElement {
  return element.type === TEXT_ELEMENT_TYPE
}
