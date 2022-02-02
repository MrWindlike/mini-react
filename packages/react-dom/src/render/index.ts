import {
  isTextElement
} from '@local/shared/src/utils/element'
import {
  isUnDef
} from '@local/shared/src/utils/utils'
import { ReactElement } from '@local/shared/types/element'
import { Fiber } from '@local/shared/types/fiber'

let nextUnitOfWork: Fiber | null
let WIPRoot: Fiber | null

function createDOM (element: ReactElement) {
  let node: HTMLElement | Text

  if (isTextElement(element)) {
    node = document.createTextNode(element.props.nodeValue)
  } else {
    const { children, ...props } = element.props

    node = document.createElement(element.type)

    for (const key in props) {
      node.setAttribute(key, String(props[key]))
    }
  }

  return node
}

function performUnitOfWork (fiber: Fiber): Fiber | null {
  // add dom
  if (isUnDef(fiber.dom)) {
    fiber.dom = createDOM((fiber as ReactElement))
  }

  // create new fibers
  let { children = [] } = fiber.props || {}
  children = ([] as ReactElement[]).concat(children)
  let preSibling: Fiber

  for (let index = 0; index < children.length; index++) {
    const element = children[index]
    const childFiber = {
      ...element,
      parent: fiber
    }

    if (index === 0) {
      fiber.child = childFiber
    } else {
        preSibling!.sibling = childFiber
    }

    preSibling = childFiber
  }

  // return next unit of work
  if (fiber.child) {
    return fiber.child
  }

  let next: Fiber | undefined = fiber

  while (next) {
    if (next.sibling) {
      return next.sibling
    }

    next = next.parent
  }

  return next || null
}

export function workLoop () {
  while (nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }
}

export function initWIPRoot (element: ReactElement, container: HTMLElement): Fiber {
  WIPRoot = {
    dom: container,
    props: {
      children: [element]
    }
  }

  nextUnitOfWork = WIPRoot

  return WIPRoot
}

export function clearWIPRoot () {
  WIPRoot = null
}
