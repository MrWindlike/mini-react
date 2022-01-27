import { ReactElement } from '@local/shared/types/element'
import { TEXT_ELEMENT_TYPE } from '@local/shared/src/const/element'

export function createTextElement (text: string): ReactElement {
  return {
    type: TEXT_ELEMENT_TYPE,
    props: {
      nodeValue: text,
      children: []
    }
  }
}

export function createElement<Props> (
  type: string,
  props?: Props,
  ...children: (ReactElement | string)[]
): ReactElement {
  const elements = children.map(child => typeof child === 'object' ? child : createTextElement(child))

  return {
    type,
    props: {
      ...props,
      children: elements.length === 1 ? elements[0] : elements
    }
  }
}
