import React, { Component, PropTypes } from 'react';

// Set initial state
let state = { counter: 5 };

class Counter extends Component {

  constructor(props) {
    super(props);
    this.state = state;
  }

  componentWillUnmount() {
    state = this.state;
  }

  onIncreaseClick(e) {
    e.preventDefault();
    this.setState({ counter: this.state.counter + 1 });
  }

  render() {
    return (
      <div className="Counter">
        <span className="Counter__value">{ this.state.counter }</span>
        <a href="#" className="Counter__increase-button"
           onClick={this.onIncreaseClick.bind(this)}>
          Increase
        </a>
      </div>
    );
  }
}

export default Counter;
