import keepState from './keepStateHOC';
import Counter from './Counter';

export default keepState(Counter, { counter: 4 });
