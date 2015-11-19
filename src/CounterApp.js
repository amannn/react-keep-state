import React, { Component } from 'react';

export default class CounterApp extends Component {

  constructor(props) {
    super(props);
    this.state = {showChildren: true};
  }

  onToggleClick(e) {
    e.preventDefault();
    this.setState({showChildren: !this.state.showChildren});
  }

  render() {
    let {showChildren} = this.state;
    let {children} = this.props;

    return (
      <div>
        {showChildren ? children : 0}
        <a href="#" onClick={this.onToggleClick.bind(this)} className="CounterApp__toggle">
          Toggle
        </a>
      </div>
    )
  }
}
