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

export default Counter;
