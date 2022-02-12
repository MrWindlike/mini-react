import {
  isEvent
} from '@local/shared/src/utils/element'
import {
  isDef,
  isUnDef,
  isFunction
} from '@local/shared/src/utils/utils'
import { TEXT_ELEMENT_TYPE } from '@local/shared/src/const/element'
import { EffectTag } from '@local/shared/src/const/fiber'
import { Fiber } from '@local/shared/types/fiber'

function commitDOM (fiber: Fiber): void {
  if (isUnDef(fiber.dom)) {
    return
  }

  let parent = fiber.parent as Fiber

  while (isUnDef(parent.dom)) {
    parent = parent.parent as Fiber
  }

  const parentDOM = parent.dom

  if (fiber.effectTag === EffectTag.CREATION) {
    parentDOM?.appendChild(fiber.dom)
  } else if (fiber.effectTag === EffectTag.UPDATE) {
    if (fiber.type === TEXT_ELEMENT_TYPE) {
      fiber.dom.textContent = (fiber.props?.nodeValue as string) ?? ''
    } else {
      const dom = fiber.dom as HTMLElement
      const props = fiber.props ?? {}
      const oldProps = fiber.alternate?.props ?? {}

      for (const key in oldProps) {
        if (key in props || key === 'children') {
          continue
        }

        if (isEvent(key)) {
          dom.removeEventListener(key.slice(2).toLowerCase(), oldProps[key] as EventListener)
        } else {
          dom.setAttribute(key, '')
        }
      }

      for (const key in props) {
        if (key === 'children') continue

        if (isEvent(key)) {
          if (oldProps[key] !== props[key]) {
            dom.removeEventListener(key.slice(2).toLowerCase(), oldProps[key] as EventListener)
            if (isFunction(props[key])) {
              dom.addEventListener(key.slice(2).toLowerCase(), props[key] as EventListener)
            }
          }
        } else {
          dom.setAttribute(key, String(props[key]))
        }
      }
    }
  } else if (fiber.effectTag === EffectTag.REPLACE) {
    let alternateHostFiber = fiber.alternate

    while (isDef(alternateHostFiber) && isUnDef(alternateHostFiber.dom)) {
      alternateHostFiber = alternateHostFiber.child
    }

    const oldDOM = alternateHostFiber?.dom

    if (isDef(oldDOM)) {
      parentDOM?.replaceChild(fiber.dom, oldDOM)
    }
  } else if (fiber.effectTag === EffectTag.DELETION) {
    parentDOM?.removeChild(fiber.dom)
  }

  fiber.effectTag = null
}

function commitComponent (fiber: Fiber): void {
  if (isUnDef(fiber.component)) {
    return
  }

  const { component } = fiber

  if (fiber.effectTag === EffectTag.CREATION) {
    component?.componentDidMount?.()
    fiber.isMounted = true
  } else if (fiber.effectTag === EffectTag.UPDATE) {
    component?.componentDidUpdate?.()
  } else if (fiber.effectTag === EffectTag.DELETION || fiber.effectTag === EffectTag.REPLACE) {
    component?.componentWillUnmount?.()
  }

  fiber.effectTag = null
}

export function commitWork (fiber?: Fiber): void {
  if (isUnDef(fiber) || isUnDef(fiber.parent)) {
    return
  }

  const shouldUpdate = true

  if (shouldUpdate) {
    commitDOM(fiber)
    commitComponent(fiber)
    commitWork(fiber.child)
  }

  commitWork(fiber.sibling)
}

export function commitRoot (WIPRoot: Fiber, deletions: Fiber[]): void {
  commitWork(WIPRoot?.child)
  deletions.forEach(commitWork)
}
