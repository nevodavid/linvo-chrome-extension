import { USER_ACTIONS } from '../actions/user.action';

export interface UserReducerState {
  linkedin_id: string;
  id: number;
  full_name: string;
  profile: string;
}
export const defaultReducerState: UserReducerState = {
  linkedin_id: '',
  id: 0,
  full_name: '',
  profile: ''
};

export default function userReducer(
  state: UserReducerState = defaultReducerState,
  action: { type: USER_ACTIONS; payload: any }
) {
  switch (action.type) {
    default: {
      return { ...state };
    }
    case USER_ACTIONS.UPDATE_USER: {
      return {
        ...state,
        ...action.payload
      };
    }
  }
}
