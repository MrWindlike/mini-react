import { ReactElement } from '@local/shared/types/element'
import { createElement } from '@local/react'
import { reset } from '@local/reconciliation'
import { render } from '../../src'

describe('Render ReactElement', () => {
  beforeEach(() => {
    reset()
  })

  it('Render a element without children', () => {
    const element = createElement('div', {}, 'Hello World')
    const container = document.createElement('div')

    render(element, container)

    expect(container.innerHTML).toBe('<div>Hello World</div>')
  })

  it('Render a element with children', () => {
    const element = createElement(
      'div',
      {},
      createElement('a', { href: 'https://www.google.com' }, 'Hello World'),
      createElement('span', {}, 'Goodbye')
    )
    const container = document.createElement('div')

    render(element, container)

    expect(container.innerHTML).toBe('<div><a href="https://www.google.com">Hello World</a><span>Goodbye</span></div>')
  })
})

describe('Rerender ReactElement', () => {
  let element: ReactElement
  let container: HTMLElement

  beforeEach(() => {
    reset()

    element = createElement(
      'div',
      {},
      createElement('a', { href: 'https://www.google.com' }, 'Hello World'),
      createElement('span', {}, 'Goodbye')
    )
    container = document.createElement('div')

    render(element, container)

    expect(container.innerHTML).toBe('<div><a href="https://www.google.com">Hello World</a><span>Goodbye</span></div>')
  })

  it('Update elements', () => {
    element = createElement(
      'div',
      {},
      createElement('a', { href: 'https://www.github.com' }, 'Hello World!'),
      createElement('p', {}, 'Goodbye!'),
      createElement('span', {}, 'New!')
    )

    render(element, container)

    expect(container.innerHTML).toBe('<div><a href="https://www.github.com">Hello World!</a><p>Goodbye!</p><span>New!</span></div>')
  })

  it('Delete elements', () => {
    element = createElement(
      'div',
      {},
      createElement('a', { href: 'https://www.github.com' }, 'Hello World!')
    )

    render(element, container)

    expect(container.innerHTML).toBe('<div><a href="https://www.github.com">Hello World!</a></div>')
  })
})

describe('ReactElement events', () => {
  let element: ReactElement
  let container: HTMLElement
  let counter = 0
  const onClick = (): void => {
    counter += 1
  }
  const rerender = (unbind: boolean = false): void => {
    element = createElement(
      'div',
      {},
      createElement('a', { href: 'https://www.github.com', onClick: unbind ? undefined : onClick }, 'Hello World!'),
      createElement('p', {}, 'Goodbye!'),
      createElement('span', {}, `Counter: ${counter}`)
    )
    render(element, container)
  }

  beforeEach(() => {
    reset()

    element = createElement(
      'div',
      {},
      createElement('a', { href: 'https://www.google.com', onClick }, 'Hello World'),
      createElement('span', {}, 'Goodbye')
    )
    container = document.createElement('div')
    counter = 0

    render(element, container)

    expect(container.innerHTML).toBe('<div><a href="https://www.google.com">Hello World</a><span>Goodbye</span></div>')
  })

  it('Trigger event', () => {
    const a = container.querySelector('a') as HTMLElement

    a.click()
    rerender()
    expect(container.innerHTML).toBe('<div><a href="https://www.github.com">Hello World!</a><p>Goodbye!</p><span>Counter: 1</span></div>')
    a.click()
    rerender()
    expect(container.innerHTML).toBe('<div><a href="https://www.github.com">Hello World!</a><p>Goodbye!</p><span>Counter: 2</span></div>')
  })

  it('Unbind event', () => {
    const a = container.querySelector('a') as HTMLElement

    a.click()
    rerender(true)
    expect(container.innerHTML).toBe('<div><a href="https://www.github.com">Hello World!</a><p>Goodbye!</p><span>Counter: 1</span></div>')
    a.click()
    rerender(true)
    expect(container.innerHTML).toBe('<div><a href="https://www.github.com">Hello World!</a><p>Goodbye!</p><span>Counter: 1</span></div>')
  })
})
