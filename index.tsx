import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Action, createStore } from 'redux';

const INCREMENT = "INCREMENT"
const DECREMENT = "DECREMENT"

function counter(state = 0, action: Action): number {
  switch (action.type) {
    case INCREMENT:
      return state + 1
    case DECREMENT:
      return state - 1
    default:
      return state
  }
}

interface ICounterProps {
  value: number,
  onIncrement: () => void,
  onDecrement: () => void
}

interface INoState {
}

class Counter extends React.Component<ICounterProps, INoState> {
  static propTypes = {
    value: React.PropTypes.number.isRequired,
    onIncrement: React.PropTypes.func.isRequired,
    onDecrement: React.PropTypes.func.isRequired
  }

  render() {
    const { value, onIncrement, onDecrement } = this.props
    return (
      <div>
        <p>Counter: {value}</p>
        <p>
          <button onClick={onIncrement}>+</button>
          <button onClick={onDecrement}>-</button>
        </p>
      </div>
    )
  }
}

const store = createStore(counter, 0)

function render() {
  ReactDOM.render(
    <Counter
      value={store.getState() || 0}
      onIncrement={() => store.dispatch({ type: INCREMENT })}
      onDecrement={() => store.dispatch({ type: DECREMENT })}
      />,
    document.getElementById('root')
  )
}

render()
store.subscribe(render)
