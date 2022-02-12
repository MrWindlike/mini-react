import { EffectTag } from '@local/shared/src/const/fiber'
import { Fiber } from '@local/shared/types/fiber'
import {
  initWIPRoot,
  clearWIPRoot,
  workLoop,
  setNextUnitOfWork
} from './render/index'
import { commitRoot, commitWork } from './commit/index'
import {
  ReactElement,
  ReactTextElement
} from '@local/shared/types/element'
import { isDef } from '@local/shared/src/utils/utils'
import event from '@local/shared/src/utils/event'
import { SET_STATE } from '@local/shared/src/const/event'

(function listenSetState (): void {
  event.on(SET_STATE, function (fiber: Fiber) {
    fiber.effectTag = EffectTag.UPDATE
    setNextUnitOfWork(fiber)

    const { deletions } = workLoop()

    commitWork(fiber)
    deletions.forEach(commitWork)

    const parentFiber = fiber.parent as Fiber
    const oldFiber = fiber.alternate as Fiber

    if (parentFiber.child === oldFiber) {
      parentFiber.child = fiber
    } else {
      let current = parentFiber.child

      while (isDef(current) && current.sibling !== oldFiber) {
        current = current.sibling
      }

      if (current?.sibling === oldFiber) {
        current.sibling = fiber
      }
    }
  })
})()

export function render (element: ReactElement | ReactTextElement, container: HTMLElement): void {
  const WIPRoot = initWIPRoot(element, container)

  const { deletions } = workLoop()
  commitRoot(WIPRoot, deletions)

  clearWIPRoot()
}

export * from './render'
export * from './commit'
