import { EventsState } from './event';
import { WidgetState } from './widget';

export interface AppState {
    user: {
        id?: number;
        hash?: string;
    },
    event: EventsState;
    widgets: WidgetState;
}
