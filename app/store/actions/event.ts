import { v1 as uuidv1 } from 'uuid';
import {AppState} from "../reducers/app.state";
import {EventsService} from "../../services/events.service";
import {Widget} from "../reducers/widget";

export enum EventActionsEnum {
    SET_ALL = 'SET_ALL_EVENTS',
    ADD_EVENT_GROUP = 'ADD_EVENT_GROUP',
    ADD_EVENT_TO_EVENT_GROUP = 'ADD_EVENT_TO_EVENT_GROUP',
    CHANGE_EVENT_GROUP_OPEN = 'CHANGE_EVENT_GROUP_OPEN',
    CHANGE_EVENT_GROUP_SAVE = 'CHANGE_EVENT_GROUP_SAVE',
    DELETE_EVENT_GROUP = 'DELETE_EVENT_GROUP',
    UPDATE_EVENT_GROUP = 'UPDATE_EVENT_GROUP',
    UPDATE_EVENT_IN_GROUP = 'UPDATE_EVENT_IN_GROUP',
    DELETE_EVENT = 'DELETE_EVENT',
    UPDATE_WIDGET = 'UPDATE_WIDGET',
    UPDATE_GROUP_NAME = 'UPDATE_GROUP_NAME',
}

export interface BasicInformation {
    domain: string;
}

export interface AddEventGroupPayload extends BasicInformation {
    id: string;
    groupName: string,
    eventToolOpen: boolean,
    events: any;
    widget: Widget;
}

export interface UpdateGroupName {
    domain: string;
    id: string;
    groupName: string;
}

export interface AddEventToEventGroup extends BasicInformation {
    group_id: string;
    id: string;
    url: string,
    match: string,
    picture: string;
    order: number;
}

export interface ChangeEventGroupOpen extends BasicInformation {
    group_id: string;
    eventToolOpen: boolean;
}

export interface ChangeEventGroupSave extends BasicInformation {
    group_id: string;
    isSyncedWithServer: boolean;
}

export interface DeleteEventGroup extends BasicInformation {
    id: string;
}

export interface UpdateWidget extends BasicInformation {
    group_id: string;
    widget: Widget;
}

export interface DeleteEvent extends BasicInformation {
    group_id: string;
    id: string;
}

export type AddEventGroup = AddEventGroupPayload & BasicInformation;

export interface UpdateEventGroup extends AddEventGroup {
}

export type AddEvent = AddEventToEventGroup & BasicInformation;

export interface UpdateEvent extends AddEvent {
}

export interface EventAction<T extends EventActionsEnum, M> {
    type: T,
    payload: M
}

export const getUrl = async () => {
    if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
        return ((await new Promise(res => chrome.runtime.sendMessage({todo: 'getCurrentUrl'}, (url) => {
            res(url);
        }))) as any).url;
    }
    return window.location.host;
}

export const getHtml = async () => {
    if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
        return ((await new Promise(res => chrome.runtime.sendMessage({todo: 'getHtml'}, (html) => {
            res(html);
        }))) as any).html;
    }
}

export class EventsActions {
    static _addEventGroupPayload(payload: AddEventGroupPayload): EventAction<EventActionsEnum.ADD_EVENT_GROUP, AddEventGroupPayload> {
        return {
            type: EventActionsEnum.ADD_EVENT_GROUP,
            payload
        }
    }

    static _updateGroupName(payload: UpdateGroupName): EventAction<EventActionsEnum.UPDATE_GROUP_NAME, UpdateGroupName> {
        return {
            type: EventActionsEnum.UPDATE_GROUP_NAME,
            payload
        }
    }

    static _addEventToEventGroup(payload: AddEventToEventGroup): EventAction<EventActionsEnum.ADD_EVENT_TO_EVENT_GROUP, AddEventToEventGroup> {
        return {
            type: EventActionsEnum.ADD_EVENT_TO_EVENT_GROUP,
            payload
        }
    }

    static _setAll(payload: any): EventAction<EventActionsEnum.SET_ALL, any> {
        return {
            type: EventActionsEnum.SET_ALL,
            payload
        }
    }

    static _changeEventGroupOpen(payload: ChangeEventGroupOpen): EventAction<EventActionsEnum.CHANGE_EVENT_GROUP_OPEN, ChangeEventGroupOpen> {
        return {
            type: EventActionsEnum.CHANGE_EVENT_GROUP_OPEN,
            payload
        }
    }

    static _changeEventGroupSave(payload: ChangeEventGroupSave): EventAction<EventActionsEnum.CHANGE_EVENT_GROUP_SAVE, ChangeEventGroupSave> {
        return {
            type: EventActionsEnum.CHANGE_EVENT_GROUP_SAVE,
            payload
        }
    }

    static _deleteEventGroup(payload: DeleteEventGroup): EventAction<EventActionsEnum.DELETE_EVENT_GROUP, DeleteEventGroup> {
        return {
            type: EventActionsEnum.DELETE_EVENT_GROUP,
            payload
        }
    }

    static _updateEventGroup(payload: UpdateEventGroup): EventAction<EventActionsEnum.UPDATE_EVENT_GROUP, UpdateEventGroup> {
        return {
            type: EventActionsEnum.UPDATE_EVENT_GROUP,
            payload
        }
    }

    static _updateEvent(payload: UpdateEvent): EventAction<EventActionsEnum.UPDATE_EVENT_IN_GROUP, UpdateEvent> {
        return {
            type: EventActionsEnum.UPDATE_EVENT_IN_GROUP,
            payload
        }
    }

    static _deleteEvent(payload: DeleteEvent): EventAction<EventActionsEnum.DELETE_EVENT, DeleteEvent> {
        return {
            type: EventActionsEnum.DELETE_EVENT,
            payload
        }
    }

    static _updateWidget(payload: UpdateWidget): EventAction<EventActionsEnum.UPDATE_WIDGET, UpdateWidget> {
        return {
            type: EventActionsEnum.UPDATE_WIDGET,
            payload
        }
    }

    static createNewEvent(urlString = ''): any {
        return (dispatchEvent: any): Promise<any> => {
            const id = uuidv1();
            return (async () => {
                const url = urlString || await getUrl();


                const toAdd = await EventsService.createEventGroup({
                    domain: url,
                    eventToolOpen: true,
                    groupName: 'Unnamed event',
                    id
                });

                dispatchEvent(EventsActions._addEventGroupPayload(toAdd));

                return toAdd;
            })();
        }
    };

    static saveEventGroup(groupId: string, groupName: string, events: Array<{_id?: string, id: string, url: string, picture: string, match: string, order: number}>, urlString = '', widget?: Widget): any {
        return (dispatchEvent: any): Promise<any> => {
            return (async () => {
                const url = urlString || await getUrl();

                const savedGroup = await EventsService.saveEventGroup({
                    domain: url,
                    eventToolOpen: true,
                    groupName: groupName,
                    id: groupId,
                    widget,
                    events
                });

                dispatchEvent(EventsActions._updateEventGroup(savedGroup));

                return savedGroup;
            })();
        }
    }

    static addEventToEventGroup(group_id: string, url: string, picture: string, match: string, order: number): any {
        return (dispatchEvent: any): Promise<any> => {
            const id = uuidv1();
            return (async () => {
                const add = {
                    domain: window.location.host,
                    group_id,
                    url,
                    picture,
                    match,
                    id,
                    order
                };

                dispatchEvent(EventsActions._addEventToEventGroup(add));
                return add;
            })();
        }
    };

    static closeEventGroup(group_id: string): any{
        return (dispatchEvent: any): any => {
            return (async () => {
                const url = await getUrl();
                dispatchEvent(EventsActions._changeEventGroupOpen({
                    domain: url,
                    eventToolOpen: false,
                    group_id
                }));
            })();
        }
    }

    static openEventGroup(group_id: string, urlString = ''): any{
        return (dispatchEvent: any): any => {
            return (async () => {
                const url = urlString || await getUrl();
                dispatchEvent(EventsActions._changeEventGroupOpen({
                    domain: url,
                    eventToolOpen: true,
                    group_id
                }));
            })();
        }
    }

    static deleteEvent(group_id: string, event_id: string): any{
        return (dispatchEvent: any): any => {
            return (async () => {
                const url = await getUrl();
                dispatchEvent(EventsActions._deleteEvent({
                    domain: url,
                    group_id,
                    id: event_id
                }));
            })();
        }
    }
}

export const GetEvents = ((app: AppState) => {
    return {...(app.event[window.location.host] || []).find(app => app.eventToolOpen)};
});

export type EventsOptions = EventAction<EventActionsEnum.ADD_EVENT_GROUP, AddEventGroupPayload> &
EventAction<EventActionsEnum.ADD_EVENT_TO_EVENT_GROUP, AddEventToEventGroup> &
EventAction<EventActionsEnum.CHANGE_EVENT_GROUP_OPEN, ChangeEventGroupOpen> &
EventAction<EventActionsEnum.CHANGE_EVENT_GROUP_SAVE, ChangeEventGroupSave> &
EventAction<EventActionsEnum.DELETE_EVENT_GROUP, DeleteEventGroup> &
EventAction<EventActionsEnum.UPDATE_EVENT_GROUP, UpdateEventGroup> &
EventAction<EventActionsEnum.UPDATE_EVENT_IN_GROUP, UpdateEvent> &
EventAction<EventActionsEnum.DELETE_EVENT, DeleteEvent>;
