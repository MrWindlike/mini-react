import { TEXT_ELEMENT_TYPE } from '../src/const/element'
import {
  ClassComponent,
  FunctionComponent
} from './component'

// eslint-disable-next-line no-use-before-define
export type Children = ReactElement | ReactElement[]

export interface ReactElement {
  type: string | ClassComponent | FunctionComponent
  props: Record<string, unknown> & { children?: Children }
}

export interface ReactTextElement {
  type: typeof TEXT_ELEMENT_TYPE
  props: { nodeValue: string } & { children?: Children }
}
