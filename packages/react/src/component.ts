import { Fiber } from '@local/shared/types/fiber'
import { ReactElement } from '@local/shared/types/element'
import { ClassComponent } from '@local/shared/types/component'
import { SET_STATE } from '@local/shared/src/const/event'
import event from '@local/shared/src/utils/event'

export class Component<S, P> implements ClassComponent<S, P> {
  public state: S = {} as any
  public props: P & { children?: ReactElement | ReactElement[] }
  public fiber?: Fiber

  constructor (props: Readonly<P>) {
    this.props = props ?? {}
  }

  public get isReactComponent (): boolean {
    return true
  }

  public setState (state: Readonly<S>): void {
    const fiber: Fiber = {
      ...(this.fiber ?? {}),
      props: this.props,
      alternate: this.fiber
    }

    this.state = {
      ...this.state,
      ...state
    }
    event.emit(SET_STATE, fiber)
  }

  public render (): ReactElement {
    throw new Error(`[${this.constructor.name}]: Please implement the render component`)
  }
}

export type FC<P> = (props: P & { children?: ReactElement | ReactElement[] }) => ReactElement
