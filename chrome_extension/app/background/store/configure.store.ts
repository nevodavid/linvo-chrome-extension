import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import connectionsReducer, { ConnectionsReducerState } from './reducers/connections.reducer';
import userReducer, { UserReducerState } from './reducers/user.reducer';

const rootReducer = combineReducers({
  connections: connectionsReducer,
  user: userReducer
});

export interface AppState {
  connections: ConnectionsReducerState[];
  user: UserReducerState;
}

const store = createStore(rootReducer, compose(applyMiddleware(thunk)));
export default store;
