import { AddWidget, DeleteWidget, UpdateWidget, WidgetOptions, WIDGETS_ACTIONS } from '../actions/widgets';

export interface Widget {
    _id?: string;
    id: string;
    title: string;
    text: string;
    domain: string;
}
export interface WidgetState {
    [domain: string]: Widget[]
}

const initialState = {

};

export default function widgetReducer(state: WidgetState = initialState, action: WidgetOptions) {
  // @ts-ignore
  switch (action.type) {
    default: {
      return state;
    }
    case WIDGETS_ACTIONS.SET_ALL: {
      // @ts-ignore
      return action.payload;
    }

    case WIDGETS_ACTIONS.ADD_WIDGET: {
        // @ts-ignore
      const Payload: AddWidget = action.payload;
      return {
        ...state,
        [Payload.domain]: [
          ...(state[Payload.domain] || []),
          {
            id: Payload.id,
            title: Payload.title,
            text: Payload.text
          }
        ]
      };
    }
    case WIDGETS_ACTIONS.UPDATE_WIDGET: {
          // @ts-ignore
      const Payload: UpdateWidget = action.payload;
      return {
        ...state,
        [Payload.domain]: [
          ...(state[Payload.domain] || []).map((current) => {
            if (current.id !== Payload.id) {
              return current;
            }

            return {
              // eslint-disable-next-line no-underscore-dangle
              _id: Payload._id,
              id: Payload.id,
              title: Payload.title,
              text: Payload.text
            };
          })
        ]
      };
    }
    case WIDGETS_ACTIONS.DELETE_WIDGET: {
      // @ts-ignore
      const Payload: DeleteWidget = action.payload;
      return {
        ...state,
        [Payload.domain]: [
          ...(state[Payload.domain] || []).filter((current) => current.id !== Payload.id)
        ]
      };
    }
  }
}
