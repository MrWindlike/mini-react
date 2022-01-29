import { ReactElement, ReactTextElement } from '@local/shared/types/element'
import { isTextElement } from '@local/shared/src/utils/element'

export function render (element: ReactElement | ReactTextElement, container: HTMLElement) {
  let node: HTMLElement | Text

  if (isTextElement(element)) {
    node = document.createTextNode(element.props.nodeValue)
  } else {
    const { children, ...props } = element.props

    node = document.createElement(element.type)

    for (const key in props) {
      node.setAttribute(key, String(props[key]))
    }

    for (const child of ([] as ReactElement[]).concat(children || [])) {
      render(child, node)
    }
  }

  container.appendChild(node)
}
