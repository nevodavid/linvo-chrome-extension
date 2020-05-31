import {RegisterResponse, UserResponse, UserService} from '../../services/user.service';
import {log} from "util";
import {Widget} from "../reducers/widget";
import {EventState} from "../reducers/event";
import {EventsActions} from "./event";
import {WidgetsActions} from "./widgets";

export enum UserActionsEnum {
    SET_USER = 'SET_USER',
    REMOVE_USER = 'REMOVE_USER',
}

type SetUserAction<T> = {
    type: T,
    payload: UserResponse
}

type RemoveUserAction<T> = {
    type: T
}

export class UserActions {
    static setUser(payload: UserResponse): SetUserAction<UserActionsEnum.SET_USER> {
        return {
            type: UserActionsEnum.SET_USER,
            payload
        };
    }

    static removeUser(): RemoveUserAction<UserActionsEnum.REMOVE_USER> {
        return {
            type: UserActionsEnum.REMOVE_USER
        };
    }

  static register(fullname: string, email: string, password: string): any {
    return (dispatchEvent: any): Promise<any> => {
        return (async () => {
            try {
                const register = await UserService.register(fullname, email, password);
                if (!register) {
                    return;
                }

                dispatchEvent(UserActions.setUser(register));
                return register;
            }
            catch (err) {
                console.log(err);
                return ;
            }
        })();
    }
  }

    static login(email: string, password: string): any {
        return (dispatchEvent: any): Promise<any> => {
            return (async () => {
                try {
                    const login = await UserService.login(email, password);
                    if (!login) {
                        return;
                    }

                    const eventsGroup = login.events.reduce((all, current) => ({
                        ...all,
                        [current.domain]: [
                            // @ts-ignore
                            ...all[current.domain] ? all[current.domain] : [],
                            {
                                id: current.id,
                                _id: current._id,
                                groupName: current.groupName,
                                eventToolOpen: false,
                                isSyncedWithServer: true,
                                widget: current.widget,
                                events: current.events
                            }
                        ]
                    }), {});

                    const widgets = login.widgets.reduce((all, current) => ({
                        ...all,
                        [current.domain]: [
                            // @ts-ignore
                            ...all[current.domain] ? all[current.domain] : [],
                            {
                                ...current
                            }
                        ]
                    }), {});

                    dispatchEvent(UserActions.setUser(login.user));
                    dispatchEvent(EventsActions._setAll(eventsGroup));
                    dispatchEvent(WidgetsActions._set_all(widgets));
                    return login;
                }
                catch (err) {
                    console.log(err);
                    return ;
                }
            })();
        }
    }
}

export type UserActionsList = SetUserAction<UserActionsEnum.SET_USER> & RemoveUserAction<UserActionsEnum.REMOVE_USER>;
