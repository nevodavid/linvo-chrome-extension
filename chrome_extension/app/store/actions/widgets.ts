import {getUrl} from "./event";
import {WidgetsService} from "../../services/widgets.service";

export enum WIDGETS_ACTIONS {
    SET_ALL = 'SET_ALL_WIDGETS',
    ADD_WIDGET = 'ADD_WIDGET',
    UPDATE_WIDGET = 'UPDATE_WIDGET_WIDGET',
    DELETE_WIDGET = 'DELETE_WIDGET',
}

export interface EventAction<T extends WIDGETS_ACTIONS, M> {
    type: T,
    payload: M
}

interface BaseWidget {
    domain: string;
}

export interface AddWidget extends BaseWidget{
    id: string;
    title: string;
    text: string;
    type: 'pixel' | 'popup';
}

export interface UpdateWidget extends BaseWidget {
    _id?: string;
    id: string;
    type: 'pixel' | 'popup';
    title: string;
    text: string;
}

export interface DeleteWidget extends BaseWidget {
    id: string;
}

export class WidgetsActions {
    static _add_widget(payload: AddWidget): EventAction<WIDGETS_ACTIONS.ADD_WIDGET, AddWidget> {
        return {
            type: WIDGETS_ACTIONS.ADD_WIDGET,
            payload
        }
    }

    static _set_all(payload: any): EventAction<WIDGETS_ACTIONS.SET_ALL, any> {
        return {
            type: WIDGETS_ACTIONS.SET_ALL,
            payload
        }
    }

    static _delete_widget(payload: DeleteWidget): EventAction<WIDGETS_ACTIONS.DELETE_WIDGET, DeleteWidget> {
        return {
            type: WIDGETS_ACTIONS.DELETE_WIDGET,
            payload
        }
    }

    static _update_widget(payload: UpdateWidget): EventAction<WIDGETS_ACTIONS.UPDATE_WIDGET, UpdateWidget> {
        return {
            type: WIDGETS_ACTIONS.UPDATE_WIDGET,
            payload
        }
    }

    static AddWidget(payload: Omit<AddWidget, 'domain'>, domain = ''): any {
        return (dispatch: any) => {
            return (async () => {
                const widget = await WidgetsService.createWidget({
                    ...payload,
                    domain: domain || await getUrl()
                });

                dispatch(WidgetsActions._add_widget(widget));

                return widget;
            })();
        }
    }

    static DeleteWidget(payload: Omit<DeleteWidget, 'domain'>, domain = ''): any {
        return (dispatch: any) => {
            return (async () => {
                await WidgetsService.deleteWidget(payload.id);
                dispatch(WidgetsActions._delete_widget({
                    ...payload,
                    domain: domain || await getUrl()
                }));
                return payload;
            })();
        }
    }

    static UpdateWidget(payload: Omit<UpdateWidget, 'domain'>, domain = ''): any {
        return (dispatch: any) => {
            return (async () => {
                const widget = await WidgetsService.updateWidget({
                    ...payload,
                    domain: domain || await getUrl()
                });

                dispatch(WidgetsActions._update_widget(widget));
                return payload;
            })();
        }
    }
}

export type WidgetOptions = EventAction<WIDGETS_ACTIONS.ADD_WIDGET, AddWidget> &
EventAction<WIDGETS_ACTIONS.DELETE_WIDGET, DeleteWidget> &
EventAction<WIDGETS_ACTIONS.UPDATE_WIDGET, UpdateWidget>;
