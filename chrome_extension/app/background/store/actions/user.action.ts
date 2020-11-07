import {UserReducerState} from "../reducers/user.reducer";

export enum USER_ACTIONS {
    UPDATE_USER = 'UPDATE_USER',
}

export class USER_ACTION {
    static updateUser = (payload: UserReducerState): any => ({
        type: USER_ACTIONS.UPDATE_USER,
        payload
    });
}
