import { uniqBy } from 'lodash';
import { CONNECTIONS_ACTIONS } from '../actions/connections.action';

export interface ConnectionsReducerState {
  name: string;
  description: string;
  image: string;
  link: string;
  addConnection?: number;
}
export const defaultAuthState: any[] = [];

export default function connectionsReducer(
  state: ConnectionsReducerState[] = defaultAuthState,
  action: { type: CONNECTIONS_ACTIONS; payload: any }
) {
  switch (action.type) {
    default: {
      return [...state];
    }
    case CONNECTIONS_ACTIONS.ADD: {
      return uniqBy([
        ...state,
        ...action.payload.map((p: any) => ({
          ...p,
          addConnection: 1
        }))
      ], 'link');
    }
    case CONNECTIONS_ACTIONS.DELETE_CONNECTIONS: {
      return [];
    }

    case CONNECTIONS_ACTIONS.CHANGE_CHECKED: {
      return [
        ...state.map((s) => s.link === action.payload.link ? action.payload : s)
      ];
    }

    case CONNECTIONS_ACTIONS.MARK_SCHEDULE: {
      return [
        ...state.map((s) => ({
          ...s,
          addConnection: s.addConnection === 1 ? 2 : s.addConnection
        }))
      ];
    }
  }
}
