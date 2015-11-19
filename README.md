# react-keep-state

This repository represents my attempt to find a good way to make sure that a React component will keep it's state, even if it's unmounted.

## Motivation

This was born because of the need, that the only other way to keep state was to save it in a Flux store. I found the boilerplate that is involved unsuitable for very simple state.

E.g. when a smart component only wants to remember the sort order of a list, it takes the following steps to set that up in [redux](https://github.com/rackt/redux):
- Set up an action constant.
- Set up an action.
- Maybe export that action from `/actions/index.js` (if you want to do `import {SortableListActions} from 'actions';`)
- Set up a reducer.
- Set up an initial state.
- Set up a getter for the state (Having views directly touch the app state is a bad practice in my opinion).
- Register the reducer with the redux store.
- May seperately export the getter (similar reason as with the actions)
- Set up the connection to the store in the container component (both getters and actions)

A lot of times there's really only a small setting I want to save and therefore the actions only consist of one action, the reducer only processes a single action type, there's only one variable put into the state and only one getter.

Don't get me wrong. I totally like redux (and use it in all my React projects so far). I just think for such things, it's not the right tool.

## My solution

A simple recipe without any kind of library involved.

```js
import React, { Component, PropTypes } from 'react';

// Set initial state
let state = { counter: 5 };

class Counter extends Component {

  constructor(props) {
    super(props);

    // Retrieve the last state
    this.state = state;
  }

  componentWillUnmount() {
    // Remember state for the next mount
    state = this.state;
  }

  onIncreaseClick(e) {
    e.preventDefault();
    this.setState({ counter: this.state.counter + 1 });
  }

  render() {
    return (
      <div className="Counter">
        <span className="Counter__value">
          { this.state.counter }
        </span>
        <a href="#" className="Counter__increase-button"
           onClick={this.onIncreaseClick.bind(this)}>
          Increase
        </a>
      </div>
    );
  }
}

export default Counter;
```

What's good:
 - It still uses the regular React syntax (`this.state` and `this.setState`) – no magic there.
 - No performance problems.
 - Only 3 lines you have to remember, therefore I think a library / higher order component / decorator is not worth it.
 - It isn't dependant on some logic in a parent component.

What's not so good:
 - This only works if the component is only used once within an app. But that is suitable for most [smart components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) (i.e. route handlers). Personally so far I didn't ran into a problem, where i wanted a reusable component to keep it's state between unmounts. If you have such a scenario, I'd suggest making it dependent on the state of a parent smart component, which could use the shown pattern.

If it's necessary to produce the internal state directly from props, this can be written as the following:

```js
import React, { Component, PropTypes } from 'react';

// Set initial state
let state = { somePrivateState: 'initial' };

class Counter extends Component {

  static propTypes = {
    initialCounter: PropTypes.number
  }

  constructor(props) {
    super(props);
    this.state = this.getStateFromProps(props);
  }

  componentWillReceiveProps(props) {
    this.setState(this.getStateFromProps(props));
  }

  componentWillUnmount() {
    state = this.state;
  }

  getStateFromProps(props) {
    // `this.state` is undefined when called from constructor.
    state = this.state ? this.state : state;

    return {
      ...state,
      currentCounter: props.initialCounter,
    };
  }

  onIncreaseClick(e) {
    e.preventDefault();
    this.setState({
      currentCounter: this.state.currentCounter + 1,
      somePrivateState: 'changed'
    });
  }

  render() {
    return (
      <div className="Counter">
        <span className="Counter__value">{ this.state.currentCounter }</span>
        <span className="Counter__private-value">{ this.state.somePrivateState }</span>
        <a href="#" className="Counter__increase-button"
           onClick={this.onIncreaseClick.bind(this)}>
          Increase
        </a>
      </div>
    );
  }
}

export default Counter;
```

This get's a little bit more complicated. If you have a lot of these usecases, I would consider the alternative solution. But from my experience, I've never encountered the need for something like that.

## Alternative solution

This is a [higher order component](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750) that makes sure, that a React component will keep it's state, even if it's unmounted.

```js
import React, { Component, PropTypes } from 'react';
import keepState from './keepStateHOC';

class Counter extends Component {
  static propTypes = {
    state: PropTypes.object.isRequired
  }

  onIncreaseClick(e) {
    e.preventDefault();
    let { setState, state } = this.props;
    setState({ counter: state.counter + 1 });
  }

  render() {
    return (
      <div className="Counter">
        <span className="Counter__value">{ this.props.state.counter }</span>
        <a href="#" className="Counter__increase-button"
           onClick={this.onIncreaseClick.bind(this)}>
          Increase
        </a>
      </div>
    );
  }
}

// The second parameter is the initial state. It's not optional,
// it needs to be at least an empty object (`{}`).
export default keepState(Counter, { counter: 4 })
```

The HOC is shown in `src/keepStateHOC.js`.

What's good:
 - A streamlined syntax that can be reused across the app.

What's not so good:
 - Syntax changes: `this.state` becomes `this.props.state` and `this.setState` becomes `this.props.setState`. This is what puts me off most about this solution.
 - This also only works if the component can only be used once.
 - I'm not sure yet, if and how it would affect application performance if you'd use a lot of HOCs.

This could also be implemented with a decorator:
```js
@keepState({counter: 0})
class Counter extends Component {
  ...
}
```
I really like that syntax, but a change in how you interact with the state is not worth it for me.

For the usecase of generating state from props this is a lot cleaner then the example without the HOC:
```js
@keepState(props => { return { currentCounter: props.initialCounter } } )
class Counter extends Component {
  ...
}
```

## Setup
The examples shown above are all tested. If you want to run the tests or experiment with something, you can do the following:
 - `npm install`
 - `npm run test` or `npm run test:watch`
