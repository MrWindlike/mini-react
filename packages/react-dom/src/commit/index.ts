import {
  isDef,
  isUnDef
} from '@local/shared/src/utils/utils'
import { TEXT_ELEMENT_TYPE } from '@local/shared/src/const/element'
import { EffectTag } from '@local/shared/src/const/fiber'
import { Fiber } from '@local/shared/types/fiber'

function commitWork (fiber?: Fiber): void {
  if (isUnDef(fiber) || isUnDef(fiber.parent) || isUnDef(fiber.dom)) {
    return
  }

  const parentDOM = fiber.parent.dom

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

        dom.setAttribute(key, '')
      }

      for (const key in props) {
        if (key === 'children') continue

        dom.setAttribute(key, String(props[key]))
      }
    }
  } else if (fiber.effectTag === EffectTag.REPLACE) {
    const oldDOM = fiber.alternate?.dom

    if (isDef(oldDOM)) {
      parentDOM?.replaceChild(fiber.dom, oldDOM)
    }
  } else if (fiber.effectTag === EffectTag.DELETION) {
    parentDOM?.removeChild(fiber.dom)
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

export function commitRoot (WIPRoot: Fiber, deletions: Fiber[]): void {
  commitWork(WIPRoot?.child)
  deletions.forEach(commitWork)
}
