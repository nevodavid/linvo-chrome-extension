import {
  AddEventGroupPayload,
  AddEventToEventGroup,
  ChangeEventGroupOpen,
  ChangeEventGroupSave,
  DeleteEvent,
  DeleteEventGroup,
  EventActionsEnum,
  EventsOptions,
  UpdateEvent,
  UpdateEventGroup,
  UpdateGroupName,
  UpdateWidget
} from '../actions/event';
import {Widget} from './widget';

export interface EventState {
  _id?: string;
  id: string;
  picture: string;
  url: string;
  match: string;
  order: number;
}

export interface EventGroupState {
  id: string;
  groupName: string,
  eventToolOpen: boolean,
  isSyncedWithServer: boolean,
  widget?: Widget,
  events: EventState[]
}
export interface EventsState {
    [domain: string]: EventGroupState[]
}

const initialState: EventsState = {

};


export default function event(state: EventsState = initialState, action: EventsOptions) {
  // @ts-ignore
  switch (action.type) {
    default:
      return {
        ...state
      };

    case EventActionsEnum.SET_ALL: {
      // @ts-ignore
      return {...action.payload};
    }

    case EventActionsEnum.ADD_EVENT_GROUP: {
            // @ts-ignore
      const newPayload: AddEventGroupPayload = action.payload;
      return {
        ...state,
        [newPayload.domain]: [
          ...(state[newPayload.domain] || []).map(past => ({
            ...past,
            eventToolOpen: false
          })),
          {
            id: newPayload.id,
            groupName: newPayload.groupName,
            eventToolOpen: newPayload.eventToolOpen,
            isSyncedWithServer: false,
            events: []
          }
        ]
      };
    }

    case EventActionsEnum.ADD_EVENT_TO_EVENT_GROUP: {
          // @ts-ignore
      const newPayload: AddEventToEventGroup = action.payload;
      return {
        ...state,
        [newPayload.domain]: state[newPayload.domain].map(group => {
          if (group.id !== newPayload.group_id) {
            return group;
          }

          return {
            ...group,
            isSyncedWithServer: false,
            events: [
              ...group.events,
              {
                id: newPayload.id,
                picture: newPayload.picture,
                url: newPayload.url,
                match: newPayload.match,
                order: newPayload.order
              }
            ]
          };
        })
      };
    }

    case EventActionsEnum.CHANGE_EVENT_GROUP_OPEN: {
          // @ts-ignore
      const newPayload: ChangeEventGroupOpen = action.payload;
      return {
        ...state,
        [newPayload.domain]: state[newPayload.domain].map(group => ({
          ...group,
          eventToolOpen: group.id !== newPayload.group_id ? false : newPayload.eventToolOpen
        }))
      };
    }

    case EventActionsEnum.CHANGE_EVENT_GROUP_SAVE: {
          // @ts-ignore
      const newPayload: ChangeEventGroupSave = action.payload;
      return {
        ...state,
        [newPayload.domain]: state[newPayload.domain].map(group => {
          if (group.id !== newPayload.group_id) {
            return group;
          }

          return {
            ...group,
            isSyncedWithServer: newPayload.isSyncedWithServer
          };
        })
      };
    }

    case EventActionsEnum.DELETE_EVENT_GROUP: {
          // @ts-ignore
      const newPayload: DeleteEventGroup = action.payload;
      return {
        ...state,
        [newPayload.domain]: state[newPayload.domain].filter(group => group.id !== newPayload.id)
      };
    }

    case EventActionsEnum.DELETE_EVENT: {
          // @ts-ignore
      const newPayload: DeleteEvent = action.payload;
      return {
        ...state,
        [newPayload.domain]: state[newPayload.domain].map(group => {
          if (group.id !== newPayload.group_id) {
            return group;
          }

          return {
            ...group,
            events: group.events.filter(e => e.id !== newPayload.id)
          };
        })
      };
    }

    case EventActionsEnum.UPDATE_GROUP_NAME: {
      // @ts-ignore
      const newPayload: UpdateGroupName = action.payload;
      return {
        ...state,
        [newPayload.domain]: state[newPayload.domain].map(group => {
          if (group.id !== newPayload.id) {
            return group;
          }

          return {
            ...group,
            groupName: newPayload.groupName,
          };
        })
      };
    }

    case EventActionsEnum.UPDATE_EVENT_GROUP: {
          // @ts-ignore
      const newPayload: UpdateEventGroup = action.payload;
      return {
        ...state,
        [newPayload.domain]: state[newPayload.domain].map(group => {
          if (group.id !== newPayload.id) {
            return group;
          }

          return {
            id: newPayload.id,
            groupName: newPayload.groupName,
            eventToolOpen: newPayload.eventToolOpen,
            isSyncedWithServer: true,
            events: newPayload.events,
            widget: newPayload.widget
          };
        })
      };
    }

    case EventActionsEnum.UPDATE_EVENT_IN_GROUP: {
          // @ts-ignore
      const newPayload: UpdateEvent = action.payload;
      return {
        ...state,
        [newPayload.domain]: state[newPayload.domain].map(group => {
          if (group.id !== newPayload.group_id) {
            return group;
          }

          return {
            ...group,
            events: group.events.map(eventr => {
              if (eventr.id !== newPayload.id) {
                return eventr;
              }

              return {
                id: newPayload.id,
                picture: newPayload.picture,
                url: newPayload.url,
                match: newPayload.match,
              };
            })
          };
        })
      };
    }

    case EventActionsEnum.UPDATE_WIDGET: {
      // @ts-ignore
      const newPayload: UpdateWidget = action.payload;
      return {
        ...state,
        [newPayload.domain]: state[newPayload.domain].map(group => {
          if (group.id !== newPayload.group_id) {
            return group;
          }

          return {
            ...group,
            isSyncedWithServer: false,
            widget: newPayload.widget
          };
        })
      };
    }
  }
}
