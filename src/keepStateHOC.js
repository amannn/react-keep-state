import objectAssign from 'object-assign';
import React, { Component } from 'react';

/**
 * @param {function} ComposedComponent A react component.
 * @param {object} initialState This should usually be `{}`. If an initial state
 *                              should be injected, this can also be done here.
 * @return {function} The enhanced component.
 */
export default (ComposedComponent, initialState) => class extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  setKeptState(newState) {
    objectAssign(initialState, newState);
    this.setState(initialState);
  }

  componentWillUnmount() {
    objectAssign(initialState, this.state);
  }

  render() {
    return <ComposedComponent {...this.props} setState={this.setKeptState.bind(this)} state={this.state} />;
  }
};
