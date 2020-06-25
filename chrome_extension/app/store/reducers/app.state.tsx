import { EventsState } from './event';
import { WidgetState } from './widget';

export interface AppState {
    user: {
        id?: number;
        hash?: string;
        injectToTest: boolean;
    },
    event: EventsState;
    widgets: WidgetState;
}
