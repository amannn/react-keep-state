import ReactDOM from 'react-dom';
import keepState from './keepStateHOC';

let onIncreaseClick = (e) => {
  e.preventDefault();
  let { setState, state } = this.props;
  setState({ counter: state.counter + 1 });
}

const Counter = ({state}) => (
  <div className="Counter">
    <span className="Counter__value">{ state.counter }</span>
    <a
      href="#"
      className="Counter__increase-button"
      onClick={onIncreaseClick}
    >
      increase
    </a>
  </div>
);

Counter.propTypes = {
  state: PropTypes.object.isRequired
};

export default EnhancedCounter = keepState(Counter, {}, {counter: 0});
