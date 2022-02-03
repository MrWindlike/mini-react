import { Children, ReactElement, ReactTextElement } from '../../types/element'
import { Fiber } from '../../types/fiber'
import { TEXT_ELEMENT_TYPE } from '../const/element'
import { isDef } from './utils'

export function isObjectChildren (children?: Children): children is ReactElement {
  return isDef(children) && typeof children === 'object' && !(children instanceof Array)
}

export function isTextElement (element: ReactElement | ReactTextElement): element is ReactTextElement {
  return element.type === TEXT_ELEMENT_TYPE
}

export function isSameType (element1: ReactElement | Fiber, element2: ReactElement | Fiber): boolean {
  return element1?.type === element2?.type
}

export function isEvent (name: string): boolean {
  return name.startsWith('on') && name.length > 2
}
