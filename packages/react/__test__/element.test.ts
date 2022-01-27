import { createElement } from '../src/element'
import { TEXT_ELEMENT_TYPE } from '@local/shared/src/const/element'

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

    expect(element.type).toBe('a')
    expect(element.props.href).toBe('http://www.google.com')
    expect(element.props.children instanceof Array).toBe(false)
    if (!(element.props.children instanceof Array)) {
      expect(element.props.children.type).toBe(TEXT_ELEMENT_TYPE)
      expect(element.props.children.props.nodeValue).toBe('Hello World')
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
