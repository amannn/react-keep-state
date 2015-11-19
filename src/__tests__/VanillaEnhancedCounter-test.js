import React from 'react/addons';
const TestUtils = React.addons.TestUtils;
const {Simulate} = TestUtils;

import CounterApp from '../CounterApp';
import VanillaEnhancedCounter from '../VanillaEnhancedCounter';

describe('Vanilla usage (without HOC)', () => {
  it('keeps it\'s state when unmounting', () => {
    let node = React.findDOMNode(TestUtils.renderIntoDocument(
      <CounterApp>
        <VanillaEnhancedCounter />
      </CounterApp>
    ));

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
