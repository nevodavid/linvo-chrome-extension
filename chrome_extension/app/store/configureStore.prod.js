import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import storage from '../utils/storage';

const enhancer = compose(
  applyMiddleware(thunk),
  storage()
);

export default function (initialState) {
  return createStore(rootReducer, initialState, enhancer);
}
