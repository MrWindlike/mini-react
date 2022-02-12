import {
  isTextElement,
  isSameType,
  isEvent,
  isComponent,
  isClassComponent
} from '@local/shared/src/utils/element'
import {
  isDef,
  isUnDef,
  isFunction
} from '@local/shared/src/utils/utils'
import { ReactElement } from '@local/shared/types/element'
import { Fiber } from '@local/shared/types/fiber'
import { EffectTag } from '@local/shared/src/const/fiber'

let nextUnitOfWork: Fiber | null
let WIPRoot: Fiber | null
let currentRoot: Fiber | null
let deletions: Fiber[] = []

function createDOM (element: ReactElement): HTMLElement | Text {
  let node: HTMLElement | Text

  if (isTextElement(element)) {
    node = document.createTextNode(element.props.nodeValue)
  } else {
    const { children, ...props } = element.props

    node = document.createElement(element.type) as HTMLElement

    for (const key in props) {
      if (isEvent(key)) {
        if (isFunction(props[key])) {
          node.addEventListener(
            key.slice(2).toLowerCase(),
            props[key] as EventListener
          )
        }
      } else {
        node.setAttribute(key, String(props[key]))
      }
    }
  }

  return node
}

function reconciliationChildren (fiber: Fiber, children: ReactElement | ReactElement[]): void {
  let oldFiber = fiber.effectTag === EffectTag.REPLACE ? null : fiber.alternate?.child
  children = ([] as ReactElement[]).concat(children)
  let preSibling: Fiber | null = null

  for (let index = 0; index < children.length || isDef(oldFiber); index++) {
    const element = children[index]
    let newFiber: Fiber | null = null

    if (isUnDef(oldFiber)) {
      newFiber = {
        ...element,
        parent: fiber,
        alternate: oldFiber ?? null,
        effectTag: EffectTag.CREATION
      }
    } else {
      if (isSameType(oldFiber, element)) {
        newFiber = {
          ...element,
          parent: fiber,
          alternate: oldFiber ?? null,
          dom: oldFiber.dom,
          effectTag: EffectTag.UPDATE
        }
      } else if (isDef(element)) {
        newFiber = {
          ...element,
          parent: fiber,
          alternate: oldFiber ?? null,
          effectTag: EffectTag.REPLACE
        }

        if (isClassComponent(oldFiber)) {
          oldFiber.effectTag = EffectTag.DELETION
          deletions.push(oldFiber)
        }
      } else {
        oldFiber.effectTag = EffectTag.DELETION
        deletions.push(oldFiber)
      }
    }

    if (isDef(newFiber)) {
      if (isComponent(newFiber)) {
        newFiber.isMounted = false
      }

      if (isClassComponent(newFiber)) {
        const { type: Component, props } = newFiber
        const component = new Component(props)

        component.fiber = newFiber
        newFiber.component = component
      }

      if (index === 0) {
        fiber.child = newFiber
      } else if (isDef(preSibling)) {
        preSibling.sibling = newFiber
      }

      preSibling = newFiber
    }

    oldFiber = oldFiber?.sibling
  }
}

export function performUnitOfWork (fiber: Fiber): Fiber | null {
  const isComponentElement = isComponent(fiber)
  const isHost = typeof fiber.type !== 'function'
  let children = fiber.props?.children ?? []

  // add dom
  if (isUnDef(fiber.dom) && isHost) {
    fiber.dom = createDOM((fiber as ReactElement))
  }

  // create new fibers
  if (isComponentElement) {
    const element = isDef(fiber.component) ? fiber.component.render() : fiber.type(fiber.props)

    children = [].concat(element)
  }

  reconciliationChildren(fiber, children)

  // return next unit of work
  if (isDef(fiber.child)) {
    return fiber.child
  }

  let next: Fiber | undefined = fiber

  while (next != null) {
    if (next.sibling != null) {
      return next.sibling
    }

    next = next.parent
  }

  return next ?? null
}

interface WorkLoopResult {
  deletions: Fiber[]
}

export function workLoop (): WorkLoopResult {
  while (nextUnitOfWork != null) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
  }

  return { deletions }
}

export function initWIPRoot (element: ReactElement, container: HTMLElement): Fiber {
  WIPRoot = {
    dom: container,
    props: {
      children: [element]
    },
    alternate: currentRoot
  }

  nextUnitOfWork = WIPRoot

  return WIPRoot
}

export function clearWIPRoot (): void {
  currentRoot = WIPRoot
  WIPRoot = null
}

export function reset (): void {
  nextUnitOfWork = null
  currentRoot = null
  WIPRoot = null
  deletions = []
}

export function setNextUnitOfWork (fiber: Fiber): void {
  nextUnitOfWork = fiber
}
