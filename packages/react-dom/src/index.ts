import {
  initWIPRoot,
  clearWIPRoot,
  workLoop
} from './render/index'
import { commitRoot } from './commit/index'
import {
  ReactElement,
  ReactTextElement
} from '@local/shared/types/element'

export function render (element: ReactElement | ReactTextElement, container: HTMLElement) {
  const WIPRoot = initWIPRoot(element, container)

  workLoop()
  commitRoot(WIPRoot)

  clearWIPRoot()
}
