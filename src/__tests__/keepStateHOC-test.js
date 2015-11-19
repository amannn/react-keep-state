import React from 'react/addons';
const TestUtils = React.addons.TestUtils;
const {Simulate} = TestUtils;

import keepState from '../keepStateHOC';
import Counter from '../Counter';
import EnhancedCounter from '../EnhancedCounter';
import CounterApp from '../CounterApp';
import VanillaEnhancedCounter from '../VanillaEnhancedCounter';

let getNodeFor = component =>
  React.findDOMNode(TestUtils.renderIntoDocument(React.createElement(component)));

describe('Usage without parent React component', () => {
  it('renders the actual component', () => {
    let counter = keepState(Counter, { counter: 0 });
    let node = getNodeFor(counter);
    let value = node.querySelector('.Counter__value').textContent;
    expect(node.classList.contains('Counter')).toBeTruthy();
  });

  it('renders the initial state', () => {
    let counter = keepState(Counter, { counter: 5 });
    let node = getNodeFor(counter);
    let value = node.querySelector('.Counter__value').textContent;
    expect(value).toBe('5');
  });

  it('can change its state', done => {
    let counter = keepState(Counter, { counter: 2 });
    let node = getNodeFor(counter);
    Simulate.click(node.querySelector('.Counter__increase-button'));
    let value = node.querySelector('.Counter__value').textContent;
    expect(value).toBe('3');
  });
});

describe('Usage with parent React component', () => {
  it('renders within a parent', () => {
    let LocalEnhancedCounter = keepState(Counter, { counter: 1 });
    let node = React.findDOMNode(TestUtils.renderIntoDocument(
      <CounterApp>
        <EnhancedCounter />
      </CounterApp>
    ));

    let counterNode = node.querySelector('.Counter');
    expect(counterNode.classList.contains('Counter')).toBeTruthy();
  });

  it('keeps it\'s state when unmounting', () => {
    let LocalEnhancedCounter = keepState(Counter, { counter: 4 });
    let node = React.findDOMNode(TestUtils.renderIntoDocument(
      <CounterApp>
        <LocalEnhancedCounter />
      </CounterApp>
    ));

    // Unmount
    Simulate.click(node.querySelector('.CounterApp__toggle'));
    expect(node.querySelector('.Counter')).toBeFalsy();

    // Remount
    Simulate.click(node.querySelector('.CounterApp__toggle'));
    expect(node.querySelector('.Counter')).toBeTruthy();
    let value = node.querySelector('.Counter__value').textContent;
    expect(value).toBe('4');
  });
});

describe('Usage with HOC being applied directly in file', () => {
  it('keeps it\'s state when unmounting', () => {
    let node = React.findDOMNode(TestUtils.renderIntoDocument(
      <CounterApp>
        <EnhancedCounter />
      </CounterApp>
    ));

    // Change state
    Simulate.click(node.querySelector('.Counter__increase-button'));

    // Unmount
    Simulate.click(node.querySelector('.CounterApp__toggle'));
    expect(node.querySelector('.Counter')).toBeFalsy();

    // Remount
    Simulate.click(node.querySelector('.CounterApp__toggle'));
    expect(node.querySelector('.Counter')).toBeTruthy();
    let value = node.querySelector('.Counter__value').textContent;
    expect(value).toBe('5');
  });
});
