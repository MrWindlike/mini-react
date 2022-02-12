import { ReactElement } from '@local/shared/types/element'
import {
  createElement,
  Component
} from '../../src/index'

describe('Create component', () => {
  test('Create function component', () => {
    interface Props {
      text: string
    }

    function App (props: Props): ReactElement {
      return (
        createElement(
          'div',
          {},
          props.text
        )
      )
    }

    const element = createElement(App, { text: 'Hello World' })

    expect(element.type).toBe(App)
    expect(element.props.text).toBe('Hello World')
  })

  test('Create class component', () => {
    interface Props {
      text: string
    }

    class App extends Component<{}, Props> {
      render (): ReactElement {
        return (
          createElement(
            'div',
            {},
            this.props.text
          )
        )
      }
    }

    const element = createElement(
      App,
      {
        text: 'Hello World'
      }
    )

    expect(element.type).toBe(App)
    expect(element.props.text).toBe('Hello World')
  })
})
