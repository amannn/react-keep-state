import React from 'react/addons';
const TestUtils = React.addons.TestUtils;
const {Simulate} = TestUtils;

import CounterApp from '../CounterApp';
import VanillaEnhancedCounterWithStateFromProps from '../VanillaEnhancedCounterWithStateFromProps';

describe('Vanilla usage (without HOC) with state from props', () => {
  it('keeps it\'s state when unmounting', () => {
    let node = React.findDOMNode(TestUtils.renderIntoDocument(
      <CounterApp>
        <VanillaEnhancedCounterWithStateFromProps initialCounter={10} />
      </CounterApp>
    ));

    // Check if private value was set correctly
    let privateValueNode = node.querySelector('.Counter__private-value');
    expect(privateValueNode.textContent).toBe('initial');

    // Change state
    Simulate.click(node.querySelector('.Counter__increase-button'));

    // Unmount
    Simulate.click(node.querySelector('.CounterApp__toggle'));
    expect(node.querySelector('.Counter')).toBeFalsy();

    // Remount
    Simulate.click(node.querySelector('.CounterApp__toggle'));
    expect(node.querySelector('.Counter')).toBeTruthy();
    let value = node.querySelector('.Counter__value').textContent;
    expect(value).toBe('10');
    expect(privateValueNode.textContent).toBe('changed');
  });
});
