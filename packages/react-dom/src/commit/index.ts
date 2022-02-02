import {
  isUnDef
} from '@local/shared/src/utils/utils'
import { Fiber } from '@local/shared/types/fiber'

function commitWork (fiber?: Fiber) {
  if (isUnDef(fiber) || isUnDef(fiber.parent) || isUnDef(fiber.dom)) {
    return
  }

  const parentDOM = fiber.parent.dom!

  parentDOM.appendChild(fiber.dom)

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

export function commitRoot (WIPRoot: Fiber) {
  commitWork(WIPRoot?.child)
}
