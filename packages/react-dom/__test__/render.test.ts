import { createElement } from '@local/react'
import { render } from '../src/render'

describe('Render ReactElement', () => {
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
