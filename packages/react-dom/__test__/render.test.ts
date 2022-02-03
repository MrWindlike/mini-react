import { ReactElement } from '@local/shared/types/element'
import { createElement } from '@local/react'
import { render } from '../src/index'
import { reset } from '../src/render'

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
