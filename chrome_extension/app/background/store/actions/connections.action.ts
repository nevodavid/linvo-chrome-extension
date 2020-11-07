import {ConnectionsReducerState} from "../reducers/connections.reducer";

export enum CONNECTIONS_ACTIONS {
    ADD = 'ADD_CONNECTIONS',
    DELETE_CONNECTIONS = 'DELETE_CONNECTIONS',
    CHANGE_CHECKED = 'CHANGE_CHECKED',
    MARK_SCHEDULE = 'MARK_SCHEDULE'
}
export class CONNECTIONS_ACTION {
    static addConnections = (payload: ConnectionsReducerState[]): any => ({
        type: CONNECTIONS_ACTIONS.ADD,
        payload
    });

    static changeChecked = (payload: ConnectionsReducerState): any => ({
        type: CONNECTIONS_ACTIONS.CHANGE_CHECKED,
        payload
    });

    static markConnectionsAsSchedule = (): any => ({
        type: CONNECTIONS_ACTIONS.MARK_SCHEDULE
    });

    static removeAll = () => ({
        type: CONNECTIONS_ACTIONS.DELETE_CONNECTIONS
    })
}
