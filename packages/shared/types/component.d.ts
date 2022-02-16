import { Fiber } from './fiber.d'
import { ReactElement } from './element.d'

export interface ComponentLifecycle {
  protected componentDidMount?: () => void
  protected componentDidUpdate?: () => void
  protected componentWillUnmount?: () => void
}

export interface ClassComponent<S, P> extends ComponentLifecycle {
  public state: S
  public props: P & { children?: ReactElement | ReactElement[] }
  public fiber?: Fiber
  protected setState: (state: Readonly<S>) => void
  public render: () => ReactElement
}

export type FunctionComponent = <P>(props: P) => ReactElement

export type Hook<T> = [T, (newValue: T) => void]
