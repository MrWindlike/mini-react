import { createElement } from '../src/element'
import { TEXT_ELEMENT_TYPE } from '@local/shared/src/const/element'
import { isObjectChildren } from '@local/shared/src/utils/element'

describe('Create React Element', () => {
  test('Create basic React element', () => {
    type Props = {
      href: string
    }

    const element = createElement<Props>(
      'a',
      {
        href: 'http://www.google.com'
      },
      'Hello World'
    )
    const { href, children } = element.props

    expect(element.type).toBe('a')
    expect(href).toBe('http://www.google.com')
    expect(isObjectChildren(children)).toBe(true)
    if (isObjectChildren(children)) {
      expect(children.type).toBe(TEXT_ELEMENT_TYPE)
      expect(children.props.nodeValue).toBe('Hello World')
    }
  })

  test('Create React element with children', () => {
    const element = createElement(
      'div',
      null,
      'Hello World',
      createElement('span', null, 'Child')
    )

    expect(element.type).toBe('div')
    expect(element.props.children instanceof Array).toBe(true)
    if (element.props.children instanceof Array) {
      expect(element.props.children[0].type).toBe(TEXT_ELEMENT_TYPE)
      expect(element.props.children[1].type).toBe('span')
    }
  })
})
