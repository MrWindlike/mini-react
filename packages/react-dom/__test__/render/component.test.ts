import { ReactElement } from '@local/shared/types/element'
import { Component, createElement, FC } from '@local/react'
import { reset } from '@local/reconciliation'
import { render } from '../../src/index'

describe('Render class component', () => {
  let element: ReactElement
  let container: HTMLElement
  let isMounted = false
  let isUpdated = false
  let isUnmounted = false

  interface State {
    counter: number
  }

  interface Props {
    text: string
  }

  class ReactComponent extends Component<State, Props> {
    constructor (props: Props) {
      super(props)
      this.state = {
        counter: 0
      }
    }

    componentDidMount (): void {
      isMounted = true
    }

    componentDidUpdate (): void {
      isUpdated = true
    }

    componentWillUnmount (): void {
      isUnmounted = true
    }

    onClick (): void {
      this.setState({
        counter: Number(this.state.counter) + 1
      })
    }

    render (): ReactElement {
      const { children } = this.props
      const { counter } = this.state

      return (
        createElement(
          'div',
          {},
          createElement('a', { href: 'https://www.github.com', onClick: this.onClick.bind(this) }, 'Hello World!'),
          ...(([] as ReactElement[]).concat(children ?? [])),
          createElement('span', {}, `Counter: ${String(counter)}`)
        )
      )
    }
  }

  beforeEach(() => {
    element = createElement(
      ReactComponent,
      { text: 'Hello World!' },
      createElement('p', {}, 'Goodbye!')
    )
    container = document.createElement('div')
    isMounted = false
    isUpdated = false
    isUnmounted = false

    reset()
    render(element, container)

    expect(container.innerHTML).toBe('<div><a href="https://www.github.com">Hello World!</a><p>Goodbye!</p><span>Counter: 0</span></div>')
  })

  test('Trigger event', () => {
    const a = container.querySelector('a')

    a?.click()
    expect(container.innerHTML).toBe('<div><a href="https://www.github.com">Hello World!</a><p>Goodbye!</p><span>Counter: 1</span></div>')
    a?.click()
    expect(container.innerHTML).toBe('<div><a href="https://www.github.com">Hello World!</a><p>Goodbye!</p><span>Counter: 2</span></div>')
  })

  test('Life cycle', () => {
    const a = container.querySelector('a')

    expect(isMounted).toBe(true)
    a?.click()
    expect(container.innerHTML).toBe('<div><a href="https://www.github.com">Hello World!</a><p>Goodbye!</p><span>Counter: 1</span></div>')
    expect(isUpdated).toBe(true)
    element = createElement(
      'p',
      { },
      'Goodbye!'
    )
    render(element, container)
    expect(container.innerHTML).toBe('<p>Goodbye!</p>')
    expect(isUnmounted).toBe(true)
  })
})

describe('Render function component', () => {
  let element: ReactElement
  let container: HTMLElement

  interface Props {
    text: string
    counter: number
  }

  const FunctionComponent: FC<Props> = (props) => {
    return (
      createElement(
        'div',
        {},
        createElement('a', { href: 'https://www.github.com' }, 'Hello World!'),
        ...(([] as ReactElement[]).concat(props.children ?? [])),
        createElement('span', {}, 'Counter: 0')
      )
    )
  }

  test('Basic', () => {
    element = createElement(
      FunctionComponent,
      { text: 'Hello World!' },
      createElement('p', {}, 'Goodbye!')
    )
    container = document.createElement('div')

    reset()
    render(element, container)

    expect(container.innerHTML).toBe('<div><a href="https://www.github.com">Hello World!</a><p>Goodbye!</p><span>Counter: 0</span></div>')
  })
})
