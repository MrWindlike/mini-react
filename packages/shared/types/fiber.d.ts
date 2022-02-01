import { ReactElement } from './element'

export type Fiber = Partial<ReactElement> & {
  dom?: HTMLElement | Text
  parent?: Fiber
  child?: Fiber
  sibling?: Fiber
};
