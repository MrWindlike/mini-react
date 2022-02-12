import { ClassComponent } from './component'
import { ReactElement, ReactTextElement } from './element'
import { EffectTag } from '../src/const/fiber'

export type Fiber = Partial<ReactElement | ReactTextElement> & {
  component?: ClassComponent<Record<string, unknown>, Record<string, unknown>>
  isMounted?: boolean
  dom?: HTMLElement | Text
  parent?: Fiber
  child?: Fiber
  sibling?: Fiber
  alternate?: Fiber | null
  effectTag?: EffectTag | null
}
