import React, { Component, PropTypes } from 'react';

// Set initial state
let state = {somePrivateState: 'initial'};

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
