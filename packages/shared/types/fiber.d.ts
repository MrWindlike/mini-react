import { ReactElement, ReactTextElement } from './element'
import { EffectTag } from '../src/const/fiber'

export type Fiber = Partial<ReactElement | ReactTextElement> & {
  dom?: HTMLElement | Text
  parent?: Fiber
  child?: Fiber
  sibling?: Fiber
  alternate?: Fiber | null
  effectTag?: EffectTag
}
