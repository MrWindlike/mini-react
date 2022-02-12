import { Fiber } from './fiber.d'
import { ReactElement } from './element.d'

interface ComponentLifecycle {
  protected componentDidMount?: () => void
  protected componentDidUpdate?: () => void
  protected componentWillUnmount?: () => void
}
interface ClassComponent<S, P> extends ComponentLifecycle {
  public state: S
  public props: P & { children?: ReactElement | ReactElement[] }
  public fiber?: Fiber
  protected setState: (state: Readonly<S>) => void
  public render: () => ReactElement
}
type FunctionComponent = <P>(props: P) => ReactElement
